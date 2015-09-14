Template.UsersShow.helpers({
    username: function(){
        return Router.current().data().username;
    },
    posts: function(){
        return Post.find({}, {sort:{
          createdAt: -1
        }});
    }
});

Template.UsersShow.rendered = function(){
    enableEndlessScroll("UserPostsLimit", Post);
    FView.byId("loading-box").node.hide();
};
