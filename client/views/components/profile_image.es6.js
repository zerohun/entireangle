Template.profileImage.helpers({
  "firstLetterOfUsername": function(){
    if(this.username)
      return this.username[0];
    else
      return "";
  },
  "snsProfileImageUrl": function(){
    return this.snsImageUrl;
  },
  "uploadedProfileImageUrl": function(){
    if(!this.profileImageId) return null;
    const image = Models.ProfileImage.findOne(this.profileImageId);
    if(image)
      return image.url({store: 'profile_image_thumbnails'}); 
    else
      return null;
  },
  "textColor": function(){
    const username = this.username;
    if(username)
      return "#" + username.charCodeAt(0).toString(16) +
            username.charCodeAt(1).toString(16) +
            username.charCodeAt(2).toString(16);
    else
      return "";
  }
});
