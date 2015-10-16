Template.headerMobile.events({
  "click .account-button": ()=>{
      FView.byId("login-form").node.slideDown();
  } 
});
Template.headerMobile.helpers({
  unreadNotificationCount: function(){
    let query = {};
    if(Cookie.get("lastNotificationCreatedAt"))
      query ={ 
        createdAt: {
          $gt: new Date(Number.parseInt(Cookie.get("lastNotificationCreatedAt")))
        }
      };

    return Notification.find(query).count();
  }
});

Template.headerMobile.rendered = ()=>{
  $('.dropdown-button').dropdown();
  $('.header-modal-trigger').leanModal({
    ready: function(){
      console.log('header');
      $(".lean-overlay").prependTo("#wrapping-container");
      const lastNotification = Notification.findOne({}, {
        $sort: {
          createdAt: -1
        }
      });
      if(lastNotification)
        Cookie.set("lastNotificationCreatedAt", 
            lastNotification.createdAt.getTime(),
            {years: 2100}
            );
      
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
