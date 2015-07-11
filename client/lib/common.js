window.createOwnedFile = function(targetFile) {
    var fsFile = new FS.File(targetFile);
    fsFile.ownerUserId = Meteor.userId();
    return fsFile;
};
