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

  if(Post.find().count() == Router.current().data().limit){ 
      var scrollEventSrc = Rx.Observable.fromEvent($(window), "scroll").
                        filter(function(){
                            return ($(window).scrollTop() >= $(document).height() - $(window).height() - 10)
                        })

      var scrollEventSub = scrollEventSrc.subscribe(function(e){
          scrollEventSub.dispose();
          Router.go("Posts", {}, {query: "postsLimit=" + (Router.current().data().limit + 10)});
      });
  }
                        

}
