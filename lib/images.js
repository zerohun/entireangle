Image = new FS.Collection("images", {
    stores: [
      new FS.Store.FileSystem("images"),
      new FS.Store.FileSystem("thumbs", {
        transformWrite: function(fileObj, readStream, writeStream) {
          // Transform the image into a 10x10px thumbnail
          gm(readStream, fileObj.name()).
            crop('500','500').
            resize('300', '300').
            stream().
            pipe(writeStream);
        }
      })
    ],
    filter: {
      allow: {
        contentTypes: ['image/*'] //allow only images in this FS.Collection
      }
    }
});

Image.allow({
    download: function(userId, fileObj) {
      return true;
    },
    insert: function(userId, fileObj){
      return userId != null;
    },
    update: function(userId, fileObj){
      return false;
    },
    remove: function(userId, fileObj){
      return false;
    }
});

if (Meteor.isServer) {
  Meteor.publish("images", function () {
    return Image.find({});
  });
}

if (Meteor.isClient) {
  Meteor.subscribe("images");
}
