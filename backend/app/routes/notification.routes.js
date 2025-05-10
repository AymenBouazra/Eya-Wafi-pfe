const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', 
  authMiddleware.verifyToken, 
  notificationController.getUserNotifications
);

router.patch('/:id/read', 
  authMiddleware.verifyToken, 
  notificationController.markAsRead
);

router.patch('/read-all', 
  authMiddleware.verifyToken, 
  notificationController.markAllAsRead
);

router.delete('/:id', 
  authMiddleware.verifyToken, 
  notificationController.deleteNotification
);

module.exports = router;