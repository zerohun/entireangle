FileSecure = {
    isOwnedByCurrentUser: function(userId, fileObj) {
        return fileObj.hasOwnProperty("ownerUserId") && fileObj.ownerUserId === userId;
    }
};
