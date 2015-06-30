Template.Posts.helpers({
  posts: function(){ 
     return Router.current().data().posts;
  }
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
  $(window).scroll(function(){
    if(Post.find().count() == Router.current().data().limit &&
          $(document).innerHeight()  - $(window).scrollTop() < 1000){
        Router.go("Posts", {}, {query: "postsLimit=" + (Router.current().data().limit + 10)});
    }
  });
}
