Accounts.ui.config({
    requestPermissions: {},
    extraSignupFields: [{
        fieldName: 'username',
        fieldLabel: 'username',
        inputType: 'text',
        visible: true,
        saveToProfile: true
    }, {
        fieldName: 'terms',
        fieldLabel: 'I accept the <a href="/private_policy">terms and conditions</a>',
        inputType: 'checkbox',
        visible: true,
        saveToProfile: false,
        validate: function(value, errorFunction) {
            if (value) {
                return true;
            } else {
                errorFunction('You must accept the terms and conditions.');
                return false;
            }
        }
    }]
});

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
    "isLoggedIn": function() {
        return Meteor.user() !== null;
    }
});

Template.layout.rendered = function(){
    $('body').css({overflow: "scroll"});
};

Template._loginButtonsAdditionalLoggedInDropdownActions.events({
    'click #login-buttons-edit-profile': function(event) {
        Router.go('mypage');
    }
});
