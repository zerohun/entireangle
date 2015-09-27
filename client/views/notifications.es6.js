function getReceiverName(user){
  if(user._id === Meteor.userId())
    return "your"
  else
    return user.username + "\'s";
}

Template.notifications.helpers({
  notifications: () => Notification.find({}, {sort: {createdAt: -1}})
});

Template.commentNotification.helpers({
  receiverName: getReceiverName 
});

Template.likeNotification.helpers({
  receiverName: getReceiverName 
});

