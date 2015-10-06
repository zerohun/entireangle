function afterFileInsertCallback(error, fileObj){
  if(error)
    alert(error.message);
}

const albumsReact = new ReactiveVar([]);

Template.uploadMobile.helpers({
  albumIds: function(){
    return albumsReact.get().map((album) => album._id).join(',');
  },
  albumTitles: function(){
    return albumsReact.get().map((album) => album.title);
  },
  autoCompleteSetting: function(){
    return {
      position: "top",
      limit: 5,
      rules: [
        {
          collection: Album,
          field: "title",
          template: Template.autoTemplate
        }
      ]
    };
  }
});

Template.uploadMobile.events({
  "submit @upload-files": function(){
    return false;
  },
  "autocompleteselect #albumTitle": function(event, template, doc){
    const albumIds =  albumsReact.get().map((album) => album._id);
    if(albumIds.indexOf(doc._id) === -1){
      const albums = albumsReact.get();
      albums.push(doc);
      albumsReact.set(albums);
    }
    $(event.target).val('');
    return false;
  },
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
