const MobilityRequest = require('../models/mobilityRequest');
const User = require('../models/user');
const Job = require('../models/job');
const NotificationService = require('../services/notification.service');

exports.createRequest = async (req, res) => {
  try {
    const { jobId, motivation } = req.body;
    const employeeId = req.userId;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if user already has a pending request for this job
    const existingRequest = await MobilityRequest.findOne({
      employee: employeeId,
      job: jobId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'You already have a pending request for this job' });
    }

    const request = new MobilityRequest({
      employee: employeeId,
      job: jobId,
      motivation,
      status: 'pending',
      currentStep: 'manager_approval'
    });

    await request.save();
    
    // Populate the request for response
    const populatedRequest = await MobilityRequest.findById(request._id)
      .populate('employee', 'email profile.firstName profile.lastName')
      .populate('job', 'title department');

    // Notify manager
    await NotificationService.notifyManager(employeeId, request._id);
    
    // Notify employee
    await NotificationService.createNotification(
     employeeId, 
     'mobility_status', 
     'Votre demande a été approuvée',
     request._id,
     'MobilityRequest'
   );

    res.status(201).json(populatedRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmployeeRequests = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const requests = await MobilityRequest.find({ employee: employeeId })
      .populate('job', 'title department')
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
    .populate('employee', 'profile.firstName profile.lastName profile.department')
    .populate('job', 'title department')
    .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.managerApproval = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { approved, comment } = req.body;
    const managerId = req.userId;

    const request = await MobilityRequest.findById(requestId)
      .populate('employee')
      .populate('job');

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Verify the manager is the employee's manager
    if (request.employee.manager.toString() !== managerId) {
      return res.status(403).json({ error: 'You are not authorized to approve this request' });
    }

    request.managerApproval = {
      approved,
      comment,
      date: new Date()
    };
    request.status = approved ? 'hr_review' : 'rejected';
    request.currentStep = approved ? 'hr_approval' : 'rejected';

    await request.save();
    
    // Notify employee and HR
    await NotificationService.notifyMobilityStatus(request);

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHRApprovalRequests = async (req, res) => {
  try {
    const requests = await MobilityRequest.find({ currentStep: 'hr_approval' })
      .populate('employee', 'profile.firstName profile.lastName profile.department')
      .populate('job', 'title department')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.hrApproval = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { approved, comment } = req.body;

    const request = await MobilityRequest.findById(requestId)
      .populate('employee')
      .populate('job');

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.currentStep !== 'hr_approval') {
      return res.status(400).json({ error: 'Request is not in HR approval stage' });
    }

    request.hrApproval = {
      approved,
      comment,
      date: new Date()
    };
    request.status = approved ? 'completed' : 'rejected';
    request.currentStep = approved ? 'completed' : 'rejected';

    if (approved) {
      // Update employee's position and department
      await User.findByIdAndUpdate(request.employee._id, {
        'profile.position': request.job.title,
        'profile.department': request.job.department
      });
    }

    await request.save();
    
    // Notify employee and manager
    await NotificationService.notifyMobilityStatus(request);

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      .populate('employee', 'profile.firstName profile.lastName profile.department')
      .populate('job', 'title department')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};