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
  "isLoggedIn": function(){
    return Meteor.user() != null;
  }
})

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=1018333888196733&version=v2.0";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
