Accounts.ui.config({
    requestPermissions: {},
    extraSignupFields: [{
        fieldName: 'username',
        fieldLabel: 'username',
        inputType: 'text',
        visible: true,
        saveToProfile: true
    }]
});

Meta.config({
  options: {
    title: "SCAPE-VR",
    suffix: "Suffix"
  }
});

Meta.set({
  name: 'name',
  property: 'viewport',
  content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
});

Template.layout.helpers({
  "isLoggedIn": function(){
    return Meteor.user() != null;
  }
})
