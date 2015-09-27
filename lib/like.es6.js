
Like = new Mongo.Collection("likes");

Meteor.methods({
  like: function(postId){
    if(!Meteor.userId()){
      throw new Meteor.Error("not-authorized");
    }
    console.log('like method');
    const likeObj = {
      userId: Meteor.userId(),
      postId: postId,
      createdAt: new Date()
    }
    
    const actioner = Meteor.user();
    if(Meteor.isServer){
      Meteor.setTimeout(function(){
        Notification.createForLike(likeObj, actioner);
      }, 1000);
    }

    return Like.insert(likeObj);
  },
  unlike: function(postId){
    if(!Meteor.userId()){
      throw new Meteor.Error("not-authorized");
    }

    const userId = Meteor.userId();
    if(Meteor.isServer){
      Meteor.setTimeout(function(){
        Notification.remove({
          notiType: "like",
          "targetData.postId": postId,
          "targetData.userId": userId 
        });
      });
    }

    return Like.remove({
      userId: Meteor.userId(),
      postId: postId
    });
  }
});

if(Meteor.isServer){
  Meteor.publish("likes", function(postId){
    return Like.find({
      userId: this.userId,
      postId: postId
    });
  });
}
