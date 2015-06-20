Video = new FS.Collection("videos", {
    stores: [
      new FS.Store.FileSystem("videos", {
        transformWrite: function(fileObj, readStream, writeStream){
          var newFileName = fileObj.name().replace(' ', '_');
          fileObj.name(newFileName);
          readStream.pipe(writeStream);
        }
      }),
    ]
});

Video.allow({
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
  Meteor.publish("videos", function () {
    return Video.find({});
  });
}

if (Meteor.isClient) {
  Meteor.subscribe("videos");
}
