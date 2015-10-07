Template.tagAutocomplete.albumsReact = new ReactiveVar([]);
const typedTextReact = new ReactiveVar("");

Template.tagAutocomplete.helpers({
  albums: function(){
    return Template.tagAutocomplete.albumsReact.get();
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

Template.tagAutocomplete.events({
  "click .tags .chip .close": function(event){
    const albumsReact = Template.tagAutocomplete.albumsReact;
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
    const albumsReact = Template.tagAutocomplete.albumsReact;
    const albumIds =   albumsReact.get().map((album) => album._id);
    if(albumIds.indexOf(doc._id) === -1){
      const albums = albumsReact.get();
      albums.push(doc);
      albumsReact.set(albums);
    }
    $(event.target).val('');
    return false;
  }
});
Template.tagAutocomplete.rendered = function(){
  Template.tagAutocomplete.albumsReact.set([]);
};


Template.noMatch.helpers({
  typedText: function(){
    return typedTextReact.get();
  },
  canCreateAlbum: function(){
    const albums = Template.tagAutocomplete.albumsReact.get();
    const typedText = typedTextReact.get();
    const albumTitles = albums.map((album)=>album.title);
    return albumTitles.indexOf(typedText) === -1
  }
});

Template.noMatch.events({
  "click #create-album": function(){
    const albums = Template.tagAutocomplete.albumsReact.get();
    albums.push({
      title: typedTextReact.get(),
      _id: "new-"+ typedTextReact.get()
    });
    Template.tagAutocomplete.albumsReact.set(albums);
    $("#albumTitle").val('');
  }
});
