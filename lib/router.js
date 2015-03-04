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
  name: "posts.new"
});
Router.route('/posts/:_id', {
  name: "posts.show",
  data: function(){
    Post.findOne({_id: this.params._id});
  }
});
