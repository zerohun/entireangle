Image = new FS.Collection("images", {
    stores: [
        new FS.Store.FileSystem("images", {
            transformWrite: function(fileObj, readStream, writeStream) {
                var newFileName = fileObj.name().replace(' ', '_');
                fileObj.name(newFileName);
                readStream.pipe(writeStream);
            }
        }),
        new FS.Store.FileSystem("thumbs", {
            transformWrite: function(fileObj, readStream, writeStream) {
                // Transform the image into a 10x10px thumbnail
                var newFileName = fileObj.name().replace(' ', '_');
                fileObj.name(newFileName);
                gm(readStream, fileObj.name()).
                crop('1000', '1000').
                resize('300', '300').
                stream().
                pipe(writeStream);
            }
        }),
        new FS.Store.FileSystem("snsThumbs", {
            transformWrite: function(fileObj, readStream, writeStream) {
                // Transform the image into a 10x10px thumbnail
                var newFileName = fileObj.name().replace(' ', '_');
                fileObj.name(newFileName);
                gm(readStream, fileObj.name()).
                crop('1200', '630').
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

if(Meteor.isServer){
  Meteor.methods({
    saveToImageStore: function(storeName, imageId, size, base64Data, options){
        var stream = Npm.require('stream');
        var readStream = new stream.PassThrough();
        var image = Image.findOne({_id:imageId});
        var jpegBinary = base64Data.replace(/^data:image\/\w+;base64,/, "");
        var writeStream = image.createWriteStream(storeName);
        var buf = new Buffer(jpegBinary, "base64");
        readStream.end(buf);
        if(options.centerCrop){
          var center = {x: size.width /2, y:size.height/2};
          var minLength = (size.width >  size.height)? size.height:size.width;
          gm(readStream).
            crop(minLength, minLength, center.x - minLength/2 , center.y - minLength/2).
            resize(300, 300).
            stream().
            pipe(writeStream);
        }
        else{
          gm(readStream).
            stream().
            pipe(writeStream);
        }
    }
  });
}

if (Meteor.isServer) {
    Meteor.publish("images", function() {
        return Image.find({});
    });
}

if (Meteor.isClient) {
    Meteor.subscribe("images");
}
