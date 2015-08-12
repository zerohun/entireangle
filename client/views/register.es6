Template.register.helpers({
  emailMsg: ()=> {
    return Session.get("register-email-msg");
  },
  passwordMsg: ()=> {
    return Session.get("register-password-msg");
  }
});
Template.register.events({
  'submit #register-form' : function(e, t) {
    if(validateEmail('#account-email', 'register-email-msg') && 
        validatePassword('#account-password', 'register-password-msg')){
        var email = t.find('#account-email').value, 
            password = t.find('#account-password').value;

        // Trim and validate the input

      Accounts.createUser({email: email, password : password}, function(err){
          if (err) {
            // Inform the user that account creation failed
          } else {
            // Success. Account has been created and the user
            // has logged in successfully. 
          }

        });
    }

    return false;
  }
});

Template.register.rendered = () =>{
  validateEmailFieldonKeyDown("#account-email", 'register-email-msg');
}
