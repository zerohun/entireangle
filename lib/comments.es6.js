Comment = new Mongo.Collection('comments');

Meteor.methods({
  addComment: (commentObj)=>{
      if (!Meteor.userId()) {
          throw new Meteor.Error("not-authorized");
      }
      return Comment.insert({
        commentText: commentObj.commentText,
        postId: commentObj.postId,
        user: commentObj.user,
        createdAt: new Date()
      });
  },
  updateComment: (commentObj)=>{
    console.log(commentObj);
      if (!Meteor.userId() || Meteor.userId() !==  Comment.findOne({_id:commentObj._id}).user._id) {
          throw new Meteor.Error("not-authorized");
      }
    Comment.update(commentObj._id,{
        $set:{
          commentText: commentObj.commentText
        }
    });
  },
  removeComment: (commentId)=>{
    Comment.remove({_id: commentId});
  }
});


if (Meteor.isServer) {
    Meteor.publish("comments", function(query) {
        var validQuery = Object.filterParams(query, [
            "postId"
        ]);
        
        return Comment.find(validQuery, {
            sort:{
              createdAt: -1
            }
        });
    });
}