const Skill = require('../models/skill');

exports.createSkill = async (req, res) => {
  try {
    const { name, category, description, isCore } = req.body;
    
    const existingSkill = await Skill.findOne({ name });
    if (existingSkill) {
      return res.status(400).json({ error: 'Skill already exists' });
    }

    const skill = new Skill({
      name,
      category,
      description,
      isCore
    });

    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllSkills = async (req, res) => {
  try {
    const { category, isCore } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (isCore !== undefined) filter.isCore = isCore;

    const skills = await Skill.find(filter).sort({ name: 1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.json(skill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json(skill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};