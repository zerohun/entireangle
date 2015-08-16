Template.resetpassword.helpers({
  resetedPassword: ()=>{
    return Session.get("reseted-password");
  },
  resetMsg: ()=> {
    return Session.get("reset-msg");
  },
  passwordMsg: ()=> {
    return Session.get("reset-password-msg");
  },
  passwordMatchMsg: ()=> {
    return Session.get("reset-password-match-msg");
  }

});

Template.resetpassword.events({
  'click #close-reset-button': function(){
    FView.byId("reset-form").node.slideUp(); 
    return false;
  },
  'submit #reset-form' : function(e, t) {
    let canResetPassword = true;
    canResetPassword &= validateLength('#reset-window .password-input', 6, 'reset-password-msg');
    canResetPassword &= validatePasswordMatched($('#reset-window .password-reinput'), 'reset-password-match-msg');
    const newPassword = t.find('#reset-window .password-input').value;

    if(canResetPassword && resetPasswordInfo){
      $("#reset-window input, #reset-window button").prop('disabled', true);
      try{
        Accounts.resetPassword(resetPasswordInfo.token, newPassword, (err)=>{
          $("#reset-window input, #reset-window button").prop('disabled', false);
          if(err)
            Session.set("reset-msg", err.message);
          else{
            Session.set("reset-msg", "");
            resetPasswordInfo.done();
            Session.set("reseted-password", true);
            setTimeout(()=>{
              FView.byId("reset-form").node.slideUp();
            }, 1000);
          }
        });
      }
      catch(e){
        $("#reset-window input, #reset-window button").prop('disabled', false);
      }
    }
    return false;
  }
});
Template.resetpassword.rendered = ()=>{
  if(window.resetPasswordInfo){
    FView.byId("reset-form").node.slideDown();
  }
}
