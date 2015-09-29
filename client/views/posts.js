var templatePostsHelpers = {
        posts: function() {
          return Router.current().data().posts;
    }
}

var templatePostsEvents = {
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
};

var templatePostHelper = {
    thumbUrl: function(imageId, isVideo) {
        if (isVideo) {
            return Video.findOne({
                _id: imageId
            }).url({
                store: 'video_thumbs'
            });
        } else {
            var image = Image.findOne({
                _id: imageId
            });
            return image.url({store: 'thumbs'}) + "&uploadAt=" + image._getInfo('thumbs').updatedAt.getTime();
        }
    }
};


templatePostsRendered = function() {
    var fview = FView.byId('header-footer');
    //fview.node.setHeightMode(famous.customLayouts.HeaderFooterLayout.HEIGHT_MODES.SCROLL);
    enableEndlessScroll("PostsLimit", Post);
    FView.byId("loading-box").node.hide();
};



Template.Posts.helpers(templatePostsHelpers);
Template.Posts.events(templatePostsEvents);
Template.Posts.rendered = templatePostsRendered; 

Template.PostsMobile.helpers(templatePostsHelpers);
Template.PostsMobile.events(templatePostsEvents);
Template.PostsMobile.rendered = templatePostsRendered;

Template.post.helpers(templatePostHelper);
Template.postMobile.helpers(templatePostHelper);

