Template.slideUpMenu.rendered = ()=>{
  const HANDLE_SIZE = famous.customLayouts.SlideUpWindow.constants.SLIDE_UP_HANDLE_SIZE;
  $("#slide-up-menu #slide-up-handle").css('height', HANDLE_SIZE + 'px' );
  FView.byId("slide-up-menu").node.onSizeChange((size)=>{
    const windowHeight = size.height; 
    $('#slide-up-menu #scrollable').css("height", (windowHeight - HANDLE_SIZE) + 'px');
  });

}
