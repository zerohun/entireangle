Template.Posts.helpers({
  posts: function(){ 
     return Router.current().data().posts;
  }
});

Template.Posts.events({
    "click #image-list": function(){
        Session.set('isVideo', false);
        Session.set('limit', 10);
        $("#loading-box").show();
    },
    "click #video-list": function(){
        Session.set('isVideo', true);
        Session.set('limit', 10);
        $("#loading-box").show();
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
  $("#loading-box").hide();

  Tracker.autorun(function(computation){
      var limit = Router.current().data().limit; 
      if(Post.find().count() < limit) 
          $("#list-fetching-bar").fadeOut(2000);
      else
          $("#list-fetching-bar").show();

      var popStateSub = Rx.Observable.fromEvent(window, "popstate").
                            subscribe(function(e){
                                computation.stop();
                                popStateSub.dispose();
                            });
  });

  var scrollEventSrc = Rx.Observable.fromEvent(window, "scroll").
                    filter(function(){
                        return ($(window).scrollTop() >= $(document).height() - $(window).height() - 10)
                    }).
                    takeUntil(Rx.Observable.fromEvent(window, 'popstate'));

  var scrollEventSub = scrollEventSrc.subscribe(function(e){
      var limit = Router.current().data().limit; 
      if(Post.find().count() >= limit) 
          Session.set("PostsLimit", limit + 10);
  });
}
