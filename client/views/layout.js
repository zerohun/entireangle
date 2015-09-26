//Accounts.ui.config({
    //requestPermissions: {},
    //extraSignupFields: [{
        //fieldName: 'username',
        //fieldLabel: 'username',
        //inputType: 'text',
        //visible: true,
        //saveToProfile: true
    //}, {
        //fieldName: 'terms',
        //fieldLabel: 'I accept the <a href="/private_policy">terms and conditions</a>',
        //inputType: 'checkbox',
        //visible: true,
        //saveToProfile: false,
        //validate: function(value, errorFunction) {
            //if (value) {
                //return true;
            //} else {
                //errorFunction('You must accept the terms and conditions.');
                //return false;
            //}
        //}
    //}]
//});

Meta.config({
    options: {
        title: "EntireAngle - Pictures for Virtual reality",
        suffix: "Suffix"
    }
});

Meta.set({
    name: 'name',
    property: 'viewport',
    content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
});

Template.layout.helpers({
    "menuItems": [
      {
        title: "gallery",
        url: "/posts"
      },
      {
        title: "upload",
        url: "/posts/new"
      }
    ]
});

Template.layout.rendered = function(){
    $('body').css({overflow: "scroll"});
    var tabNode = FView.byId('tab').node;
    $("#loading-box").css({width: $(window).width(), height: $(window).height()});
    var Position = famous.components.Position;
    var position = new Position(tabNode);
    position.set(0, 0, 0, { duration: 500, curve: 'inOutQuart' });

    $('body').css({overflow: "scroll"});
    var fview = FView.byId('header-footer');

    FView.byId("tabMenu").node.reflow();

    if(!Meteor.user())
      registerLoginBtnCallback();
      
    var slideUpWindow = FView.byId("slide-up-menu").node;
    Session.set('slideUpVisible', false);

    Tracker.autorun(function () {
      if(Session.get('slideUpVisible') === true){
        slideUpWindow.show();
      }
      else{
        slideUpWindow.slideDown();
        slideUpWindow.hide();
      }
    });
    $("img.lazy").unveil();

    if(Meteor.user()){
      Meteor.subscribe("notifications", 10);
    }
};

Template._loginButtonsAdditionalLoggedInDropdownActions.events({
    'click #login-buttons-edit-profile': function(event) {
        Router.go('mypage');
    }

});
