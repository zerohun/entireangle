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
    const query = {};
    const data = Router.current().data();
    if(data.albumId){
      query.albumIds = {
        $in: [data.albumId]
      };
    }
    if(data.user){
      query['user._id'] = data.user._id;
    }
    if(data.address){
      query['address.country'] = data.address.country;
      if(data.address.city)
        query['address.city'] = data.address.city;
    }

    return Post.find(query, {$sort:{createdAt: -1}});
  },
  "postsOptions": function(){
    if(Router.current().data().user){
      return {
        hideUserThumbnail: true
      };
    }
    else{
      return {
        hideUserThumbnail: false
      };
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

Template.tagsShow.helpers(tagsShowHelpers);
Template.tagsShow.events(tagsShowEvents);
Template.tagsShow.rendered = tagsShowRendered;
