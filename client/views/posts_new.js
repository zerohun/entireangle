Template.PostsNew.events({
  "submit .new-post": function(event){
    var fsFile = createOwnedFile(event.target.image.files[0]);
    var fileType = fsFile.original.type;
    var fileCollection;
    if(fileType.indexOf("image") == 0){
        fileCollection = Image;
    }
    else if(fileType.indexOf("video") == 0){
        fileCollection = Video;
    }
    else{
        return false;
    }
    fileCollection.insert(fsFile, function(error, fileObj){
		var postObj = {
		  title: event.target.title.value,
		  desc: event.target.desc.value,
		  imageId: fileObj._id,
		};

		Meteor.call("addPost", postObj, fileObj.isVideo(), function(error, postId){
			Router.go("posts.show", {_id: postId});
		});
    });

    return false;
  }
});

