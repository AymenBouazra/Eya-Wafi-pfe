const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/training.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.post('/', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr']), 
  trainingController.createTraining
);

router.get('/', 
  authMiddleware.verifyToken, 
  trainingController.getAllTrainings
);

router.get('/:id', 
  authMiddleware.verifyToken, 
  trainingController.getTrainingById
);

router.put('/:id', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr']), 
  trainingController.updateTraining
);

router.patch('/:id/toggle-status', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr']), 
  trainingController.toggleTrainingStatus
);

router.get('/recommended/:userId', 
  authMiddleware.verifyToken, 
  trainingController.getRecommendedTrainings
);

module.exports = router;