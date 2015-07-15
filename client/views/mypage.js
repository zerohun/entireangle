Template.Mypage.helpers({
    username: function(){
        return Meteor.user().username;
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
    }

});
