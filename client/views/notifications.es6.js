Template.notifications.helpers({
  notifications: () => Notification.find({}, {sort: {createdAt: -1}})
});
