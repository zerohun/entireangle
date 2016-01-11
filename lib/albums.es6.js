Album = new Meteor.Collection('albums');
Meteor.methods({
    addAlbum: function(albumObj){
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        return Album.insert({
            title: albumObj.title,
            desc: albumObj.desc,
        });
    },

    updateAlbum: function(album) {
        if (album.user._id != Meteor.userId())
            throw new Meteor.Error("not-authorized");

        Album.update(album._id, {
            $set: {
                title: album.title,
                desc: album.desc,
                postIds: album.postIds
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
        return Album.find({}, {limit: limit});
    });
}
