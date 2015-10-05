Album = new Meteor.Collection('albums');
Meteor.methods({
    addAlbum: function(albumObj){
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        return Album.insert({
            title: albumObj.title,
            desc: albumObj.desc,
            isDefaultAlbum: albumObj.isDefaultAlbum,
            postIds: albumObj.postIds
        });
    },

    updateAlbum: function(album) {
        if (albumObj.user._id != Meteor.userId())
            throw new Meteor.Error("not-authorized");

        Album.update(album._id, {
            $set: {
                title: album.title,
                desc: album.desc
            }
        });
    },

    removeAlbum: function(albumId) {
        var album = Album.findOne({
            _id: albumId
        });

        if (album === null)
            throw new Meteor.Error("not-found");

        if (Meteor.userId() != album.user._id)
            throw new Meteor.Error("not-authorized");

        Album.remove({
            _id: album._id
        });
    }
});

if (Meteor.isServer) {
    Meteor.publish("albums", function(limit, query){
        return Album.find(Object.filterParams(query, [
                "_id",
                "user.id"
        ])); 
    });
}
