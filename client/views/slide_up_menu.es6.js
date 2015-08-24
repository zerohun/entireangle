function turnEditingMode(onOfOff) {
  if (onOfOff) {
      $(".view-box").hide();
      $(".edit-field").show();
  } else {
      $(".view-box").show();
      $(".edit-field").hide();
  }
}

Template.slideUpMenu.helpers({
  "embedUrl": function() {
    var hrefList = location.href.split('/');
    var address = location.protocol + "//" + hrefList[1] + hrefList[2] + "/ep/" + Router.current().params._id;
    return "<iframe width='560' height='315' src='" + address + "' frameborder='0' allowfullscreen></iframe>";
  },
  "post": function(){
    try {
      return Router.current().data();
    }
    catch(e){
      return false;
    }
  },
  "isMyPost": function(){
      try {
          return Router.current().data().user._id == Meteor.userId();
      } catch (e) {
          return false;
      }
  }
});
Template.slideUpMenu.events({
  "click #slide-up-edit": ()=>{
    turnEditingMode(true);
  },  
  "click #slide-up-cancel": ()=>{
    turnEditingMode(false);
    return false;
  },
  "submit #slide-up-edit-post": ()=>{
    const post = Router.current().data(); 
    post.title = event.target.title.value;
    post.desc = event.target.desc.value;
    Meteor.call("updatePost", post);
    turnEditingMode(false);
    return false;
    
  },
  "click #slide-up-remove": ()=>{
    const post = Router.current().data(); 
    Router.go('Posts');
    Meteor.call("removePost", post._id);
    return false;
  },
  "click #slide-up-vr-mode": ()=>{
    Template.PostsShow.toggleVRMode();
  }
});

Template.slideUpMenu.rendered = ()=>{
  const HANDLE_SIZE = famous.customLayouts.SlideUpWindow.constants.SLIDE_UP_HANDLE_SIZE;
  $("#slide-up-menu #slide-up-handle").css('height', HANDLE_SIZE + 'px' );
  const resizeCallbackFunc = (size)=>{
    const windowHeight = size.height; 
    $('#slide-up-menu #scrollable').css("height", (windowHeight - HANDLE_SIZE) + 'px');
  }
  const slideUpWindow = FView.byId("slide-up-menu").node;
  slideUpWindow.onSizeChange(resizeCallbackFunc);
  Tracker.autorun(()=>{
    slideUpWindow.resize();
  });
}
