Template.Posts.helpers({
  posts: Post.find({}, {sort: {'createdAt': -1}})
});

Template.post.helpers({
  thumbUrl: function(imageId, isVideo){
    if(isVideo){
        return Video.findOne({_id: imageId}).url({store:'video_thumbs'});
    }
    else{
        return Image.findOne({_id: imageId}).url({store:'thumbs'});
    }
  }
});


Template.Posts.rendered = function() {
  $("body").css("overflow", "scroll");
}
