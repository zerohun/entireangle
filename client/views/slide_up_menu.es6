Template.slideUpMenu.rendered = ()=>{
  const HANDLE_SIZE = famous.customLayouts.SlideUpWindow.constants.SLIDE_UP_HANDLE_SIZE;
  $("#slide-up-menu #slide-up-handle").css('height', HANDLE_SIZE + 'px' );
  const windowHeight = FView.byId("slide-up-menu").node.height;
  $('#slide-up-menu #scrollable').css("height", (windowHeight - HANDLE_SIZE) + 'px');

}
