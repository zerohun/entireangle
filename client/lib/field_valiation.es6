const trimInput = (val) =>{
  return val.replace(/^\s*|\s*$/g, "");
}

const isValidPassword = (val) =>{
    return val.length >= 6; 
};

window.validateEmailFieldonKeyDown = (cssSelector, msgKey) =>{
  Rx.Observable.fromEvent($(cssSelector), "keydown").
    subscribe(e => {
      let value = trimInput($(cssSelector).val());
      $(cssSelector).val(value);
    });
};

window.validateEmail = (cssSelector, msgKey) =>{
  const val = $(cssSelector).val();
  if(validator.isEmail(val)){
    Session.set(msgKey, "");
    return true;
  }
  else{
    Session.set(msgKey, "invaldEmailFormat");
    return false;
  }
}

window.validatePassword = (cssSelector, msgKey) =>{
  const val = $(cssSelector).val();
  if(isValidPassword(val)){
    Session.set(msgKey, "");
    return true;
  }
  else{
    Session.set(msgKey, "Too short(should be atleast 6 characters)");
    return false;
  }
}

