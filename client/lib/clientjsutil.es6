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

window.unveilOrHide = function(){
  const HEIGHT_LOADING_BUFFER_SIZE = 200;
  $(".post-image").toArray().forEach((e) => {
    const $e = $(e);
    const $w = $(window);
    if($e.offset().top > $w.scrollTop() - HEIGHT_LOADING_BUFFER_SIZE && 
        $e.offset().top + $e.height()  <  $w.scrollTop() + $w.height() + HEIGHT_LOADING_BUFFER_SIZE){
      $e.attr("src", $e.data("image-src"));
    }
    else{
      //console.log("$e.top :" + $e.offset().top);
      //console.log("$w.top :" + $w.scrollTop() );
      //console.log("$e.bottom :" + $e.offset() + $e.height());
      //console.log("$w.bottom :" + $w.scrollTop() + $w.height());
      $e.attr("src", "/images/loadingimage.jpg");
      $e.data("src", $e.attr("image-src"));
    }
  });
};

