const User = require('../models/user');
const Skill = require('../models/skill');
const bcrypt = require("bcrypt");

exports.getAllUsersPaginated = async (req, res) => {    
  try {
    const { role, departement, page = 1, limit = 10 } = req.query;
    let filter = {};
    if (role) {
      if (role ==='manager') {
        filter.role = 'manager' 
      };
      if (role ==='employee') {
        filter.role = 'employee' 
      };
      if (role ==='hr') {
        filter.role = 'hr' 
      };
    }
    if (departement) filter['profile.departement'] = departement;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await User.countDocuments();
    
    const users = await User.find(filter)
      .select('-password')
      .populate('profile.skills.skill')
      .populate('manager')
      .skip(skip)
      .limit(limitNumber);

    res.json({
      data: users,
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
exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = {};
    if(role) {
      filter.role = role;
    }
    const users = await User.find(filter)
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('profile.skills.skill')
      .populate('manager');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addUser = async (req, res) => {
  try {
    
    const data = req.body;

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }
    const newUser = new User(data);
    await newUser.save();
    res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const {password,...updates} = req.body;
    if (password) {
      updates.password = await bcrypt.hash(password, 10)
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true }).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addUserSkill = async (req, res) => {
  try {
    const { skillId, level } = req.body;
    
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingSkillIndex = user.profile.skills.findIndex(s => 
      s.skill.toString() === skillId
    );

    if (existingSkillIndex >= 0) {
      user.profile.skills[existingSkillIndex].level = level;
    } else {
      user.profile.skills.push({ skill: skillId, level });
    }

    await user.save();
    const updatedUser = await User.findById(user._id)
      .select('-password')
      .populate('profile.skills.skill');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeUserSkill = async (req, res) => {
  try {
    const { skillId } = req.params;

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.profile.skills = user.profile.skills.filter(
      s => s.skill.toString() !== skillId
    );

    await user.save();
    const updatedUser = await User.findById(user._id)
      .select('-password')
      .populate('profile.skills');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
    try {
      const user = await User.findById(req.userId)
        .select('-password')
        .populate('profile.skills')
        .populate('manager')

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };