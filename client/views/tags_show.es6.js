const tagsShowHelpers = {
  "user": function(){
    const data = Router.current().data();
    if(data.username)
      return data;
    else if(data.user && data.user.username)
      return data.user;
    else
     return null;
  },
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
