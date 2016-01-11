templatePlacesHelpers = {
  getCountryName: function(code){
    return getCountryName(code);
  },
  'userId': function(){

    if(Router.current().ready() &&
        Router.current().data && 
        Router.current().data().username){
      return `&userId=${Router.current().data()._id}`;
    }
    else{
      return "";
    }
  }
};

Template.placesMobile.helpers(templatePlacesHelpers);
Template.places.helpers(templatePlacesHelpers);
