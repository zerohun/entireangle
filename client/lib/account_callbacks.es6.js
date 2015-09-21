function isFacebookuser(){
  return  Meteor.user() && Meteor.user().services.facebook;
}
Accounts.onLogin(()=>{
  Meteor.subscribe("currentUser", function(){
    window.continueFacebookSignupProcess();
  });
});