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
  return isMobile.any? templateName + "Mobile": templateName;
}

function forceLogin(afterLoginCallback){
  if(!Meteor.user()){
    try{
      Materialize.toast('You need to login to upload images', 1000);
      FView.byId("login-form").node.slideDown();
      Router.go("/");
    }
    catch(e){
      setTimeout(function(){
        FView.byId("loading-box").node.hide();              
        FView.byId("login-form").node.slideDown();
        Router.go("Posts");
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

Router.configure({
    layoutTemplate: getTemplate("layout") 
});
Router.onBeforeAction(function() {
    $("body").css("overflow", "scroll");
    var $ele = $("#orb-player");
    if ($ele.count > 0)
        $ele.remove();

    this.next();
});
Router.route('/', {
    name: "home",
    subscriptions: function() {
      postsSubscription = function(){
        Meteor.subscribe("posts", 30, {isFeatured:true});
      }
      return postsSubscription();
    }
});
Router.route('/about', {
    name: "about"
});
Router.route('/posts', {
    name: "Posts",
    template: getTemplate("PostList"),
    subscriptions: function() {
        $("#list-fetching-bar").fadeOut(1000);
        var limit = Session.get("PostsLimit");
        postsSubscription = function(){ 
          return Meteor.subscribe("posts", limit, {isVideo: Session.get("isVideo")});
        }
        return postsSubscription();
    },
    data: function() {
        var limit = Session.get("PostsLimit");
        return {
            posts: Post.find({
                  isPublished: {
                    $ne: false
                  } 
                }, {
                limit: limit,
                sort: {
                  createdAt: -1
                }
            }),
            limit: limit
        };
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
    name: "PostsShowMobile",
    subscriptions: function() {
        // return one handle, a function, or an array
        var subscriptionList;
        if(this.params.query.isUploading && this.params.query.postIds){
            subscriptionList = [
              Meteor.subscribe("uploadingPosts", this.params.query.postIds.split(',')),
              Meteor.subscribe('comments', {postId: {
                $in: this.params.query.postIds.split(',')
              }})
            ];
        }
        else if(postsSubscription && this.params.query.from_notification !== '1'){
            var limit = Session.get("PostsLimit");
            //return Meteor.subscribe("posts", limit, {isVideo: Session.get('isVideo')});
            subscriptionList = [
              postsSubscription(),
              Meteor.subscribe('comments', {postId: this.params._id})
            ];
        }
        else{
            postsSubscription = null;
            subscriptionList = [
                Meteor.subscribe("posts", 1, {_id: this.params._id}),
                Meteor.subscribe('comments', {postId: this.params._id})
            ];
        }
        if(Meteor.user()) subscriptionList.push(Meteor.subscribe("likes", this.params._id));
        return subscriptionList;

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
                imageUrl = Image.findOne({
                    _id: post.imageId
                }).url({
                    store: 'snsThumbs'
                });
            }
            post.thumbnail = function() {
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
    action: function() {
        if (this.ready()) {
            if (this.data()) {
                $('body').css({overflow: "hidden"});
                if (this.data().isVideo){
                  this.render("VideoPostsShow");
                }
                else{
                  this.render(getTemplate("PostsShow"));
                }
            }
            else{
              this.render('Loading');
            }
        } else {
            this.render('Loading');
        }
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
      /*
        if(!postsSubscription)
            postsSubscription = Meteor.subscribe("posts", Session.get('UserPostsLimit'), {"user._id": this.params._id});

        if(!storiesSubscription)
            storiesSubscription = Meteor.subscribe("stories", Session.get('UserPostsLimit'), {"user._id": this.params._id});

      */
        var self = this;
        postsSubscription = function(){ 
          console.log("posts Sub");
          return Meteor.subscribe("posts", Session.get('UserPostsLimit'), {"user._id": self.params._id});
        };
        return[
            Meteor.subscribe("users", this.params._id),
            Meteor.subscribe("stories", Session.get('UserStoriesLimit'), {"user._id": this.params._id}),
            postsSubscription()
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
      postsSubscription = function(){ 
        if(Meteor.user()){
          console.log("posts Sub");
          return [
            Meteor.subscribe("myPosts", Session.get('UserPostsLimit'), Session.get("myPagePostsQuery")),

          ];
        }
        else return null;
      };
      return[
          Meteor.subscribe("users", this.params._id),
          postsSubscription()
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
        user: Meteor.user()
      };
    }
    else{
      return null;
    }
  },
  subscriptions: function(){
    postsSubscription = ()=>{ 
      return [
        Meteor.subscribe("myPosts", Session.get('UserPostsLimit'), {
          albumIds: {
            $in: [this.params._id]
          }
        }),
        Meteor.subscribe("albums", 100, {
          _id: this.params._id
        })
      ];
    };
    return postsSubscription();

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
    return {
      title: this.params.query.country + this.params.query.city
    };
  },
  subscriptions: function(){
      postsSubscription = ()=>{ 
        const query = {};
        query['address.country'] = this.params.query.country;
        if(this.params.query.city && this.params.query.city != "")
          query['address.city'] = this.params.query.city;
        return Meteor.subscribe("posts", Session.get('UserPostsLimit'), query);
      };
      return postsSubscription(); 
  }
});

Router.route("/tags/:_id", {
  name: "tagsShow",
  template: getTemplate('tagsShow'),
  data: function(){
    const album = Album.findOne(this.params._id);

    if(album){
      return  {
        title: Album.findOne(this.params._id).title
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
