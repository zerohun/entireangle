const SYM_PICTURES = Symbol("PICTURES");
const SYM_TAGS = Symbol("TAGS");
const SYM_LOCATIONS = Symbol("LOCATIONS");
const currentTabReact = new ReactiveVar(SYM_PICTURES);
const postsCountByTagsReact = new ReactiveVar([]);
const postsCountByLocationsReact = new ReactiveVar([]);

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
    if(this.posts) return this.posts;
    return Post.find({}, {
      sort:{
        createdAt: -1
      }
    });
  }
};

var templatePostsEvents = {
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


templatePostsRendered = function() {
    enableEndlessScroll("PostsLimit", Post);
};


templatePostListRendered = function() {
    enableEndlessScroll("PostsLimit", Post);
    FView.byId("loading-box").node.hide();
    Meteor.call("getPostsCountByTags", function(err, result){
      window.r = result;
      postsCountByTagsReact.set(result);
    });
    Meteor.call("getPostsCountByLocations", 
        function(err, result){
          postsCountByLocationsReact.set(result);
        }
    );
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
