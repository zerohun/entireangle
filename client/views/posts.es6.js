const SYM_PICTURES = Symbol("PICTURES");
const SYM_TAGS = Symbol("TAGS");
const SYM_LOCATIONS = Symbol("LOCATIONS");
const currentTabReact = new ReactiveVar(SYM_PICTURES);
const postsCountByTagsReact = new ReactiveVar([]);
const postsCountByLocationsReact = new ReactiveVar([]);

function unveilOrHide(){
  const HEIGHT_LOADING_BUFFER_SIZE = 200;
  $(".post-image").toArray().forEach((e) => {
    const $e = $(e);
    const $w = $(window);
    if($e.offset().top > $w.scrollTop() - HEIGHT_LOADING_BUFFER_SIZE && 
        $e.offset().top + $e.height()  <  $w.scrollTop() + $w.height() + HEIGHT_LOADING_BUFFER_SIZE){
      $e.unveil();
    }
    else{
      //console.log("$e.top :" + $e.offset().top);
      //console.log("$w.top :" + $w.scrollTop() );
      //console.log("$e.bottom :" + $e.offset() + $e.height());
      //console.log("$w.bottom :" + $w.scrollTop() + $w.height());
      $e.attr("src", "/images/loadingimage.jpg");
      $e.data("src", $e.attr("image-src"));
    }
  });

}

const templatePostListHelpers = {
  SYM_PICTURES: SYM_PICTURES,
  SYM_TAGS: SYM_TAGS,
  SYM_LOCATIONS: SYM_LOCATIONS,
  isTabVisible: function(symbol){
    return symbol === currentTabReact.get();
  },
  "postsCountByTagId": function(tagId){
    return postsCountByTagsReact.get().
            filter((c)=> c._id.albumId === tagId)[0].
            count;
  },
  tags: function(){
    const tagCounts = postsCountByTagsReact.get();
    return Album.find({
      _id:{
        $in: tagCounts.map((t)=>t._id.albumId)
      }
    }).fetch().map((t, i) => {
      t.count = tagCounts.filter((tc) => tc._id.albumId === t._id)[0].count;
      return t;
    });
  },
  "locations": function(){
    return postsCountByLocationsReact.
      get().
      map((p)=>{
        return {
          country: p._id.country,
          state: p._id.state, 
          city: p._id.city,
          count: p.count
        };
      }).
      filter((p) => (p.country && p.country !== ""));
  }
};

const templatePostListEvents = {
  "click #pictures-tab-btn": function(){
    currentTabReact.set(SYM_PICTURES);
  },
  "click #tags-tab-btn": function(){
    currentTabReact.set(SYM_TAGS);
  },
  "click #locations-tab-btn": function(){
    currentTabReact.set(SYM_LOCATIONS);
  }
};


var templatePostsHelpers = {
  posts: function() {
    if(this.posts) {
      Session.set("postIds", this.posts.fetch().map((p) => p._id));
      return this.posts;
    }
    const posts = Post.find(Session.get("postsQuery"), {
      sort:{
        createdAt: -1
      }
    });

    Session.set("postIds", posts.fetch().map((p) => p._id));
    return posts;
  }
};

var templatePostsEvents = {
  "click a[target!='_blank']:not(.share-buttons a):not(.inpage-buttons)": function(){
      FView.byId("loading-box").node.show();
  },
  "click #image-list": function() {
      Session.set('isVideo', false);
      Session.set('PostsLimit', 10);
  },
  "click #video-list": function() {
      Session.set('isVideo', true);
      Session.set('PostsLimit', 10);
  },
  "click .user-link": function(){
      Session.set('UserPostsLimit', 10);
  }
};

var templatePostHelper = {
    thumbUrl: function(imageId, isVideo) {
      if (isVideo) {
          return Video.findOne({
              _id: imageId
          }).url({
              store: 'video_thumbs'
          });
      } else {
          var image = Models.Image.findOne({
              _id: imageId
          });
          return image.url({store: 'thumbs'}) + "&uploadAt=" + image._getInfo('thumbs').updatedAt.getTime();
      }
    }
};

let scrollSubs;
templatePostsRendered = function() {
  $("body").css("overflow", "scroll");
  Tracker.autorun(()=>{
    if(Router.current().ready()){
      FView.byId("loading-box").node.hide();
      setTimeout(unveilOrHide(),500);
    }
  });

  unveilOrHide();
  const scrollObs = Rx.Observable.
    fromEvent(window, "scroll").
    throttle(100);
  scrollSubs = scrollObs.subscribe(unveilOrHide);
};
templatePostsDestroyed = function(){
  scrollSubs.dispose();
}

templatePostListRendered = function() {
    FView.byId("loading-box").node.hide();
    Meteor.call("getPostsCountByTags", function(err, result){
      postsCountByTagsReact.set(result);
    });
    Meteor.call("getPostsCountByLocations", 
        function(err, result){
          postsCountByLocationsReact.set(result);
        }
    );
    enableEndlessScroll("PostsLimit", Post);
};



Template.Posts.helpers(templatePostsHelpers);
Template.Posts.events(templatePostsEvents);
Template.Posts.rendered = templatePostsRendered; 

Template.PostsMobile.helpers(templatePostsHelpers);
Template.PostsMobile.events(templatePostsEvents);
Template.PostsMobile.rendered = templatePostsRendered;

Template.post.helpers(templatePostHelper);
Template.postMobile.helpers(templatePostHelper);

Template.PostListMobile.events(templatePostListEvents);
Template.PostListMobile.helpers(templatePostListHelpers);
Template.PostListMobile.rendered = templatePostListRendered;

Template.PostList.events(templatePostListEvents);
Template.PostList.helpers(templatePostListHelpers);
Template.PostList.rendered = templatePostListRendered;

Template.Posts.onDestroyed(templatePostsDestroyed);
Template.PostsMobile.onDestroyed(templatePostsDestroyed);
