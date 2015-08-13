function resetMsgSessions() {
  Session.set("register-email-msg", "");
  Session.set("register-password-msg", "");
  Session.set("register-username-msg", "");
  Session.set("register-msg", "");
}
function resetInputs() {
  $("#register-window input[type=text]").val("");
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
  }
});
Template.register.events({
  'click #close-register-button': function(){
    FView.byId("register-form").node.hide(); 
    return false;
  },
  'submit #register-form' : function(e, t) {
    let canCreateUser = true;
    canCreateUser &= validateEmail('#register-email', 'register-email-msg');
    canCreateUser &= validateLength('#register-password', 6, 'register-password-msg');
    canCreateUser &= validateLength('#register-username', 1, 'register-username-msg');

    if(canCreateUser){
        var email = t.find('#register-email').value, 
            password = t.find('#register-password').value,
            username = t.find('#register-username').value;

        // Trim and validate the input

      Accounts.createUser({email: email, password : password, username: username}, function(err){
          if (err) {
            Session.set("register-msg", err.message);
          } else {
            Session.set("register-msg", "");
            Meteor.loginWithPassword(email, password, (err) =>{
              if(err){
                alert(err.message);
              }
              else{
                resetMsgSessions();
                setTimeout(()=>{
                  FView.byId("register-form").node.hide(); 
                }, 1000);
              }
            });
          }

        });
    }

    return false;
  }
});

Template.register.rendered = () =>{
  validateEmailFieldonKeyDown("#register-email", 'register-email-msg');
  resetMsgSessions();
}
