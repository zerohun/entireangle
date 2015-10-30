const templateHomeHelpers = {
  "featuredPosts": ()=>{
    const posts = Post.find(
        Session.get("postsQuery"),
        {$limit: 30});

    Session.set("postIds", posts.fetch().map((p) => p._id));
    return posts;
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
