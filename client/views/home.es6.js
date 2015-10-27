const templateHomeHelpers = {
  "featuredPosts": ()=>{
    return Post.find({});
  }  
};

const templateHomeRendered = ()=>{
  FView.byId("loading-box").node.hide();
  $("body").css("overflow", "scroll");
};

Template.homeMobile.helpers(templateHomeHelpers);
Template.homeMobile.rendered = templateHomeRendered;
Template.home.helpers(templateHomeHelpers);
Template.home.rendered = templateHomeRendered;
