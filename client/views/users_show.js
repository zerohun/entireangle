const TemplateUsersShowHelpers = {
  user: function(){
      return Router.current().data();
  },
  username: function(){
      return Router.current().data().username;
  },
  posts: function(){
      return Post.find({}, {sort:{
        createdAt: -1
      }});
  }
};

const TemplateUsersShowRendered = function(){
    enableEndlessScroll("UserPostsLimit", Post);
    FView.byId("loading-box").node.hide();
};

Template.UsersShow.helpers(TemplateUsersShowHelpers);
Template.UsersShow.rendered = TemplateUsersShowRendered;

Template.UsersShowMobile.helpers(TemplateUsersShowHelpers);
Template.UsersShowMobile.rendered = TemplateUsersShowRendered;
