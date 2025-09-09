// HR: Get all mobility requests (paginated)
const express = require('express');
const router = express.Router();
const mobilityController = require('../controllers/mobility.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.post('/', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['employee','manager']), 
  mobilityController.createRequest
);
router.get('/all', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr']), 
  mobilityController.getAllMobilityRequestsPaginated
);

router.get('/employee/:employeeId', 
  authMiddleware.verifyToken, 
  mobilityController.getEmployeeRequests
);

router.get('/manager-approval', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['manager']), 
  mobilityController.getManagerApprovalRequests
);

// For current manager approval
router.put('/:id/current-manager-approval', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['manager']), 
  mobilityController.currentManagerApproval
);

// For job manager approval
router.put('/:id/manager-approval', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['manager']), 
  mobilityController.managerApproval
);

// For HR approval
router.put('/:id/hr-approval', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr']), 
  mobilityController.hrApproval
);

router.get('/history', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr', 'manager']), 
  mobilityController.getMobilityHistory
);


router.get('/manager', authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr', 'manager']), 
  mobilityController.getRequestsByManagerPaginated
);

router.put('/:id', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr', 'manager', 'employee']), 
  mobilityController.updateRequest
);

router.delete('/:id', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr', 'manager', 'employee']), 
  mobilityController.deleteRequest
);

module.exports = router;