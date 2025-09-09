
const MobilityRequest = require('../models/mobilityRequest');
const User = require('../models/user');
const Job = require('../models/job');
const NotificationService = require('../services/notification.service');
const { createTransport } = require('nodemailer');

exports.createRequest = async (req, res) => {
  try {
    const { job, motivation, employee } = req.body;

    // Check if job exists
    const jobFound = await Job.findById(job);
    if (!jobFound) {
      return res.status(404).json({ message: 'Job not found' });
    }
    const employeeFound = await User.findById(employee);
    if (!employeeFound) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    // Check if user already has a pending request for this job
    const existingRequest = await MobilityRequest.findOne({
      employee: employee,
      job: job,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Vous avez déjà une demande en cours pour cette offre de travail' });
    }

    const request = new MobilityRequest({
      employee: employee,
      job: job,
      motivation,
      manager: employeeFound.manager,
    });

    await request.save();
    await User.findByIdAndUpdate(employee, { $push: { applications: request._id } });
    
    // Notify manager
    await NotificationService.notifyManager(employee, request._id);

    res.status(201).json({ message: 'Demande de mobilité soumise avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await MobilityRequest.findByIdAndDelete(id);
    await User.findByIdAndUpdate(request.employee, { $pull: { applications: id } });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all mobility requests (for HR)
exports.getAllMobilityRequestsPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;

    const total = await MobilityRequest.countDocuments();
    const requests = await MobilityRequest.find()
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .populate('employee')
      .populate('job')
      .populate('manager')
      .lean();

    res.json({
      data: requests,
      pagination: {
        total,
        page,
        itemsPerPage
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getEmployeeRequests = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const requests = await MobilityRequest.find({ employee: employeeId })
      .populate('job', 'title departement')
      .populate('employee', 'profile.firstName profile.lastName profile.departement')
      .populate('manager', 'profile.firstName profile.lastName profile.departement')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmployeeRequestsByManager = async (req, res) => {
  try {
    
    const { manager } = req.query;
    const requests = await User.find({ manager: manager })
      .populate('employee', 'profile.firstName profile.lastName profile.departement')
      .populate('manager', 'profile.firstName profile.lastName profile.departement')
      .populate('job', 'title departement')      
      .sort({ createdAt: -1 });

      res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getManagerApprovalRequests = async (req, res) => {
  try {
    const managerId = req.userId;
    
    // Get all employees managed by this manager
    const employees = await User.find({ manager: managerId }).select('_id');
    const employeeIds = employees.map(e => e._id);

    const requests = await MobilityRequest.find({
      employee: { $in: employeeIds },
      currentStep: 'manager_approval'
    })
    .populate('employee', 'profile.firstName profile.lastName profile.departement')
    .populate('job', 'title departement')
    .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve/Reject by current manager (employee's manager)
exports.currentManagerApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved, comment } = req.body;
    const userId = req.userId;

    const request = await MobilityRequest.findById(id).populate('employee');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    console.log({ request });

    // Only the current manager of the employee can approve/reject
    if (String(request.employee.manager) !== String(userId) || request.currentStep !== 'current_manager_approval') {

      return res.status(403).json({ message: 'Not authorized' });
    }

    request.currentManagerApproval = {
      approved,
      comment,
      date: new Date(),
      manager: userId
    };
    request.status = approved ? 'current_manager_approved' : 'rejected';
    request.currentStep = approved ? 'manager_approval' : 'rejected';
    await request.save();
    const user = await User.findById(request.employee);
    const transporter = createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    if (approved) {
        await transporter.sendMail({
            from: `<Eya Wafi> ${process.env.EMAIL}`,
            to: user.email,
            subject: "Nouvelle sur votre demande de mobilité",
            html: `
          <h2>Nouvelle sur votre demande de mobilité</h2><br>
          <p>Votre demande de mobilité a été approuvée.</p>
        `,
        });
    } else {
        await transporter.sendMail({
            from: `<Eya Wafi> ${process.env.EMAIL}`,
            to: user.email,
            subject: "Nouvelle sur votre demande de mobilité",
            html: `
          <h2>Nouvelle sur votre demande de mobilité</h2><br>
          <p>Votre demande de mobilité a été rejetée.</p>
        `,
        });
    }

    res.json({ message: approved ? 'Demande approuvée' : 'Demande rejetée', request });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Approve/Reject by job's postedBy manager
exports.managerApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved, comment } = req.body;
    const userId = req.userId;

    const request = await MobilityRequest.findById(id).populate('job');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Only the manager who posted the job can approve/reject
    if (String(request.job.postedBy) !== String(userId) || request.currentStep !== 'manager_approval') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.departureManagerApproval = {
      approved,
      comment,
      date: new Date(),
      manager: userId
    };
    request.status = approved ? 'manager_approved' : 'rejected';
    request.currentStep = approved ? 'hr_approval' : 'rejected';
    await request.save();
    const user = await User.findById(request.employee);
    const transporter = createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD
                    }
                });
    if (approved) {
      await transporter.sendMail({
        from: `<Eya Wafi> ${process.env.EMAIL}`,
        to: user.email,
        subject: "Nouvelle sur votre demande de mobilité",
        html: `
          <h2>Nouvelle sur votre demande de mobilité</h2><br>
          <p>Votre demande de mobilité a été approuvée.</p>
        `,
      });
    } else {
      await transporter.sendMail({
        from: `<Eya Wafi> ${process.env.EMAIL}`,
        to: user.email,
        subject: "Nouvelle sur votre demande de mobilité",
        html: `
          <h2>Nouvelle sur votre demande de mobilité</h2><br>
          <p>Votre demande de mobilité a été rejetée.</p>
        `,
      });
    } 

    res.json({ message: approved ? 'Demande approuvée' : 'Demande rejetée', request });
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Approve/Reject by HR
exports.hrApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved, comment } = req.body;
    const userId = req.userId;

    const request = await MobilityRequest.findById(id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Only HR can approve/reject at this step
    if (request.currentStep !== 'hr_approval') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.hrApproval = {
      approved,
      comment,
      date: new Date(),
      hr: userId
    };
    request.status = approved ? 'hr_approved' : 'rejected';
    request.currentStep = approved ? 'completed' : 'rejected';
    await request.save();
    const transporter = createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD
                    }
                });
    if (approved) {
      const user = await User.findByIdAndUpdate(request.employee, { $set: { job: request.job } });
      await transporter.sendMail({
          from: `<Eya Wafi> ${process.env.EMAIL}`,
          to: user.email,
          subject: "Nouvelle sur votre demande de mobilité",
          html: ` 
    <h2>Nouvelle sur votre demande de mobilité</h2><br>
    <p>Votre demande de mobilité a été approuvée.</p>
    `,
      });
    } else {
      const user = await User.findById(request.employee);
      await transporter.sendMail({
          from: `<Eya Wafi> ${process.env.EMAIL}`,
          to: user.email,
          subject: "Nouvelle sur votre demande de mobilité",
          html: ` 
           <h2>Nouvelle sur votre demande de mobilité</h2><br>
           <p>Votre demande de mobilité a été rejetée.</p>
           `,
      });
    }
    res.json({ message: approved ? 'Demande approuvée' : 'Demande rejetée', request });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getMobilityHistory = async (req, res) => {
  try {
    const { department, status, fromDate, toDate } = req.query;
    const filter = {};
    
    if (department) filter['job.department'] = department;
    if (status) filter.status = status;
    
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }

    const requests = await MobilityRequest.find(filter)
      .populate('employee', 'profile.firstName profile.lastName profile.departement')
      .populate('job', 'title departement')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRequestsByManagerPaginated = async (req, res) => {
  try {
    const managerId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;

    // Find employees managed by this manager
    const employees = await User.find({ manager: managerId }).select('_id');
    const employeeIds = employees.map(e => e._id);

    // Paginate mobility requests for these employees
    const filter = { employee: { $in: employeeIds } };
    const total = await MobilityRequest.countDocuments(filter);
    const requests = await MobilityRequest.find(filter)
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .populate('employee')
      .populate('job')
      .populate('manager')
      .lean();

    res.json({
      data: requests,
      pagination: {
        total,
        page,
        itemsPerPage
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const request = await MobilityRequest.findByIdAndUpdate(id, updates, { new: true });
    if (!request) return res.status(404).json({ message: 'Request not found' });

    res.json({ message: 'Request updated successfully', request });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
