Notification = new Mongo.Collection('notifications');

if(Meteor.isServer){
  Meteor.publish("notifications", function(limit){
    const validQuery = {
      receiver_user_ids: {
        $elemMatch : { 
          $or:[
            {$eq: "all" },
            {$eq: this.userId}
          ]
        } 
      }
    };
    return Notification.find({
      validQuery,
      limit: limit,
      sort: {
        createdAt: -1
      }
    });
  });
}
