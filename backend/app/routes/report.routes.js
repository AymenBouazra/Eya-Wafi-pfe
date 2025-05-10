const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.post('/skills-gap', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr']), 
  reportController.generateSkillsGapReport
);

router.post('/mobility-trends', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr']), 
  reportController.generateMobilityTrendsReport
);

router.get('/', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr', 'manager']), 
  reportController.getAllReports
);

router.get('/:id', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr', 'manager']), 
  reportController.getReportById
);

module.exports = router;