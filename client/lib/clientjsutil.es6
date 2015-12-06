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
window.getModalCloseEventsObj = function(domId, windowId){
  const result = {};
  result[`click \#${domId}`] = function(e){
    if($(e.target).parents('.modal-window .content').length === 0)
      FView.byId(windowId).node.slideUp();
  };
  return result;
};

window.unveilOrHide = function(){
  const HEIGHT_LOADING_BUFFER_SIZE = 200;
  setTimeout(()=>{
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
  }, 100);
};

window.closeModals = function(){
  if(areThereOpendMaterialModals()){
    $(".modal").closeModal();
    $(".lean-overlay").remove();
    $(".hide-on-modal").show();
    $(".arrow_box").removeClass("hide");

    if(Orb.oneInstance){
      Orb.oneInstance.setState("running");
      Orb.oneInstance.enableControl();
    }
  }
}
const windowIdList = [
  "login-form",
  "register-form",
  "forgot-password",
  "reset-form",
  "post-content"
];

function areThereOpendFViewWindow(){
  let result = false;
  windowIdList.forEach((id)=>{
    const fview = FView.byId(id);
    if(!fview) return;
    const node = fview.node;
    if(node.isVisible()) {
      result = true;
      return;
    }
  });
  return result;
}

function areThereOpendMaterialModals(){
  const $modals = $(".modal");
  for(var i=0; i < $modals.length; i++){
    if(Number($($modals[i]).css("opacity")) > 0.0)
      return true;
  }
  return false;
}

window.areThereOpendWindows = function(){
  return areThereOpendFViewWindow() || 
    areThereOpendMaterialModals();
}
window.closeAllWindowAndModal = function(){
  windowIdList.forEach((id)=>{
    const fview = FView.byId(id);
    if(!fview) return;
    const node = fview.node;
    if(node.isVisible()) 
      node.slideUp(); 
  });
  closeModals();
}
