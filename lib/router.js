var postsSubscription;

Router.configure({
  layoutTemplate: 'layout'
});
Router.onBeforeAction(function(){
    var ele = document.getElementById("orb-player");
    if(ele)
        ele.parentElement.removeChild(ele);

    this.next();

});
Router.route('/', {
  name: "home",
  action: function(){
    this.redirect('/posts');
  }
});
Router.route('/about', {
  name: "about"
});
Router.route('/posts', {
  name: "Posts",
  template: "Posts",
  subscriptions: function(){
      var limit = parseInt(this.params.query.postsLimit) || 10;
      postsSubscription = Meteor.subscribe("posts", limit);
      return postsSubscription;
  },
  data: function(){
      var limit = parseInt(this.params.query.postsLimit) || 10;
      return {
          posts: Post.find({},{limit: limit}),
          limit: limit
      };
  }
});
Router.route('/posts/new', {
  name: "posts.new",
  action: function(){
    if(Meteor.user()){
      this.render("PostsNew");
    }
    else{
      toastr.warning("You need to login to post a image");
      $("#login-dropdown-list").addClass("open");
      Router.go("Posts");
    }
  }
});

Router.route('/posts/:_id', {
  name: "posts.show",
  subscriptions: function () {
    // return one handle, a function, or an array
    if(postsSubscription){
        return postsSubscription;
    }
    else{
        return Meteor.subscribe('onePost', this.params._id);
    }

  },
  data: function(){
    var post = Post.findOne({_id: this.params._id});
    if(post){
      post.description = "EntireAngle - Pictures for virtual reality";
      post.summary = "EntireAngle - Pictures for virtual reality";
      var imageUrl;
      if(post.isVideo){
          imageUrl = Video.findOne({_id: post.imageId}).url({store:'video_thumbs'});
          post.summary += "(but this is video)";
      }
      else{
          imageUrl = Image.findOne({_id: post.imageId}).url({store:'snsThumbs'});
      }
      post.thumbnail = function(){return imageUrl};
    }

    return post;
  } ,
  action: function(){
    if (this.data()) {
      if(this.data().isVideo)
          this.render("VideoPostsShow")
      else
          this.render("PostsShow");
    }
  }
});
Router.route('/ep/:_id', {
  action: function(){
    Router.go("posts.show", {_id: this.params._id}, {query: 'embedded=yes'})
  },
  wiatOn: function () {
    // return one handle, a function, or an array
    return Meteor.subscribe('onePost', this.params._id);
  }
});
