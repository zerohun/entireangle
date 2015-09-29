Template.headerMobile.events({
  "click .account-button": ()=>{
    if(isLoggedIn())
      console.log("mypage");
    else
      FView.byId("login-form").node.slideDown();
  } 
});

Template.headerMobile.rendered = ()=>{
  $('.dropdown-button').dropdown();
}
