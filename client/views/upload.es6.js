function afterFileInsertCallback(error, fileObj){
  if(error)
    alert(error.message);
}

Template.uploadMobile.events({
  "change #upload-files #file-upload": function(event){
    window.e = event;
    $(event.target).parents("form").hide();
    const imageIds = [];
    for(var i=0; i < event.target.files.length; i++){
      var fsFile = createOwnedFile(event.target.files[i]);
      const imageId = Image.insert(fsFile, afterFileInsertCallback)._id;
      imageIds.push(imageId);
    }
    Meteor.call("addPosts", imageIds, $("#albumId").val(), $("#albumTitle").val(), function(error, postIds){
      Router.go(`/posts/${postIds[0]}?postIds=${postIds.join(',')}&isUploading=1`);
    });
  }
});


Template.uploadMobile.rendered = ()=>{
  FView.byId("loading-box").node.hide();
};
