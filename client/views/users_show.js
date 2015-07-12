Template.UsersShow.helpers({
    username: function(){
        return Router.current().data().username;
    },
    posts: function(){
        return Post.find({});
    }
});

Template.UsersShow.rendered = function(){
    enablePostEndlessScroll("UserPostsLimit");
};
