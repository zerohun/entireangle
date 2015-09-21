Accounts.onCreateUser((options, user)=>{
  if(user.services.facebook){
    user.username = options.profile.name;
    user.isActivated = false;
  }
  else{
    user.isActivated = true;
  }
  return user;
});
