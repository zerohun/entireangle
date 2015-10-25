templatePlacesHelpers = {
  'userId': function(){
    if(Router.current().data().username){
      return `&userId=${Router.current().data()._id}`;
    }
    else{
      return "";
    }
  }
};

Template.placesMobile.helpers(templatePlacesHelpers);
