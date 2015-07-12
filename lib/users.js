if (Meteor.isServer) {
    Meteor.publish("user", function(_id){
        return Meteor.users.find({_id: _id});
    });
}
