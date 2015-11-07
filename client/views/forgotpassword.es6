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

Template.forgotpassword.events(Object.assign({
  "click .modal-window .content": function(){
    return false;
  },
  "click #forgot-password": function(){
    FView.byId("forgot-password").node.slideUp();
    turnEditingMode(false);
    $(".hide-on-modal").show();
  },
  'click #close-reset-button': () =>{
    FView.byId('forgot-password').node.slideUp();
  },
  'submit #reset-form': (e, t) =>{
    if(validateEmail('#reset-email')){
      const email = t.find('#reset-email').value;
      $("#forgot-password input, #forgot-password button").prop("disabled",true);
      $("#forgot-password .form-loading").slideDown();
      try{
        Accounts.forgotPassword({email:email}, function(err){
          $("#forgot-password input, #forgot-password button").prop("disabled",false);
          $("#forgot-password .form-loading").slideUp();
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
        $("#forgot-password .form-loading").slideUp();
      }
    }
    return false;
  }
}, getModalCloseEventsObj("forgot-password", "forgot-password")));

Template.forgotpassword.rendered = () =>{
    Session.set("sent-email", false);
}
