const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
router.get('/paginated', 
  [authMiddleware.verifyToken,
  roleMiddleware.checkRole(['hr', 'manager']) ],
  userController.getAllUsersPaginated
);

router.get('/', 
  authMiddleware.verifyToken,
  userController.getAllUsers
);

router.get('/collaborators/:role', 
  authMiddleware.verifyToken,
  userController.getColaborators
);
router.get('/me',
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr', 'manager', 'employee']),
  userController.getCurrentUser
);

router.get('/:id', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr', 'manager', 'employee']),
  userController.getUserById
);


router.put('/:id', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr', 'manager', 'employee']),
  userController.updateUser
);

router.delete('/:id', 
  authMiddleware.verifyToken,
  roleMiddleware.checkRole(['hr', 'manager']),
  userController.deleteUser
);

router.post('/', 
  authMiddleware.verifyToken,   
  roleMiddleware.checkRole(['hr', 'manager']),
  userController.addUser
);

router.post('/:id/skills', 
  authMiddleware.verifyToken,
  roleMiddleware.checkRole(['hr', 'manager']),
  userController.addUserSkill
);

router.delete('/:userId/skills/:skillId', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr', 'manager']),
  userController.removeUserSkill
);

module.exports = router;