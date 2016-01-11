const templateHeaderEvents = {
  "click .header-bar": (e)=>{
    if(areThereOpendWindows()){
      closeAllWindowAndModal();
      e.preventDefault();
      return false;
    }
    return true;
  },
  "click .account-button": ()=>{
      FView.byId("login-form").node.slideDown();
  }, 
  "click .close-modal-button": function(e){
    $(e.target).parents(".modal").first().closeModal();
  },
};

const templateHeaderHelpers = {
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
};

const templateHeaderRendered = ()=>{

  $('.dropdown-button').dropdown();
  $('.header-modal-trigger').leanModal({
    ready: function(){
      console.log('header');
      $("#notification-modal").css("margin-top", "10px");
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
};
Template.header.events(templateHeaderEvents);
Template.header.helpers(templateHeaderHelpers);
Template.header.rendered = templateHeaderRendered;

Template.headerMobile.events(templateHeaderEvents);
Template.headerMobile.helpers(templateHeaderHelpers);
Template.headerMobile.rendered = templateHeaderRendered;
