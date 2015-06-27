Template.VideoPostsNew.events({
  "submit .new-post": function(event){
    var fsFile = createOwnedFile(event.target.image.files[0]);
    var video = Video.insert(fsFile, function(error, fileObj){
		var postObj = {
		  title: event.target.title.value,
		  desc: event.target.desc.value,
		  imageId: fileObj._id,
		  isVideo: true
		};

		Meteor.call("addPost", postObj, function(error, postId){
			Router.go("video.posts.show", {_id: postId});
		});
	});
    return false;

  }
});

