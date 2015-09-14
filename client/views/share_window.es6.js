Template.sharePreview.events({});
Template.sharePreview.helpers({
  "embedUrl": function() {
      var hrefList = location.href.split('/');
      var address = location.protocol + "//" + hrefList[1] + hrefList[2] + "/ep/" + Router.current().params._id;
      return "<iframe width='560' height='315' src='" + address + "' frameborder='0' allowfullscreen></iframe>";
  }
});

Template.sharePreview.rendered = ()=>{
};