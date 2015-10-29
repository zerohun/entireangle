const postsCountByTagsReact = new ReactiveVar([]);
const postsCountByLocationsReact = new ReactiveVar([]);

const SYM_ALL = Symbol("ALL");
const SYM_TAGS = Symbol("TAGS");
const SYM_LOCATIONS = Symbol("LOCATIONS");
const SYM_FAVORITES = Symbol("FAVORITES");

const currentTabReact = new ReactiveVar(SYM_ALL);

const TemplateUsersShowHelpers = {
  SYM_ALL: SYM_ALL,
  SYM_TAGS: SYM_TAGS,
  SYM_LOCATIONS: SYM_LOCATIONS,
  SYM_FAVORITES: SYM_FAVORITES,
  isTabVisible: function(symbol){
    return symbol === currentTabReact.get();
  },
  user: function(){
      return Router.current().data();
  },
  username: function(){
      return Router.current().data().username;
  },
  posts: function(){
      return Post.find({
        'user._id': Router.current().data()._id
      }, {
        $sort:{
          createdAt: -1
        }
      });
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
  places: function(){
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
  },
  favoritePosts: function(){
    const postIds = Like.find({
      userId: Router.current().data()._id
    }).fetch().map((l) => l.postId);
    return Post.find({
      _id:{
            $in: postIds 
          }
      }, {sort:{createdAt: -1}});
  }
};

const TemplateUsersShowEvents = {
  'click a.all': function(t){
    Meteor.subscribe("posts", Session.get('UserPostsLimit'), {"user._id": Router.current().data()._id});
    currentTabReact.set(SYM_ALL);
  },
  'click a.tags': function(t){
    currentTabReact.set(SYM_TAGS);
  },
  'click a.places': function(t){
    currentTabReact.set(SYM_LOCATIONS);
  },
  'click a.favorites': function(t){
    currentTabReact.set(SYM_FAVORITES);
  }
};

const TemplateUsersShowRendered = function(){
    //currentTabReact.set(SYM_ALL);
    enableEndlessScroll("UserPostsLimit", Post);
    FView.byId("loading-box").node.hide();

    Meteor.call("getPostsCountByTags", {'user._id': Meteor.userId()}, function(err, result){
      if(!err)
        postsCountByTagsReact.set(result);
    });
    Meteor.call("getPostsCountByLocations", {'user._id': Router.current().data()._id}, 
        function(err, result){
          if(!err)
            postsCountByLocationsReact.set(result);
        }
    );

};

Template.UsersShow.helpers(TemplateUsersShowHelpers);
Template.UsersShow.rendered = TemplateUsersShowRendered;

Template.UsersShowMobile.helpers(TemplateUsersShowHelpers);
Template.UsersShowMobile.rendered = TemplateUsersShowRendered;
Template.UsersShowMobile.events(TemplateUsersShowEvents);
