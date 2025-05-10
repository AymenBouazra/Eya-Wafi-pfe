const Job = require('../models/job');
const Skill = require('../models/skill');

exports.createJob = async (req, res) => {
  try {
    const { title, department, description, requirements, requiredSkills } = req.body;
    
    // Verify all skills exist
    const skillIds = requiredSkills.map(s => s.skill);
    const skills = await Skill.find({ _id: { $in: skillIds } });
    if (skills.length !== skillIds.length) {
      return res.status(400).json({ error: 'One or more skills not found' });
    }

    const job = new Job({
      title,
      department,
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

exports.getAllJobs = async (req, res) => {
  try {
    const { department, isActive } = req.query;
    const filter = {};
    
    if (department) filter.department = department;
    if (isActive !== undefined) filter.isActive = isActive;

    const jobs = await Job.find(filter)
      .populate('requiredSkills.skill')
      .populate('postedBy', 'email profile.firstName profile.lastName');

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('requiredSkills.skill')
      .populate('postedBy', 'email profile.firstName profile.lastName');

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
    .populate('requiredSkills.skill');

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