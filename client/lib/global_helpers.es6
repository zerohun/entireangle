window.isLoggedIn = ()=>{
  return Meteor.user() && Meteor.user().isActivated != false;
}

Template.registerHelper("isLoggedIn", window.isLoggedIn);
Template.registerHelper("username", function(){
  let username = Object.try(Meteor.user(), "username");
  if(username.length > 6){
    username = username.substring(0,5) + "...";
  }
  return username;
});
