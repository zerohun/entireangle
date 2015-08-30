Template.Posts.helpers({
        posts: function() {
        return Router.current().data().posts;
    }
});

Template.Posts.events({
    "click #image-list": function() {
        Session.set('isVideo', false);
        Session.set('PostsLimit', 10);
    },
    "click #video-list": function() {
        Session.set('isVideo', true);
        Session.set('PostsLimit', 10);
    },
    "click .user-link": function(){
        Session.set('UserPostsLimit', 10);
    }
});

Template.post.helpers({
    thumbUrl: function(imageId, isVideo) {
        if (isVideo) {
            return Video.findOne({
                _id: imageId
            }).url({
                store: 'video_thumbs'
            });
        } else {
            return Image.findOne({
                _id: imageId
            }).url({
                store: 'thumbs'
            });
        }
    }
});

Template.Posts.rendered = function() {
    $("body").css("overflow", "scroll");
    var fview = FView.byId('header-footer');
    fview.node.setHeightMode(famous.customLayouts.HeaderFooterLayout.HEIGHT_MODES.SCROLL);
    enableEndlessScroll("PostsLimit", Post);
    FView.byId("loading-box").node.hide();
};

Template.Posts.destroyed = function(){
};
