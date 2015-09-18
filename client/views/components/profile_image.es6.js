Template.profileImage.helpers({
  "firstLetterOfUsername": function(){
    return this.username[0];
  },
  "snsProfileImageUrl": function(){
    return this.snsImageUrl;
  },
  "uploadedProfileImage": function(){
    return this.uploadedProfileImage;
  },
  "textColor": function(){
    const username = this.username;
    return "#" + username.charCodeAt(0).toString(16) +
          username.charCodeAt(1).toString(16) +
          username.charCodeAt(2).toString(16);
  }
});
