const User = require('../models/user');
const MobilityRequest = require('../models/mobilityRequest');
const Notification = require('../models/notification');

class NotificationService {
  async notifyManager(employeeId, requestId) {
    const employee = await User.findById(employeeId);
    if (!employee || !employee.manager) return;

    const manager = await User.findById(employee.manager);
    if (!manager) return;

    const notification = new Notification({
      recipient: manager._id,
      type: 'mobility_request',
      message: `${employee.profile.firstName} ${employee.profile.lastName} has submitted a mobility request`,
      relatedEntity: requestId,
      relatedEntityType: 'MobilityRequest'
    });

    await notification.save();
    // In a real app, you would also send an email or push notification
  }

  async notifyMobilityStatus(request) {
    // Notify employee
    const employeeNotification = new Notification({
      recipient: request.employee._id,
      type: 'mobility_status',
      message: `Your mobility request status has been updated to ${request.status}`,
      relatedEntity: request._id,
      relatedEntityType: 'MobilityRequest'
    });

    await employeeNotification.save();

    // Notify HR if manager approved
    if (request.status === 'hr_review') {
      const hrUsers = await User.find({ role: 'hr', isActive: true });
      
      await Promise.all(hrUsers.map(hr => {
        const notification = new Notification({
          recipient: hr._id,
          type: 'mobility_approval',
          message: `A mobility request requires HR approval`,
          relatedEntity: request._id,
          relatedEntityType: 'MobilityRequest'
        });
        return notification.save();
      }));
    }

    // Notify manager if HR made a decision
    if (request.status === 'completed' || request.status === 'rejected') {
      const managerNotification = new Notification({
        recipient: request.employee.manager,
        type: 'mobility_final_status',
        message: `The mobility request for ${request.employee.profile.firstName} has been ${request.status}`,
        relatedEntity: request._id,
        relatedEntityType: 'MobilityRequest'
      });

      await managerNotification.save();
    }
  }

  async getNotificationsForUser(userId) {
    return Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(50);
  }

  async markAsRead(notificationId) {
    return Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
  }
  async createNotification(recipientId, type, message, relatedEntity = null, relatedEntityType = null) {
    const notification = new Notification({
      recipient: recipientId,
      type,
      message,
      relatedEntity,
      relatedEntityType
    });

    await notification.save();
    return notification;
  }

  async getUnreadCount(userId) {
    return Notification.countDocuments({ 
      recipient: userId, 
      isRead: false 
    });
  }
}

module.exports = new NotificationService();