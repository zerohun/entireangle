Post = new Meteor.Collection('posts');

Meteor.methods({
  addPost: function(postObj){
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Post.insert({
      title: postObj.title,
      desc: postObj.desc,
      imageId: postObj.imageId,
      user: Meteor.user()
    });
  },

  removePost: function(postId){
    var post = Post.findOne({_id: postId});
    if(post == null)
      throw new Meteor.Error("not-found");

    if(Meteor.userId() != post.user._id) 
      throw new Meteor.Error("not-authorized");

    Image.remove({_id: post.imageId});
    Post.remove({_id: post._id});
  }
})

if (Meteor.isServer) {
  Meteor.publish("posts", function () {
    return Post.find({});
  });
}

if (Meteor.isClient) {
  Meteor.subscribe("posts");
}
