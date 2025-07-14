const Skill = require('../models/skill');

exports.createSkill = async (req, res) => {
  try {
    const { title, description } = req.body;
    const existingSkill = await Skill.findOne({ title });
    if (existingSkill) {
      return res.status(400).json({ error: 'Compétence déjà existante' });
    }

    const skill = new Skill({
      title,
      description
    });

    await skill.save();
    res.status(201).json({ message: 'Compétence créée avec succés' });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message || 'Erreur lors de la création de la compétence' });
  }
};

exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ title: 1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllSkillsPaginated = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;


    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Skill.countDocuments();

    const skills = await Skill.find()
      .sort({ title: 1 })
      .skip(skip)
      .limit(limitNumber);

    res.json({
      data: skills,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
        hasNextPage: pageNumber * limitNumber < total,
        hasPreviousPage: pageNumber > 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: 'Compétence non trouvée' });
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
      return res.status(404).json({ error: 'Compétence non trouvée' });
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
      return res.status(404).json({ error: 'Compétence non trouvée' });
    }
    res.json({ message: 'Compétence supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};