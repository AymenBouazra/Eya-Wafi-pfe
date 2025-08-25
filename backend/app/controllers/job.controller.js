const Job = require('../models/job');
const Skill = require('../models/skill');

exports.createJob = async (req, res) => {
  try {
    const { title, departement, description, requirements, requiredSkills } = req.body;
    
    const skills = await Skill.find({ _id: { $in: requiredSkills } });
    if (skills.length !== requiredSkills.length) {
      return res.status(400).json({ error: 'One or more skills not found' });
    }

    const job = new Job({
      title,
      departement,
      description,
      requirements,
      requiredSkills,
      postedBy: req.userId
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllJobsPaginated = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const filter = {};
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const total = await Job.countDocuments();

    const jobs = await Job.find(filter)
      .populate('requiredSkills')
      .populate('postedBy', 'email profile.firstName profile.lastName')
      .skip(skip)
      .limit(limitNumber);

    res.json({
      data: jobs,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
        hasNextPage: pageNumber * limitNumber < total,
        hasPreviousPage: pageNumber > 1
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const { department, isActive } = req.query;
    const filter = {};
    
    if (department) filter.department = department;
    if (isActive !== undefined) filter.isActive = isActive;

    const jobs = await Job.find(filter)
      .populate('requiredSkills')
      .populate('postedBy', 'email profile.firstName profile.lastName');

    res.json(jobs);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: error.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('requiredSkills')

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    )
    .populate('requiredSkills');

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    job.isActive = !job.isActive;
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};