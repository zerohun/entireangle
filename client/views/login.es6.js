Template.login.helpers({
  //emailMsg: ()=> {
    //return Session.get("login-email-msg");
  //},
  loginMsg: ()=> {
    return Session.get("login-msg");
  },
  loginTopMessage: ()=> {
    return Session.get('login-top-message');
  }
});

Template.login.events(
  Object.assign({
  'click #register-button': () =>{
    FView.byId("login-form").node.slideUp(); 
    FView.byId("register-form").node.slideDown(); 
  },
  'click #reset-password-button': () =>{
    FView.byId("login-form").node.slideUp(); 
    FView.byId("forgot-password").node.slideDown(); 
  },
  'click #close-login-button': () =>{
    FView.byId("login-form").node.slideUp(); 
  },
  'click .login-with-facebook': ()=>{
    Meteor.loginWithFacebook({
      requestPermissions: ['email']
    }, function (err) {
    if (err){
      alert(err.reason);
    }
    else
      FView.byId("login-form").node.slideUp(); 
    });
  },
  'submit #login-form' : (e, t) =>{
    if(validateEmail('#login-email', 'login-email-msg')){ 
      // retrieve the input field values
      var email = t.find('#login-email').value
        , password = t.find('#login-password').value;

        // Trim and validate your fields here.... 

        // If validation passes, supply the appropriate fields to the
        // Meteor.loginWithPassword() function.
        Meteor.loginWithPassword(email, password, (err) => {
          if (err){
            Session.set("login-msg", err.message);
            // The user might not have been found, or their passwword
            // could be incorrect. Inform the user that their
            // login attempt has failed. 
          }
          else{
            Session.set('login-top-message', '');
            setTimeout(function(){
              Session.set("login-msg", "");
              FView.byId("login-form").node.slideUp(); 
            }, 1000);
              // The user has been logged in.
          }
        });
      }
      return false; 
    }
  }, getModalCloseEventsObj('login-window', 'login-form'))
);


Template.login.rendered = () =>{
  validateEmailFieldonKeyDown("#login-email", 'login-email-msg');
}
