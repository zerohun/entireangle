Post = new Meteor.Collection('posts');

Meteor.methods({
  addPost: function(postObj, imageFile){
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    
    var image = Image.insert(imageFile);
    Post.insert({
      title: postObj.title,
      desc: postObj.desc,
      image: image
    });
  }
})
