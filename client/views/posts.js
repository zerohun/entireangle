Template.Posts.helpers({
  posts: Post.find({})
});

Template.post.helpers({
  thumbUrl: function(imageId){
    console.log(imageId);
    return Image.findOne({_id: imageId}).url({store:'thumbs'});
  }
});
