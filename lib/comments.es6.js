Comment = new Mongo.Collection('comments');

Meteor.methods({
  addComment: (commentObj)=>{
      if (!Meteor.userId()) {
          throw new Meteor.Error("not-authorized");
      }

      //Notification generation which should be moved to background job
      //
      const post = Post.findOne({_id: commentObj.postId});
      const receiverUserIdsArr = Comment.find({postId: post._id}).fetch().
                              map(c => c.user._id).
                              concat(post.user._id);

      console.log('reciver arr');
      console.log(receiverUserIdsArr);
      const receiverUserIds = new Set(receiverUserIdsArr);
      console.log(receiverUserIds);
      receiverUserIds.delete(commentObj.user._id);
      console.log(receiverUserIds);
      
      if(receiverUserIds.size){
        Notification.insert({
          actioner: Meteor.user(),
          post: Post.findOne({_id: commentObj.postId}),
          notiType: "comment",
          receiverUserIds: Array.from(receiverUserIds) 
        });
      }

      ////////////// Notification ///////////////////////////////////////////

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
