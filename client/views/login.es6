Template.login.helpers({
  //emailMsg: ()=> {
    //return Session.get("login-email-msg");
  //},
  loginMsg: ()=> {
    return Session.get("login-msg");
  }
});

Template.login.events({
  'click #register-button': () =>{
    Router.go('register');
  },
  'click #close-login-button': () =>{
    FView.byId("login-form").node.hide(); 
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
            setTimeout(function(){
              Session.set("login-msg", "");
              FView.byId("login-form").node.hide(); 
            }, 1000);
              // The user has been logged in.
          }
        });
      }
      return false; 
    }
});


Template.login.rendered = () =>{
  validateEmailFieldonKeyDown("#login-email", 'login-email-msg');
}
