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
  data: function(){
    return Post.findOne({_id: this.params._id});
  }
});
