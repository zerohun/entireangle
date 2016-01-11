const trimInput = (val) =>{
  return val.replace(/^\s*|\s*$/g, "");
}

window.validateEmailFieldonKeyDown = (cssSelector, msgKey) =>{
  Rx.Observable.fromEvent($(cssSelector), "keydown").
    subscribe(e => {
      const val = $(cssSecetor).val();
      if(val === "") return;
      let value = trimInput(val);
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

window.validateLength = (cssSelector, lengthLimit, msgKey) =>{
  //if(callee.arguments.length < 3){
    //throw new Error("insurfficent params");
  //}
  const val = $(cssSelector).val();
  let errMsg;
  if(lengthLimit == 1){
    errMsg = `Shouldn't be empty`;
  }
  else if(lengthLimit > 1){
    errMsg = `Too short(should be at least ${lengthLimit} characters)`;
  }
  else{
      throw new Error("lengthLimit shold be larger then 1");
  }
  if(val && val.length >= lengthLimit){
    Session.set(msgKey, "");
    return true;
  }
  else{
    Session.set(msgKey, errMsg);
    return false;
  }
}

window.validatePasswordMatched = (retypeEle, msgKey) =>{
    const passwordEle = retypeEle.parent().parent().parent().find(".password-input");
    if(retypeEle.val() === passwordEle.val()){
      Session.set(msgKey, "");
      return true;
    }
    else{
      Session.set(msgKey, "Password is not matching");
      return false;
    }
}

window.validateCheckbox = (cssSecetor, msgKey) =>{
  if($(cssSecetor).prop("checked")){
    return true;
  }
  else{
    Session.set(msgKey, "You must check to register");
    return false;
  }
}

