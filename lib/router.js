Router.configure({
  layoutTemplate: 'layout'
});
Router.route('/', {
  name: "home",
  action: function(){
    this.redirect('posts');
  }
});
Router.route('/about', {
  name: "about"
});
Router.route('/posts', {
  name: "posts"
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
      Router.go("posts");
    }
  }
});
Router.route('/posts/:_id', {
  name: "posts.show",
  waitOn: function () {
    // return one handle, a function, or an array
    return Meteor.subscribe('posts');
  },
  data: function(){
    var post = Post.findOne({_id: this.params._id});
    if(post){
      post.description = "EntireAngle - Pictures for virtual reality";
      var imageUrl = Image.findOne({_id: post.imageId}).url({store:'snsThumbs'});
      post.thumbnail = function(){return imageUrl};
      post.summary = "EntireAngle - Pictures for virtual reality";
    }
    return post;
  },
  action: function(){
    if (this.data()) {
      this.render("PostsShow");
    }
  }
});
Router.route('/ep/:_id', {
  action: function(){
    Router.go("posts.show", {_id: this.params._id}, {query: 'embedded=yes'})
  }
});
