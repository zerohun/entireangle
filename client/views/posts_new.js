Template.ImagesNew.events({
  "submit .new-post": function(event){
    console.log('submit');
    var title = event.target.title.value;
    var desc = event.target.desc.value;
    imageFile = event.target.image.files[0];
    var image = Image.insert(imageFile);
    Post.insert({
      title: title,
      desc: desc,
      image: image
    });
    
    Router.go('posts');
    return false;
  }
});

