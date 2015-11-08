Template.body.rendered = function(){
  const navHeight = $(".top-nav-bar").height();
  console.log(navHeight);
  if(isMobile.phone)
    $("body").css('padding-top', navHeight + 10 + 'px');
  else
    $("body").css('padding-top', navHeight + 20 + 'px');
};
