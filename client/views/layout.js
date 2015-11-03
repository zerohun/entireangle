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

const templateLayoutRendered = function(){

    $('body').css({overflow: "scroll"});

    if(!Meteor.user())
      registerLoginBtnCallback();
    //$("img.lazy").unveil();

    if(Meteor.user()){
      Meteor.subscribe("notifications", 10);
    }
};

Template.layout.rendered = templateLayoutRendered;

Template._loginButtonsAdditionalLoggedInDropdownActions.events({
    'click #login-buttons-edit-profile': function(event) {
        Router.go('mypage');
    }

});

