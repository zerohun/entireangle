const postsCountByTagsReact = new ReactiveVar([]);
const isShowingTagsReact = new ReactiveVar(false);

const mypageHelpers = {
  "postsOptions": function(){
    this.hideUserThumbnail = true;
    return this;
  },
  "myUserInfo": function(){
    return Meteor.user();
  },
  "posts": function(){
    return Post.find(Session.get("myPagePostsQuery"));
  },
  "tags": function(){
    const tagCounts = postsCountByTagsReact.get();
    return Album.find({
      _id:{
        $in: tagCounts.map((t)=>t._id.albumId)
      }
    }).fetch().map((t, i) => {
      t.count = tagCounts.filter((tc) => tc._id.albumId === t._id)[0].count;
      return t;
    });
  },
  "postsCountByTagId": function(tagId){
    return postsCountByTagsReact.get().
            filter((c)=> c._id.albumId === tagId)[0].
            count;
  },
  "isShowingTags": function(){
    return isShowingTagsReact.get();
  }
};

const mypageEvents = {
    "click .reset-password-btn": function(event){
      FView.byId("reset-form").node.slideDown();
    },
    "change .mypage-image-field": function(event){
      const uploadingFile = event.target.files[0];
      const imageId = Models.ProfileImage.insert(createOwnedFile(uploadingFile), function(err, fileObj){
        console.log('imageId:');
        console.log(fileObj._id);
        Meteor.call("updateUser", {profileImageId:fileObj._id});
      });
    },
    "click .modal-close": function(event){
      $(".modal").closeModal();
    },
    "click #published": function(event){
      isShowingTagsReact.set(false);
      Session.set("myPagePostsQuery" , {isPublished: true});
    },
    "click #notPublished": function(event){
      isShowingTagsReact.set(false);
      Session.set("myPagePostsQuery" , {isPublished: false});
    },
    "click #postsCountByTags": function(event){
      isShowingTagsReact.set(true);
    },
    "submit #user-form": function(event){ 
        var userObj = {
            username: event.target.username.value, 
            desc: event.target.desc.value 
        };
        Meteor.call("updateUser", userObj, function(err){
            if(err){
                toastr.warning("Your user information has not changed. please try again later");        
            }
            else{
                toastr.success("Your user information is successfully changed");        
                $(".modal").closeModal();
                $(".lean-overlay").remove();
            }
        }); 
        return false;
    },
    "click #mypage-cancel-button": function(){
        Router.go("home");
    },
    "click #logout": function(){
      Meteor.logout(function(err){
        if(err) alert(err.message);
        else {
          Router.go("home"); 
          registerLoginBtnCallback();
        }
      });
    } 
};

//Template.Mypage.helpers(mypageHelpers);
//Template.Mypage.events(mypageEvents);
//Template.Mypage.rendered = function(){
  //FView.byId("loading-box").node.hide();
//};

Template.mypageMobile.helpers(mypageHelpers);
Template.mypageMobile.events(mypageEvents);

Template.mypageMobile.rendered = function(){
  FView.byId("loading-box").node.hide();
  Meteor.call("getMyPostsCountByTags", function(err, postsCount){
    postsCountByTagsReact.set(postsCount);
  });

  $('.modal-trigger').leanModal({
    dismissible: true,
    ready: function(){
      $(".lean-overlay").prependTo("#wrapping-container");
      $(".lean-overlay").click(function(){
        $(".modal").closeModal();
        $(".lean-overlay").remove();
      });
      $(".hide-on-modal").hide();
    },
    complete: function(){
      $(".hide-on-modal").show();
    }
  });
};
