Notification = new Mongo.Collection('notifications');

if(Meteor.isServer){
  function getReceiverIds(postId, actionerId){
    const post = Post.findOne({_id: postId});
    let receiverUserIdsArr = Comment.find({postId: post._id}).fetch().
                            map(c => c.user._id).
                            concat(post.user._id);

    receiverUserIdsArr = receiverUserIdsArr.
                            filter((elem, index) => receiverUserIdsArr.indexOf(elem) === index);

    receiverUserIdsArr.splice(receiverUserIdsArr.indexOf(actionerId), 1);

    console.log(receiverUserIdsArr);
    return receiverUserIdsArr;
  }

  Notification.createForComment = (commentId, commentObj, actioner)=>{
    const receiverUserIds = getReceiverIds(commentObj.postId, actioner._id);
    if(receiverUserIds.length){
      Notification.insert({
        actioner: actioner,
        post: Post.findOne({_id: commentObj.postId}),
        notiType: "comment",
        targetData: commentObj,
        targetId: commentId,
        receiverUserIds: receiverUserIds,
        createdAt: new Date() 
      });
    }
  };

  Notification.createForLike = (likeObj, actioner)=>{
    const receiverUserIds = getReceiverIds(likeObj.postId, actioner._id);
    if(receiverUserIds.length){
      Notification.insert({
        actioner: actioner,
        post: Post.findOne({_id: likeObj.postId}),
        notiType: "like",
        targetData: likeObj,
        receiverUserIds: receiverUserIds,
        createdAt: new Date() 
      });
    }
  };
}

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
