window.waitForDom = (cssSelector, callbackFunc) =>{
  setTimeout(() =>{
    const $dom = $(cssSelector);
    console.log($dom.length);
    if($dom.length > 0){
      callbackFunc();
      return;
    }
    else{
      window.waitForDom(cssSelector, callbackFunc);
    }
  }, 200);
}; 
window.registerLoginBtnCallback = function(){
  waitForDom('#login-btn', function(){
    Rx.Observable.fromEvent($("#login-btn"), 'click').
      subscribe(function(){
        FView.byId("login-form").node.slideDown();
        FView.byId("slide-up-menu").node.slideDown();
      });
  });
}
window.getModalCloseEventsObj = function(domId, windowId){
  const result = {
    "click .modal-window .content": function(e){
      if(e.target.type === "submit")
        return true;
      else
        return false;
    }
  };
  result[`click \#${domId}`] = function(e){
    if(e.target.type !== "submit"){
      FView.byId(windowId).node.slideUp();
    }
  };
  return result;
};
