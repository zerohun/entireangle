Notification = new Mongo.Collection('notifications');

function getReceiverIds(postId, actionerId){
  const post = Post.findOne({_id: postId});
  const receiverUserIdsArr = Comment.find({postId: post._id}).fetch().
                          map(c => c.user._id).
                          concat(post.user._id);

  console.log('reciver arr');
  console.log(receiverUserIdsArr);
  const receiverUserIds = new Set(receiverUserIdsArr);
  console.log(receiverUserIds);
  receiverUserIds.delete(commentObj.user._id);
  console.log(receiverUserIds);
  return Array.from(receiverUserIds); 
}

if(Meteor.isClient){
  Notification.createForComment = (commentObj)=>{
    const receiverUserIds = getReceiverIds(commentObj.postId, Meteor.userId());
    if(receiverIds.length){
      Notification.insert({
        actioner: Meteor.user(),
        post: Post.findOne({_id: commentObj.postId}),
        notiType: "comment",
        targetData: commentObj,
        receiverUserIds: Array.from(receiverUserIds),
        createdAt: new Date() 
      });
    }
  };

  Notification.createForLike = (likeObj)=>{
    const receiverUserIds = getReceiverIds(commentObj.postId, Meteor.userId());
    if(receiverIds.length){
      Notification.insert({
        actioner: Meteor.user(),
        post: Post.findOne({_id: likeObj.postId}),
        notiType: "like",
        targetData: likeObj,
        receiverUserIds: Array.from(receiverUserIds),
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
