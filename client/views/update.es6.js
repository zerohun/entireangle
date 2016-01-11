const uploadEvents = {
  "change #upload-files input": function(event){
    window.e = event;
    $(event.target).parents("form").hide();
    const imageIds = [];
    for(var i=0; i < event.target.files.length; i++){
      var fsFile = createOwnedFile(event.target.files[i]);
      fsFile.isInProgress = true;
      const newImageId = Image.insert(fsFile, afterFileInsertCallback);
      imageIds.push(newImageId);
    }
    Meteor.call("addPosts", imageIds, function(error, postIds){
    });
  }
};

