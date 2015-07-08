if(Meteor.isServer){
    var Transcoder = Meteor.npmRequire('stream-transcoder');
}

Video = new FS.Collection("videos", {
    chunkSize: 10 * 1024 * 1024,
	filter:{
		allow: {
			contentTypes: ['video/*', 'image/*'] //allow only images in this FS.Collection
		}
	},
    stores: [
      new FS.Store.FileSystem("videos", {
        transformWrite: function(fileObj, readStream, writeStream){
          var newFileName = fileObj.name().replace(' ', '_');
          fileObj.name(newFileName);
          readStream.pipe(writeStream);
        }
      }),
      new FS.Store.FileSystem("video_thumbs", {
        beforeWrite: function (fileObj) {
          return {
            extension: 'jpg',
            type: 'image/jpg'
          };
        },
        transformWrite: function(fileObj, readStream, writeStream) {
          // Transform the image into a 10x10px thumbnail
          if(Meteor.isServer){
              var newFileName = fileObj.name().replace(' ', '_').replace(/\..+/, ".jpg");
              gm((new Transcoder(readStream)).
                captureFrame(10).
                stream(), newFileName). 
                crop('1000','1000').
                resize('300', '300').
                stream().
                pipe(writeStream);
            }
        }
      })
    ]
});



Video.allow({
    download: function(userId, fileObj) {
      return true;
    },
    insert: function(userId, fileObj){
      return FileSecure.isOwnedByCurrentUser(userId, fileObj);
    },
    update: function(userId, fileObj){
      return FileSecure.isOwnedByCurrentUser(userId, fileObj);
    },
    remove: function(userId, fileObj){
      return FileSecure.isOwnedByCurrentUser(userId, fileObj);
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
