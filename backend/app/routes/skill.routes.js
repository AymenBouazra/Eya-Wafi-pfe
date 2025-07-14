const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skill.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.post('/', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr','manager']), 
  skillController.createSkill
);

router.get('/', 
  authMiddleware.verifyToken, 
  skillController.getAllSkills
);
router.get('/paginated', 
  authMiddleware.verifyToken, 
  skillController.getAllSkillsPaginated
);

router.get('/:id', 
  authMiddleware.verifyToken, 
  skillController.getSkillById
);

router.put('/:id', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr','manager']), 
  skillController.updateSkill
);

router.delete('/:id', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr','manager']), 
  skillController.deleteSkill
);

module.exports = router;