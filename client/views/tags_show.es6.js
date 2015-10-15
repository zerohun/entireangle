const tagsShowHelpers = {
  "posts": function(){
    return Post.find({}, {sort:{createdAt: -1}});
  },
  "postsOptions": function(){
    return {
      hideUserThumbnail: true
    }
  }
};

const tagsShowEvents = {
};

const tagsShowRendered = function(){
  FView.byId("loading-box").node.hide();
}

Template.tagsShowMobile.helpers(tagsShowHelpers);
Template.tagsShowMobile.events(tagsShowEvents);
Template.tagsShowMobile.rendered = tagsShowRendered;
