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
  var scrollEventSrc = Rx.Observable.fromEvent(window, "scroll").
                    filter(function(){
                        return ($(window).scrollTop() >= $(document).height() - $(window).height() - 10)
                    }).
                    takeUntil(Rx.Observable.fromEvent(window, 'popstate'));

  var scrollEventSub = scrollEventSrc.subscribe(function(e){
      var limit = Router.current().data().limit;
      if(Post.find().count() >= limit){ 
          $("#list-fetching-bar").fadeIn("slow");;
          Session.set("PostsLimit", limit + 10);
      }
  });
}
