const express = require('express');
const router = express.Router();
const mobilityController = require('../controllers/mobility.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.post('/requests', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['employee']), 
  mobilityController.createRequest
);

router.get('/requests/employee/:employeeId', 
  authMiddleware.verifyToken, 
  mobilityController.getEmployeeRequests
);

router.get('/requests/manager-approval', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['manager']), 
  mobilityController.getManagerApprovalRequests
);

router.put('/requests/:requestId/manager-approval', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['manager']), 
  mobilityController.managerApproval
);

router.get('/requests/hr-approval', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr']), 
  mobilityController.getHRApprovalRequests
);

router.put('/requests/:requestId/hr-approval', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr']), 
  mobilityController.hrApproval
);

router.get('/history', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr', 'manager']), 
  mobilityController.getMobilityHistory
);

module.exports = router;