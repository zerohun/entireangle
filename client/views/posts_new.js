Template.PostsNew.events({
  "submit .new-post": function(event){
    var image = Image.insert(event.target.image.files[0]);
    var postObj = {
      title: event.target.title.value,
      desc: event.target.desc.value,
      imageId: image._id
    };
    Meteor.call("addPost", postObj);
    Router.go('posts');
    return false;
  }
});

