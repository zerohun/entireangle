const templateHomeHelpers = {
  "featuredPosts": ()=>{
    return Post.find({
      isFeatured: true,
      isPublished: true
    }, {$limit: 30});
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
