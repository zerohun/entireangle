Notification = new Mongo.Collection('notifications');

if(Meteor.isServer){
  Meteor.publish("notifications", function(limit){
    const validQuery = {
      $or:[
        {
          receiverUserIds:{
            $elemMatch:{$eq: this.userId}
          }
        },
        {
          receiverUserIds:{
            $elemMatch:{$eq: "all"}
          }
        }
      ]
    }; 
    return Notification.find(
      validQuery,
      {
        limit: limit,
        sort: {
          createdAt: -1
        }
      }
    );
  });
}
