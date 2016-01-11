Models.ProfileImage = new FS.Collection("profile_images", {
    stores: [
      new FS.Store.GridFS("profile_images", {
          transformWrite: function(fileObj, readStream, writeStream) {
              var newFileName = fileObj.name().replace(' ', '_');
              fileObj.name(newFileName);
              readStream.pipe(writeStream);
          }
      }),
      new FS.Store.GridFS("profile_image_thumbnails", {
            transformWrite: function(fileObj, readStream, writeStream) {
                // Transform the image into a 10x10px thumbnail
                var newFileName = fileObj.name().replace(' ', '_');
                fileObj.name(newFileName);
                gm(readStream, fileObj.name()).
                resize('300', '300').
                stream().
                pipe(writeStream);
            }
      })
    ]
});
Models.ProfileImage.allow({
    download: function(userId, fileObj) {
        return true;
    },
    insert: function(userId, fileObj) {
        return FileSecure.isOwnedByCurrentUser(userId, fileObj);
    },
    update: function(userId, fileObj) {
        return FileSecure.isOwnedByCurrentUser(userId, fileObj);
    },
    remove: function(userId, fileObj) {
        return FileSecure.isOwnedByCurrentUser(userId, fileObj);
    }
});

if (Meteor.isServer) {
    Meteor.publish("profile_images", function() {
        return Models.ProfileImage.find({});
    });
}

if (Meteor.isClient) {
    Meteor.subscribe("profile_images");
}
