if (Meteor.isServer) {
    Meteor.publish("user", function(_id){
      return Meteor.users.find({_id: _id});
    });
    Meteor.publish("currentUser", function(){
      return Meteor.users.find({_id: this.userId},
                      {fields: {
                        username: 1,
                        'services.facebook.id': 1,
                        'services.facebook.email': 1,
                        isActivated: 1,
                        snsImageUrl: 1
                      }
                    });
    });
}

Meteor.methods({
    updateUserWithActivation: function(userObj){
      userObj.isActivated = true;
      Meteor.users.update(Meteor.userId(), {$set: userObj});
    },
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
