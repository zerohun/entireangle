Accounts.onCreateUser((options, user)=>{
  if(user.services.facebook){
    user.isActivated = false;
  }
  else{
    user.isActivated = true;
  }
  return user;
});
