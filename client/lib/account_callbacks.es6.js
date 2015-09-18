function isFacebookuser(){
  return  Meteor.user() && Meteor.user().services.facebook;
}
Accounts.onLogin(()=>{
  Meteor.subscribe("currentUser", function(){
    if(isFacebookuser()){
      var user = Meteor.user();
      if(!user.isActivated && user.services.facebook){
        $("#register-email").val(user.services.facebook.email);
        $("#register-username").val(user.username);
        $(".password-fields").hide();
        $("#register-window .login-with-facebook").remove();
        FView.byId("register-form").node.slideDown();
      }
      FB.api(
        `/${user.services.facebook.id}/picture`,
        function (response) {
          if (response && !response.error) {
            console.log(response);
            $("#register-email").attr('disabled','disabled');
            $("#facebook-image").html(`<img src='${response.data.url}'><input name="snsImageUrl" type="hidden" value='${response.data.url}'>`);
          }
        }
      );
    }
  });
});