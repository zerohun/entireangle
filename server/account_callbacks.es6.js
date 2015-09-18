Accounts.onCreateUser((options, user)=>{
  if(user.services.facebook){
    user.username = options.profile.name;
  }
  else{
    user.isActivated = true;
  }
  return user;
});
