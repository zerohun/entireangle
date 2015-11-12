let clickedPublishButton = false;
function turnEditingMode(onOfOff) {
  console.log('turnEdit');
  console.log(onOfOff? 'on':'off');
  if (onOfOff) {
        $(".view-box").hide();
        $(".edit-field").show();
    } else {
        $(".view-box").show();
        $(".edit-field").hide();
    }
}
function getAlbums(){
    const post = Router.current().data();
    if(!post || !post.albumIds || post.albumIds.length === 0) return [];
    return Album.find({_id: {
      $in: Router.current().data().albumIds
    }}).fetch();
}

AutoForm.hooks({
  editPost:{
    formToModifier: function(modifier){
      const albumIds = Template.tagAutocomplete.albumsReact.get().map((album) => album._id);
      if(!modifier.$set)modifier.$set = {}
      if(albumIds.length > 0)
        modifier.$set.albumIds = albumIds; 
      if(clickedPublishButton)
        modifier.$set.isPublished = true; 
      return modifier;
    },
    onSuccess:function(){
      console.log('suc');
      turnEditingMode(false);

      if(!Router.current().data()){
        Router.go("/mypage");
      }
    },
    onError:function(fromType, result){
      console.log(result);
    },
  }
});

const templatePostsContentHelpers = {
  "post": function(){
    return Router.current().data();
  },
  "isMyPost": function() {
    if(Router.current().ready()){
      try {
          return Router.current().data().user._id == Meteor.userId();
      } catch (e) {
          return false;
      }
    }
    else
      return false;
  },
  "embedUrl": function() {
      var hrefList = location.href.split('/');
      var address = 
        location.protocol + "//" + 
        hrefList[1] + hrefList[2] + 
        "/ep/" + Router.current().params._id;
      return "<iframe width='560' height='315' src='" + 
        address + 
        "' frameborder='0' allowfullscreen></iframe>";
    },
    "albums": getAlbums, 
    optsGoogleplace: function() {
      return {
        // type: 'googleUI',
        // stopTimeoutOnKeyup: false,
        // googleOptions: {
        //   componentRestrictions: { country:'us' }
        // }
      }
    }
};
const templatePostsContentEvents = Object.assign({
  "click #red-publish-button": function(e){
    clickedPublishButton = true;
  },
  "click .close-content-modal-button" : function(){
    turnEditingMode(false);
    FView.byId("post-content").node.slideUp();
    $(".hide-on-modal").show();
    return false;
  },
  "click #edit-button": function() {
      turnEditingMode(true);
      return false;
  },
  "click #edit-cancel-button": function() {
      turnEditingMode(false);
      return false;
  }
}, getModalCloseEventsObj('postContent', 'post-content'));

Template.postContent.helpers(templatePostsContentHelpers);
Template.postContent.events(templatePostsContentEvents);
Template.postContent.rendered = function(){
  let clickedPublishButton = false;
  setInterval(()=>{
    const modalLeft = $("#postContent .content").offset().left - ($(".top-modal-btn").width()/4);
    $(".top-modal-btn").css('left', modalLeft + 'px');
  },500);
  if(location.search.search("isUploading") > -1)
    turnEditingMode(true);
  else 
    turnEditingMode(false);

};
