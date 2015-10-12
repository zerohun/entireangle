Template.headerMobile.events({
  "click .account-button": ()=>{
      FView.byId("login-form").node.slideDown();
  } 
});
Template.headerMobile.helpers({

});

Template.headerMobile.rendered = ()=>{
  $('.dropdown-button').dropdown();
  $('.header-modal-trigger').leanModal({
    ready: function(){
      console.log('header');
      $(".lean-overlay").prependTo("#wrapping-container");
      $(".lean-overlay").click(function(){
        $(".lean-overlay").remove();
      });
    },
    complete: function(){
      $(".lean-overlay").remove();
      console.log('complete');
    }
  });
}
