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
        FView.byId("login-form").node.show();
      });
  });

}

