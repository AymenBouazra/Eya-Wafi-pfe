const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.post('/', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr','manager']), 
  jobController.createJob
);

router.get('/', 
  authMiddleware.verifyToken, 
  jobController.getAllJobs
);
router.get('/paginated', 
  authMiddleware.verifyToken, 
  jobController.getAllJobsPaginated
);

router.get('/:id', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr','manager']), 
  jobController.getJobById
);

router.put('/:id', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr','manager']), 
  jobController.updateJob
);

router.patch('/:id/toggle-status', 
  authMiddleware.verifyToken, 
  roleMiddleware.checkRole(['hr']), 
  jobController.toggleJobStatus
);

module.exports = router;