Template.Posts.helpers({
  posts: Post.find({}, {sort: {'createdAt': -1}})
});

Template.post.helpers({
  thumbUrl: function(imageId){
    return Image.findOne({_id: imageId}).url({store:'thumbs'});
  }
});
