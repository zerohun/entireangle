
Like = new Mongo.Collection("likes");

Meteor.methods({
  like: (postId)=>{
    if(!Meteor.userId()){
      throw new Meteor.Error("not-authorized");
    }
    console.log('like method');

    return Like.insert({
      userId: Meteor.userId(),
      postId: postId,
      createdAt: new Date()
    });
  },
  unlike: (postId)=>{
    if(!Meteor.userId()){
      throw new Meteor.Error("not-authorized");
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
