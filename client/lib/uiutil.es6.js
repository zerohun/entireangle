window.isFacebookuser = ()=> Meteor.user() && Meteor.user().services.facebook;
window.continueFacebookSignupProcess  = ()=>{
  if(window.isFacebookuser()){
    var user = Meteor.user();
    if(user.isActivated === false && user.services.facebook){
      window.waitForDom("#register-email", ()=>{
        $("#register-email").val(user.services.facebook.email);
          $("#register-email").attr('disabled','disabled');
      });
      window.waitForDom("#register-username", ()=>{
        $("#register-username").val(user.username);
      });
      window.waitForDom(".password-fields", ()=>{
        $(".password-fields").hide();
      });
      window.waitForDom("#register-window .login-with-facebook", ()=>{
        $("#register-window .login-with-facebook").remove();
      });
      window.waitForDom("#close-register-button", ()=>{
        $("#close-register-button").hide();  
      });
      FView.byId("register-form").node.slideDown();
    }
    FB.api(
      `/${user.services.facebook.id}/picture`,
      function (response) {
        if (response && !response.error) {
          window.waitForDom("#facebook-image", ()=>{
            $("#facebook-image").html(`<img src='${response.data.url}'><input name="snsImageUrl" type="hidden" value='${response.data.url}'>`);
          });
        }
      }
    );
  }
};