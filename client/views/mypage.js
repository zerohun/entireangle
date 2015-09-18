Template.Mypage.helpers({
  "user": function(){
    return Meteor.user();
  }
  
});

Template.Mypage.events({
    "submit #user-form": function(event){
        var userObj = {
            username: event.target.username.value 
        };
        Meteor.call("updateUser", userObj, function(err){
            if(err){
                toastr.warning("Your user information has not changed. please try again later");        
            }
            else{
                toastr.success("Your user information is successfully changed");        
                Router.go("home");
            }
        }); 
        return false;
    },
    "click #mypage-cancel-button": function(){
        Router.go("home");
    },
    "click #logout": function(){
      Meteor.logout(function(err){
        if(err) alert(err.message);
        else {
          Router.go("home"); 
          registerLoginBtnCallback();
        }
      });
    } 

});

Template.Mypage.rendered = function(){
  FView.byId("loading-box").node.hide();
}