Template.registerHelper("isLoggedIn", function(){
  return Meteor.user() !== null;
});
Template.registerHelper("username", function(){
  return Object.try(Meteor.user(), "username");
});
