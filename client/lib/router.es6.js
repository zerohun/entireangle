var postsSubscription = null;
var storiesSubscription = null;
Meteor.subscribe("albums", 100, {});
Meteor.subscribe("notifications", 10);
Meteor.subscribe("users");

function hideSlideDownNode(fNode){
    fNode.hide();
    fNode.slideDown();
}

function getTemplate(templateName){
  return isMobile.phone? templateName + "Mobile": templateName;
}

function forceLogin(afterLoginCallback){

  if(!Meteor.user()){
    window.afterLoginCallback = afterLoginCallback;
    window.cancelLoginCallback = function(){
      window.history.go(-1);
    }
    try{
      Materialize.toast('You need to login to upload images', 1000);
      FView.byId("login-form").node.slideDown();
    }
    catch(e){
      setTimeout(function(){
        FView.byId("loading-box").node.hide();              
        FView.byId("login-form").node.slideDown();
        //Router.go("Posts");
      }, 1000);
    }
  }
  else{
    afterLoginCallback();
  }
}

Session.set("PostsLimit", 10);
Session.set("UserPostsLimit", 10);
Session.set("StoriesLimit", 10);
Session.set("isVideo", false);
Session.set('posts-show-url', "");
Session.set("myPagePostsQuery", {isPublished: false});
Session.set("postsQuery", {isPublished: true});

Router.configure({
    layoutTemplate: getTemplate("layout"), 
    trackPageView: true
});

Router.onBeforeAction(function() {

    if(window.passModalCheck){
      window.passModalCheck = false;
      this.next();
    }
    else if(window.cancelLoginCallback){
      window.cancelLoginCallback = null;
      if(window.afterLoginCallback)
        window.afterLoginCallback = null;
      closeAllWindowAndModal();
      this.next();
    }
    else if(closeAllWindowAndModal()){
      window.history.go(1);
    }
    else{
      var $ele = $("#orb-player");
      if ($ele.count > 0)
          $ele.remove();

      //$(".lean-overlay").remove();

      this.next();
    }
});
Router.route('/', {
    name: "home",
    template: getTemplate("home"),
    subscriptions: function() {
      Session.set("postsQuery", {
        isPublished: true, 
        isFeatured: true
      });
      return Meteor.subscribe("posts", 30, Session.get("postsQuery"));
    }
});
Router.route('/about', {
    name: "about"
});
Router.route('/posts', {
    name: "Posts",
    template: getTemplate("PostList"),
    subscriptions: function() {
      console.log('subs');
        $("#list-fetching-bar").fadeOut(1000);
        Session.set("postsQuery", {
          isPublished: true,
          isVideo: false
        });
        return Meteor.subscribe("posts", 
            Session.get("PostsLimit"), 
            Session.get("postsQuery"));
    }
});
Router.route('/upload', {
  name:"upload",
  template: getTemplate("upload"),
  action: function(){
    forceLogin(()=>{
      this.render(getTemplate('upload'));
    });
  }
});
Router.route('/posts/new', {
    name: "posts.new",
    action: function() {
      
        if (window.isLoggedIn()) {
            this.render("PostsNew");
        } else {
          if(!Meteor.user()){
            try{
              toastr.warning("You need to login to post a image");
              FView.byId("login-form").node.slideDown();
              Router.go("Posts");
            }
            catch(e){
              setTimeout(function(){
                FView.byId("loading-box").node.hide();              
                FView.byId("login-form").node.slideDown();
                Router.go("Posts");
              }, 1000);
            }
          }
        }
    }
});

Router.route('/posts/:_id', {
    name: "PostsShow",
    subscriptions: function() {
      // return one handle, a function, or an array
      const result =  [
        Meteor.subscribe('comments', {postId: this.params._id}),
        Meteor.subscribe("likes", this.params._id)
      ];
      if(this.params.query.isUploading === '1' && Session.get("uploadingPostIds") && Session.get("uploadingPostIds").indexOf(this.params._id) > -1){
        result.push(Meteor.subscribe("postIdList", Session.get("uploadingPostIds")));
      }
      else if(Session.get("postIds") && Session.get("postIds").indexOf(this.params._id) > -1){
        result.push(Meteor.subscribe("postIdList", Session.get("postIds")));
      }
      else{
        result.push(Meteor.subscribe("post", this.params._id));
      }
      return result;
    },
    data: function() {
        var post = Post.findOne({
            _id: this.params._id
        });
        if (post) {
            post.description = "EntireAngle - Pictures for virtual reality";
            post.summary = "EntireAngle - Pictures for virtual reality";
            post.url = Session.get("posts-show-url");
            var imageUrl;
            if (post.isVideo) {
                imageUrl = Video.findOne({
                    _id: post.imageId
                }).url({
                    store: 'video_thumbs'
                });
                post.summary += "(but this is video)";
            } else {
                imageUrl = Models.Image.findOne({
                    _id: post.imageId
                }).url({
                    store: 'snsThumbs'
                });
            }
            post.thumbnail = function() {
                const postUrl = Session.get("posts-show-url");
                if(postUrl.search('\\?') > -1){
                  const postUrlParams = postUrl.split('?')[1];
                  return imageUrl + '&' + postUrlParams;
                }
                else 
                  return imageUrl;
            };
        } else {
            console.log('post is null id:' + this.params._id);
            console.log(Post.findOne({
                _id: this.params._id
            }));
        }
        return post;
    },
    action: function(){
      if(this.data() && this.data().imageId){
        Session.set("showingImageId", 
            this.data().imageId);
      }
      this.render(getTemplate('PostsShow'));
    }
});
Router.route('/ep/:_id', {
    action: function() {
        $('body').css({overflow: "hidden"});
        Router.go("posts.show", {
            _id: this.params._id
        }, {
            query: 'embedded=yes'
        });
    },
    waitOn: function() {
        // return one handle, a function, or an array
        return Meteor.subscribe("posts", 1, {_id: this.params._id});
    }
});

Router.route('/users/:_id', {
    name: "users.show",
    data: function(){
        return Meteor.users.findOne({_id: this.params._id});
    },
    template: getTemplate('UsersShow'),
    subscriptions: function() {
      Session.set("postsQuery", {
        "user._id": this.params._id
      });
      return[
          Meteor.subscribe("users", this.params._id),
          Meteor.subscribe("stories", Session.get('UserStoriesLimit'), {"user._id": this.params._id}),
          Meteor.subscribe("userlikes", this.params._id),
          Meteor.subscribe("posts", Session.get('UserPostsLimit'), Session.get("postsQuery"))
      ];
    }
});


Router.route('/stories', {
    name: 'stories',
    data: function(){
        return Story.find({});
    },
    subscriptions: function(){
        return Meteor.subscribe("stories", Session.get('StoriesLimit'));
    }
});

Router.route('/stories/new', {
    name: 'stories.new',
    subscriptions: function(){
        Meteor.subscribe("posts", Session.get('UserPostsLimit'), {"user._id": Meteor.userId()});
    }
});

Router.route('/stories/:_id', {
    name: "stories.show",
    data: function(){
        return Story.find({_id: this.params._id});
    },
    subscriptions: function(){
        if(storiesSubscription)
            return Meteor.subscribe("stories", Session.get('UserStoriesLimit'), {"user._id": Meteor.userId()});
        else 
            return Meteor.subscribe("stories", 1, {"user._id": this.params._id});
    }
});


Router.route("/mypage", {
  name: "mypage",
  template: getTemplate('mypage'),
  subscriptions: function() {

    return [
        Meteor.subscribe("users"),
        Meteor.subscribe("myPosts", Session.get('PostsLimit'), Session.get("postsQuery"))
    ];
  }
});

Router.route("/mytags/:_id", {
  name: "myTagsShow",
  template: getTemplate('tagsShow'),
  data: function(){
    const album = Album.findOne(this.params._id);
    const user = Meteor.user();

    if(album && user){
      return  {
        title: Album.findOne(this.params._id).title,
        albumId: this.params._id,
        user: Meteor.user()
      };
    }
    else{
      return null;
    }
  },
  subscriptions: function(){
    Session.set('UserPostsLimt', 10);
    Session.set('postsQuery', {
      albumIds: {
        $in: [this.params._id]
      }
    });
    return [
      Meteor.subscribe("myPosts", 
          Session.get('UserPostsLimit'), 
          Session.get('postsQuery')),
      Meteor.subscribe("albums", 100, {
        _id: this.params._id
      })
    ];
  },
  action: function(){
    if(this.data()){
      this.render(getTemplate('tagsShow'));
    }
    else{
      this.render('loading');
    }
  }
});

Router.route("/locations/posts", {
  name : "locations",
  template: getTemplate('tagsShow'),
  data: function(){
    const result = {};
    if(this.params.query.country){
      result.address = {};
      result.address.country = this.params.query.country;
      if(this.params.query.city && this.params.query.city !== "")
        result.address.city = this.params.query.city;
    }

    result.title = getCountryName(this.params.query.country);
    if(this.params.query.city && this.params.query.city != "")
      result.title = result.title.concat("-" + this.params.query.city);
    const userId = this.params.query.userId;
    if(userId) result.user = Meteor.users.findOne(userId);
    return result;
  },
  subscriptions: function(){

      const query = {};
      query['address.country'] = this.params.query.country;
      if(this.params.query.city && this.params.query.city != "")
        query['address.city'] = this.params.query.city;

      Session.set("postsQuery", query);
      const subscriptions = [
        Meteor.subscribe("posts", Session.get('UserPostsLimit'), Session.get("postsQuery"))
      ];
      const userId = this.params.query.userId;
      if(userId){
        subscriptions.push(Meteor.subscribe("user", userId));
      }
      return subscriptions; 
  }
});

Router.route("/tags/:_id", {
  name: "tagsShow",
  template: getTemplate('tagsShow'),
  data: function(){
    const album = Album.findOne(this.params._id);
    if(album){
      return  {
        title: Album.findOne(this.params._id).title,
        albumId: this.params._id,
        user: Meteor.users.findOne({_id: this.params.query.userId})
      };
    }
    else{
      return null;
    }
  },
  subscriptions: function(){
    postsSubscription = ()=>{ 
      const subsResult = [
        Meteor.subscribe("posts", Session.get('UserPostsLimit'), {
          albumIds: {
            $in: [this.params._id]
          }
        }),
        Meteor.subscribe("albums", 100, {
          _id: this.params._id
        })
      ];

      if(this.params.query.userId){
        subsResult.push(Meteor.subsribe("user", this.params.query.userId));
      }
      return subsResult;
    };
    return postsSubscription;
  },
  action: function(){
    if(this.data()){
      this.render(getTemplate('tagsShow'));
    }
    else{
      this.render('loading');
    }
  }
});

Router.route("/intro", {
    name: "intro"
});

Router.route('/private_policy', {
    name: "private.policy",
});
