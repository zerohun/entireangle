if (Meteor.isServer) {
    Meteor.publish("users", function(){
      return Meteor.users.find({}, {
        fields:{
          username: 1,
          snsImageUrl: 1,
          imageId: 1,
          desc: 1
        }
      });
    });
    Meteor.publish("user", function(_id){
      return Meteor.users.find({_id: _id},
        {
          fields:{
            username: 1,
            snsImageUrl: 1,
            imageId: 1,
            desc: 1
          }
        }
      );
    });
    Meteor.publish("currentUser", function(){
      return Meteor.users.find({_id: this.userId},
                      {
                        fields: {
                          username: 1,
                          'services.facebook.id': 1,
                          'services.facebook.email': 1,
                          isActivated: 1,
                          snsImageUrl: 1,
                          imageId: 1,
                          desc: 1
                        }
                      }
             );
    });
    
  Meteor.methods({
      updateUserWithActivation: function(userObj){
        if(Meteor.users.find({username: userObj.username}).count() == 0){
          console.log("no same user name");
          userObj.isActivated = true;
          Meteor.users.update(Meteor.userId(), {$set: userObj});
        }
        else
          throw new Meteor.Error("username " + userObj.username + " is already exist");
          
      },
      updateUser: function(userObj){
        console.log(userObj);
          var validQuery = Object.filterParams(userObj, [
              "username", 
              "desc", 
              "imageId"
          ]);
          console.log('validQuery:');
          console.log(validQuery);
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
          Comment.update({
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
}
