window.isLoggedIn = ()=>{
  return Meteor.user() && Meteor.user().isActivated != false;
}

Template.registerHelper("isGoogleLoaded", function(){
  return Session.get("isGoogleLoaded");
});
Template.registerHelper("isOnAltVR", function(){
  return navigator.userAgent.search("AltspaceVR") > -1;
});
Template.registerHelper("isLoggedIn", window.isLoggedIn);
Template.registerHelper("shortenText", function(num,text){
  if(text.length > num)
    return text.substr(0,num).concat('...');
  else
    return text;
});
Template.registerHelper("isMobile", function(){return isMobile.phone});
Template.registerHelper("isDesktop", function(){return !isMobile.phone});
Template.registerHelper("username", function(){
  let username = Object.try(Meteor.user(), "username");
  return username;
});
Template.registerHelper("shortUsername", function(){
  let username = Object.try(Meteor.user(), "username");
  if(username && username.length > 6){
    username = username.substring(0,5) + "...";
  }
  return username;
});
