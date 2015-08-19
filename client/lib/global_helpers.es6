Template.registerHelper("isLoggedIn", function(){
  return Meteor.user() !== null;
});
Template.registerHelper("username", function(){
  let username = Object.try(Meteor.user(), "username");
  if(username.length > 6){
    username = username.substring(0,5) + "...";
  }
  return username;
});
