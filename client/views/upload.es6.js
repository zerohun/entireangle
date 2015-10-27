function afterFileInsertCallback(error, fileObj){
  if(error)
    alert(error.message);
};

const templateUploadHelpers = {
  albums: function(){
    return Template.tagAutocomplete.albumsReact.get();
  }
};

const templateUploadEvents = {
  "click .show-tags-field":function(e){
    $(e.target).hide();
    $('.tags-field').removeClass("hide");
  },
  "click .show-address-field":function(e){
    $(e.target).hide();
    $('.address-field').removeClass("hide");
  },
  "submit #upload-files": function(event){
    event.preventDefault();
    return false;
  },
  "change #upload-files #file-upload": function(event){
    $(event.target).parents("form").hide();
    const imageIds = [];
    for(var i=0; i < event.target.files.length; i++){
      var fsFile = createOwnedFile(event.target.files[i]);
      const imageId = Models.Image.insert(fsFile, afterFileInsertCallback)._id;
      imageIds.push(imageId);
    }
    const address = AutoForm.getFormValues("address-form").insertDoc.address;
    const albums = Template.tagAutocomplete.albumsReact.get();
    Meteor.call("addPosts", imageIds, albums, address, function(error, postIds){
      Router.go(`/posts/${postIds[0]}?postIds=${postIds.join(',')}&isUploading=1`);
    });
  }
};

const templateUploadRendered = function(){
  FView.byId("loading-box").node.hide();
};

Template.upload.helpers(templateUploadHelpers);
Template.upload.events(templateUploadEvents);
Template.upload.rendered = templateUploadRendered; 

Template.uploadMobile.helpers(templateUploadHelpers);
Template.uploadMobile.events(templateUploadEvents);
Template.uploadMobile.rendered = templateUploadRendered; 



