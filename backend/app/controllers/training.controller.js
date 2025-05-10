const Training = require('../models/training');
const Skill = require('../models/skill');
const Job = require('../models/job');

exports.createTraining = async (req, res) => {
  try {
    const { title, description, category, duration, provider, targetSkills, recommendedFor } = req.body;
    
    // Verify all target skills exist
    if (targetSkills && targetSkills.length > 0) {
      const skills = await Skill.find({ _id: { $in: targetSkills } });
      if (skills.length !== targetSkills.length) {
        return res.status(400).json({ error: 'One or more target skills not found' });
      }
    }

    // Verify recommended jobs exist
    if (recommendedFor && recommendedFor.length > 0) {
      const jobIds = recommendedFor.map(r => r.job);
      const jobs = await Job.find({ _id: { $in: jobIds } });
      if (jobs.length !== jobIds.length) {
        return res.status(400).json({ error: 'One or more recommended jobs not found' });
      }
    }

    const training = new Training({
      title,
      description,
      category,
      duration,
      provider,
      targetSkills,
      recommendedFor,
      createdBy: req.userId
    });

    await training.save();
    res.status(201).json(training);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllTrainings = async (req, res) => {
  try {
    const { category, skillId } = req.query;
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (skillId) filter.targetSkills = skillId;

    const trainings = await Training.find(filter)
      .populate('targetSkills')
      .populate('recommendedFor.job', 'title department');

    res.json(trainings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTrainingById = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id)
      .populate('targetSkills')
      .populate('recommendedFor.job', 'title department');

    if (!training) {
      return res.status(404).json({ error: 'Training not found' });
    }
    res.json(training);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTraining = async (req, res) => {
  try {
    const training = await Training.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    )
    .populate('targetSkills')
    .populate('recommendedFor.job', 'title department');

    if (!training) {
      return res.status(404).json({ error: 'Training not found' });
    }

    res.json(training);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleTrainingStatus = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({ error: 'Training not found' });
    }

    training.isActive = !training.isActive;
    await training.save();
    res.json(training);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecommendedTrainings = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user's skills and current job
    const user = await User.findById(userId)
      .populate('profile.skills.skill')
      .populate('manager');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find trainings that match user's skill gaps or job requirements
    const trainings = await Training.find({ isActive: true })
      .populate('targetSkills')
      .populate('recommendedFor.job', 'title department');

    // Filter trainings based on relevance
    const recommendedTrainings = trainings.filter(training => {
      // Check if training targets any of the user's skills below level 3
      const hasLowSkill = user.profile.skills.some(userSkill => 
        training.targetSkills.some(tSkill => 
          tSkill._id.equals(userSkill.skill._id) && userSkill.level < 3
      )
     );
      
      // Check if training is recommended for user's current position
      const isForCurrentJob = training.recommendedFor.some(rec => 
        rec.job && user.profile.position === rec.job.title
      );

      return hasLowSkill || isForCurrentJob;
    });

    res.json(recommendedTrainings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};