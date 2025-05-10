const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
router.get('/', 
  [authMiddleware.verifyToken,
  roleMiddleware.checkRole(['hr', 'manager']) ],
  userController.getAllUsers
);

router.get('/:id', 
  authMiddleware.verifyToken, 
  userController.getUserById
);

router.put('/:id', 
  authMiddleware.verifyToken, 
  userController.updateUser
);

router.delete('/:id', 
  authMiddleware.verifyToken,
  roleMiddleware.checkRole(['hr', 'manager']),
  userController.deactivateUser
);

router.post('/', 
  authMiddleware.verifyToken, 
  userController.addUser
);

router.post('/:id/skills', 
  authMiddleware.verifyToken, 
  userController.addUserSkill
);

router.delete('/:userId/skills/:skillId', 
  authMiddleware.verifyToken, 
  userController.removeUserSkill
);

module.exports = router;