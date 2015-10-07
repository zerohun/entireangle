function afterFileInsertCallback(error, fileObj){
  if(error)
    alert(error.message);
}

const albumsReact = new ReactiveVar([]);
const typedTextReact = new ReactiveVar("");

Template.uploadMobile.helpers({
  albumIds: function(){
    return albumsReact.get().map((album) => album._id).join(',');
  },
  albums: function(){
    return albumsReact.get();
  },
  autoCompleteSetting: function(){
    return {
      position: "bottom",
      limit: 5,
      rules: [
        {
          collection: Album,
          field: "title",
          template: Template.autoTemplate,
          noMatchTemplate: Template.noMatch
        }
      ]
    };
  }
});

Template.uploadMobile.events({
  "submit #upload-files": function(event){
    event.preventDefault();
    return false;
  },
  "click .tags .chip .close": function(event){
    const albumId = $(event.target).data("id");
    const albumIds = albumsReact.get().map((album) => album._id); 
    const albums = albumsReact.get();
    albums.splice(albumIds.indexOf(albumId),1);
    albumsReact.set(albums);
  },
  "keyup #albumTitle": function(e){
    typedTextReact.set($(e.target).val());
    return true;
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

    const albums = albumsReact.get();
    Meteor.call("addPosts", imageIds, albums, function(error, postIds){
      Router.go(`/posts/${postIds[0]}?postIds=${postIds.join(',')}&isUploading=1`);
    });
  }
});

Template.uploadMobile.rendered = ()=>{
  FView.byId("loading-box").node.hide();
};

Template.noMatch.helpers({
  typedText: function(){
    return typedTextReact.get();
  },
  canCreateAlbum: function(){
    const albums = albumsReact.get();
    const typedText = typedTextReact.get();
    const albumTitles = albums.map((album)=>album.title);
    return albumTitles.indexOf(typedText) === -1
  }
});

Template.noMatch.events({
  "click #create-album": function(){
    const albums = albumsReact.get();
    albums.push({
      title: typedTextReact.get(),
      _id: "new-"+ typedTextReact.get()
    });
    albumsReact.set(albums);
    $("#albumTitle").val('');
  }
});
