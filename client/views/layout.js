Meta.config({
    options: {
        title: "EntireAngle - Pictures for Virtual reality",
        suffix: "Suffix"
    }
});

if(isMobile.phone)
  Meta.set({
      name: 'name',
      property: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
  });


Session.set("isGoogleLoaded", false);
const googleLoadedInterval = setInterval(function(){
    if(typeof google !== "undefined"){
      Session.set("isGoogleLoaded", true);
      clearInterval(googleLoadedInterval);
    }
}, 500);

const templateLayoutRendered = function(){
  
    setInterval(function(){
      $(".modal-window").css('height', $(window).height() + 'px');
      $(".modal-window .content").css('height', ($(window).height() /10 * 9) + 'px');
    }, 500);

    //$('body').css({overflow: "scroll"});

    if(Meteor.user()){
      Meteor.subscribe("notifications", 10);
    }
};

Template.layout.rendered = templateLayoutRendered;
Template.layoutMobile.rendered = templateLayoutRendered;

Template._loginButtonsAdditionalLoggedInDropdownActions.events({
    'click #login-buttons-edit-profile': function(event) {
        Router.go('mypage');
    }

});

