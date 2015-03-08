Template.PostsNew.events({
  "submit .new-post": function(event){
    console.log('submit');
    var postObj = {
      title: event.target.title.value,
      desc: event.target.desc.value
    };
    imageFile = event.target.image.files[0];
    Meteor.call("addPost", postObj, imageFile);
    Router.go('posts');
    return false;
  }
});

