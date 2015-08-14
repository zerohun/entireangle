function resetMsgSessions() {
  Session.set("reset-email-msg", "");
}

Template.forgotpassword.helpers({
  emailMsg: ()=> {
    return Session.get("reset-email-msg");
  },
  sentMail: ()=> {
    return Session.get("sent-email");
  }
});

Template.forgotpassword.events({
  'click #close-reset-button': () =>{
    FView.byId('forgot-password').node.hide();
  },
  'submit #reset-form': (e, t) =>{
    if(validateEmail('#reset-email')){
      const email = t.find('#reset-email').value;
      $("#forgot-password input, #forgot-password button").prop("disabled",true);
      $("#forgot-password .form-loading").show();
      try{
        Accounts.forgotPassword({email:email}, function(err){
          $("#forgot-password input, #forgot-password button").prop("disabled",false);
          $("#forgot-password .form-loading").hide();
          if(err){
            Session.set("reset-email-msg", "This email address doesn't exist");
          }
          else{
            Session.set("reset-email-msg", "");
            Session.set("sent-email", true);
          }
        });
      }
      catch(e){
        $("#forgot-password input, #forgot-password button").prop("disabled",false);
        $("#forgot-password .form-loading").hide();
      }
    }
    return false;
  }
});

Template.forgotpassword.rendered = () =>{
    Session.set("sent-email", false);
}
