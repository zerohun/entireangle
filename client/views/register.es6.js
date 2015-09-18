function resetMsgSessions() {
  Session.set("register-email-msg", "");
  Session.set("register-password-msg", "");
  Session.set("register-username-msg", "");
  Session.set("register-msg", "");
  Session.set("register-private-policy-msg", "");
}
function resetInputs() {
  $("#register-window input[type=text]").val("");
}

function isFacebookuser(){
  return  Meteor.user() && Meteor.user().services.facebook
}

function finishRegisterWindow(){
  resetMsgSessions();
  setTimeout(()=>{
    FView.byId("register-form").node.slideUp(); 
  }, 1000);
  
}

Template.register.helpers({
  emailMsg: ()=> {
    return Session.get("register-email-msg");
  },
  passwordMsg: ()=> {
    return Session.get("register-password-msg");
  },
  usernameMsg: ()=> {
    return Session.get("register-username-msg");
  },
  registerMsg: ()=> {
    return Session.get("register-msg");
  },
  passwordMatchMsg: ()=> {
    return Session.get("register-password-match-msg");
  },
  privatePolicyMsg: ()=>{
    return Session.get("register-private-policy-msg");
  },
  isFacebookuser: isFacebookuser
});
Template.register.events({
  'click #close-register-button': function(){
    FView.byId("register-form").node.slideUp(); 
    return false;
  },
  'submit #register-form' : function(e, t) {
    let canCreateUser = true;
    canCreateUser &= validateEmail('#register-email', 'register-email-msg');
    canCreateUser &= validateLength('#register-username', 1, 'register-username-msg');
    if(!isFacebookuser){
      canCreateUser &= validateLength('#register-window .password-input', 6, 'register-password-msg');
      canCreateUser &= validatePasswordMatched($('#register-window .password-reinput'), 'register-password-match-msg');
    }
    canCreateUser &= validateCheckbox($('#private-policy-checkbox'), 'register-private-policy-msg');

    if(canCreateUser){
        var email = t.find('#register-email').value, 
            password = t.find('#register-window .password-input').value,
            username = t.find('#register-username').value;
            snsImageUrl = e.target.snsImageUrl.value;

        // Trim and validate the input

      $("#register-window input, #register-window button").prop("disabled",true);
      $("#register-window .form-loading").slideDown();
      if(isFacebookuser()){
          Meteor.call("updateUserWithActivation", {username: username, snsImageUrl: snsImageUrl}, function(err){
            if(err)
              console.error(err);
            else
              finishRegisterWindow();
          });
      }
      else{
        try{
          Accounts.createUser({email: email, password : password, username: username}, function(err){
            $("#register-window input, #register-window button").prop("disabled",false);
            $("#register-window .form-loading").slideUp();
            if (err) {
              Session.set("register-msg", err.message);
            } 
            else {
              Session.set("register-msg", "");
              Meteor.loginWithPassword(email, password, (err) =>{
                if(err){
                  alert(err.message);
                }
                else{
                  finishRegisterWindow();
                }
              });
            }
          });
        }
        catch(e){
          
        }
      }
      $("#register-window input, #register-window button").prop("disabled",false);
      $("#register-window .form-loading").slideUp();
    }

    return false;
  },
  'click .login-with-facebook': (event)=>{
    event.preventDefault();
    Meteor.loginWithFacebook({
      requestPermissions: ['email', 'user_about_me']
    }, function (err) {
      if (err){
        alert(err.reason);
      }
      else{
        FView.byId("register-form").node.slideUp();
      }
    });
  }
});

Template.register.rendered = () =>{
  validateEmailFieldonKeyDown("#register-email", 'register-email-msg');
  resetMsgSessions();
};
