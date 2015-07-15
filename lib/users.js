if (Meteor.isServer) {
    Meteor.publish("user", function(_id){
        return Meteor.users.find({_id: _id});
    });
}

Meteor.methods({
    updateUser: function(userObj){
        var validQuery = Object.filterParams(userObj, ["username"]);
        Meteor.users.update(Meteor.userId(), {$set: validQuery});
        Post.update({
            "user._id": Meteor.userId()
            },
            {
                $set:{
                    user: Meteor.user()
                }
            },
            {multi: true}
        );
    }
});
