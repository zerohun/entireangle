Router.configure({
  layoutTemplate: 'layout'
});
Router.route('/', {
  name: "home",
  action: function(){
    this.redirect('images');
  }
});
Router.route('/about', {
  name: "about"
});
Router.route('/images', {
  name: "images"
});
Router.route('/images/new', {
  name: "images.new"
});
