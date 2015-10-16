Template.profileImage.helpers({
  "firstLetterOfUsername": function(){
    return this.username[0];
  },
  "snsProfileImageUrl": function(){
    return this.snsImageUrl;
  },
  "uploadedProfileImageUrl": function(){
    if(this.user) return null;
    const image = Image.findOne(this.user.imageId);
    if(image)
      return image.url({store: 'thumbs'}); 
    else
      return null;
  },
  "textColor": function(){
    const username = this.username;
    return "#" + username.charCodeAt(0).toString(16) +
          username.charCodeAt(1).toString(16) +
          username.charCodeAt(2).toString(16);
  }
});
