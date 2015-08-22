Template.slideUpMenu.helpers({
  "embedUrl": function() {
    var hrefList = location.href.split('/');
    var address = location.protocol + "//" + hrefList[1] + hrefList[2] + "/ep/" + Router.current().params._id;
    return "<iframe width='560' height='315' src='" + address + "' frameborder='0' allowfullscreen></iframe>";
  }
  "post": function(){

  }
});

Template.slideUpMenu.rendered = ()=>{
  const HANDLE_SIZE = famous.customLayouts.SlideUpWindow.constants.SLIDE_UP_HANDLE_SIZE;
  $("#slide-up-menu #slide-up-handle").css('height', HANDLE_SIZE + 'px' );
  FView.byId("slide-up-menu").node.onSizeChange((size)=>{
    const windowHeight = size.height; 
    $('#slide-up-menu #scrollable').css("height", (windowHeight - HANDLE_SIZE) + 'px');
  });
}
