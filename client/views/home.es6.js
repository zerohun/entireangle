Template.home.helpers({
  "featuredPosts": ()=>{
    return Post.find({});
  }  
});
Template.home.rendered = ()=>{
  FView.byId("loading-box").node.hide();
  $("body").css("overflow", "scroll");
}
