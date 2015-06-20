Template.VideoPostsNew.events({
  "submit .new-post": function(event){
    var video = Video.insert(event.target.image.files[0], function(error, fileObj){
		var postObj = {
		  title: event.target.title.value,
		  desc: event.target.desc.value,
		  imageId: fileObj._id
		};

		Meteor.call("addPost", postObj, function(error, postId){
			Router.go("video.posts.show", {_id: postId});
		});
	});

    return false;
  }
});

