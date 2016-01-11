function afterFileInsertCallback(error, fileObj){
  if(error)
    alert(error.message);
}

Template.PostsNew.events({
  "change #upload-files input": function(event){
    window.e = event;
    $(event.target).parents("form").hide();
    for(var i=0; i < event.target.files.length; i++){
      var fsFile = createOwnedFile(event.target.files[i]);
      Image.insert(fsFile, afterFileInsertCallback);
    }
  },
  "submit .new-post": function(event) {
      var fsFile = createOwnedFile(event.target.image.files[0]);
      var fileType = fsFile.original.type;
      var fileCollection;
      if (fileType.indexOf("image") === 0) {
          fileCollection = Image;
      } else if (fileType.indexOf("video") === 0) {
          fileCollection = Video;
      } else {
          return false;
      }
      fileCollection.insert(fsFile, function(error, fileObj) {
          var postObj = {
              title: event.target.title.value,
              desc: event.target.desc.value,
              imageId: fileObj._id,
              isPublished: event.target.isPublished.value
          };

          Meteor.call("addPost", postObj, fileObj.isVideo(), function(error, postId) {
              Router.go("posts.show", {
                  _id: postId
              });
          });
      });

      return false;
    }
});

Template.PostsNew.helpers({
  imagesInProgress: function(){
    return Image.find({isInProgress: true}); 
  }
});


Template.PostsNew.rendered = function(){
  FView.byId("loading-box").node.hide();
};



Template.imageInProgress.helpers({
  filename: function(){
    return this.name(); 
  },
  isUploaded: function(){
    return this.isUploaded();
  },
  thumbnailUrl: function(){
    return this.url({store:'thumbs'});
  }
});
Template.imageInProgress.events({
  "click .delete-image-in-progress": function(event){
    var imageId = event.target.imageId.value;
    Meteor.call("deleteImageInProgress", imageId);
  } 
});
