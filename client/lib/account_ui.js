Accounts.onResetPasswordLink(function(token, done){
  window.resetPasswordInfo = {
    token: token,
    done: done
  }
});


