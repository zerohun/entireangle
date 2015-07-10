Post = new Meteor.Collection('posts');

Meteor.methods({
  addPost: function(postObj, isVideo){
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    return Post.insert({
      title: postObj.title,
      desc: postObj.desc,
      imageId: postObj.imageId,
	  isVideo: isVideo,
      user: Meteor.user(),
      createdAt: new Date()
    });
  },
  updatePost: function(post){
    if(post.user._id != Meteor.userId())
      throw new Meteor.Error("not-authorized");

    Post.update(post._id, {$set: {
      title: post.title,
      desc: post.desc
    }});
  },
  updatePostViewPosition: function(post, position){
    if(post.user._id != Meteor.userId())
      throw new Meteor.Error("not-authorized");

    Post.update(post._id, {$set: {
        viewPosition: {
            x: position.x,
            y: position.y,
            z: position.z
        }
    }});

  },
  removePost: function(postId){
    var post = Post.findOne({_id: postId});
    if(post == null)
      throw new Meteor.Error("not-found");

    if(Meteor.userId() != post.user._id) 
      throw new Meteor.Error("not-authorized");

    if(post.isVideo){
        Video.remove({_id: post.imageId});
    }
    else{
        Image.remove({_id: post.imageId});
    }

    Post.remove({_id: post._id});
  }
})

if (Meteor.isServer) {
  Meteor.publish("posts", function (postsLimit, isVideo) {
    var isVideoVal;
    if(isVideo){
        isVideoVal = true;
    }
    else{
        isVideoVal = {
            $ne: true
        }
    }
    return Post.find({
            isVideo: isVideoVal
        }, 
        {
            limit: postsLimit,
            sort: {
                createdAt: -1
            }
        });
  });
  Meteor.publish("onePost", function (id) {
    return Post.find({_id:id});
  });
}
