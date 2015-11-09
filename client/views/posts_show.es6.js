var container;
var vrDeviceInfo;
var vrButton;
var isInVRModeReact = new ReactiveVar(false);
var isInDOModeReact = new ReactiveVar(false);
var post = null;
var originalPosition = new THREE.Vector3();
let leavingPageSrc; 
let resizeInterval;
let isPreviewRendered;
let previewOrb, photoOrb;
const imageDep = new Tracker.Dependency;

var SwipingDirection = {};
SwipingDirection.LEFT = Symbol("LEFT");
SwipingDirection.RIGHT = Symbol("RIGHT");
SwipingDirection.UP = Symbol("UP");
SwipingDirection.DOWN = Symbol("DOWN");
SwipingDirection.NONE = Symbol("NONE");

let clickedPublishButton = false;
function closeModals(){
    $(".modal").closeModal();
    $(".lean-overlay").remove();
    $(".hide-on-modal").show();
    $(".arrow_box").removeClass("hide");

    photoOrb.setState("running");
}

function setArrowBoxPosition(){
  const $editButton = $(".content-edit-button");
  if($editButton.length > 0){
    const editButtonPosition = $editButton.position();
    const editBtnWidth = $editButton.width(); 
    const editBtnHeight = $editButton.height(); 
    const $arrowBox = $(".arrow_box");
    if(isMobile.phone){
      $arrowBox.css({
        bottom: `${$editButton.height() + 10}px`,
        left: `${editButtonPosition.left - $arrowBox.width()/2 + editBtnWidth/2}px`
      });
    }
    else{
      $arrowBox.css({
        top: `${$editButton.height() + $('#logo').height() - $(".arrow_box").height() - 20}px`,
        left: `${editButtonPosition.left - $arrowBox.width()/2 + editBtnWidth/2}px`
      });
    }

  }
}

function getAlbums(){
    const post = Router.current().data();
    if(!post || !post.albumIds || post.albumIds.length === 0) return [];
    return Album.find({_id: {
      $in: Router.current().data().albumIds
    }}).fetch();
}


function enableHorizontalSwipe(){
  var prevTouchCoords;
  var touchCoords = THREE.Vector2();
  var raycaster = new THREE.Raycaster();
  //var slideUpWindow = FView.byId("slide-up-menu").node;


  //var slideUpPosition = slideUpWindow.upPosition();
  //const resizeSub = Rx.Observable.fromEvent(window, 'resize').
    //subscribe(() =>{
      //slideUpPosition = slideUpWindow.upPosition();
    //});

  const windowHeight = $(window).height();

  let verticalSwipeObs, horizontalSwipeObs, verticalUpSwipeObs, verticalDownSwipeObs;
  let verticalObserverFunc, verticalUpCompleteFunc, verticalDownCompleteFunc, 
      horizontalObserverFunc, horizontalCompleteFunc;
  let verticalSubs, horizontalSubs;

  const finishSwipeDown = (slideWindow, nextObs, nextObserver, nextComplete) =>{
      slideWindow.slideDown();
      //slideWindow.setMountPoint(0.5, 0.5);
      $("#slide-up-handle").text("Swipe up");
      return nextObs.subscribe(nextObserver, $.noop, nextComplete);
  };

  //const finishSwipeUp = (slideWindow, nextObs, nextObserver, nextComplete) =>{
      //slideWindow.slideUp();
      ////slideWindow.setMountPoint(0.5, 0.5);
      //$("#slide-up-handle").text("Swipe down");
      //return nextObs.subscribe(nextObserver, $.noop, nextComplete);
  //};

  //const slideUpMenu = document.getElementById("slide-up-menu");
  //const slideUpMenuHandle = document.getElementById("slide-up-handle");
  const body = document.getElementsByTagName("body")[0];

  horizontalSwipeObs = Rx.Observable.fromEvent(container, "touchstart").
    flatMap(startEvent =>{
      console.log('1');
        return Rx.Observable.fromEvent(container, "touchmove").
          map(moveEvent =>{
      console.log('2');
            return [startEvent,moveEvent];
          });
    }).
    takeUntil(Rx.Observable.fromEvent(container, "touchend")).
    filter(eventPair =>{
      const swipeDirection = getSwipingDirection(eventPair);

      console.log('3');
      return (swipeDirection === SwipingDirection.LEFT ||
              swipeDirection === SwipingDirection.RIGHT);
    });

  //verticalSwipeObs = Rx.Observable.fromEvent(slideUpMenuHandle, "touchstart").
    //flatMap(startEvent =>{
        //return Rx.Observable.fromEvent(body, "touchmove").
          //map(moveEvent =>{
            //return [startEvent,moveEvent];
          //});
    //}).
    //takeUntil(Rx.Observable.fromEvent(body, "touchend")).
    //filter(eventPair =>{
      //const swipeDirection = getSwipingDirection(eventPair);
      //return (swipeDirection === SwipingDirection.UP || 
              //swipeDirection === SwipingDirection.DOWN);
    //}).takeUntil(horizontalSwipeObs);

  //verticalUpSwipeObs = verticalSwipeObs.filter(eventPair =>{
    //return getSwipingDirection(eventPair) === SwipingDirection.UP;
  //});
  //verticalDownSwipeObs = verticalSwipeObs.filter(eventPair =>{
    //return getSwipingDirection(eventPair) === SwipingDirection.DOWN;
  //});

  //verticalObserverFunc = eventPair=>{
    //slideUpPosition[1] = eventPair[1].touches[0].clientY;
    ////slideUpWindow.setMountPoint(0.5, 0.0);
    //slideUpWindow.setPosition(slideUpPosition[0], slideUpPosition[1], slideUpPosition[2]);
  //};

  //verticalUpCompleteFunc = ()=>{
    //verticalSubs.dispose();
    //if(slideUpWindow.getPosition()[1] < slideUpWindow.downPosition()[1])
      //verticalSubs = finishSwipeUp(slideUpWindow, verticalDownSwipeObs, verticalObserverFunc, verticalDownCompleteFunc);
    //else
      //verticalSubs = finishSwipeDown(slideUpWindow, verticalUpSwipeObs, verticalObserverFunc, verticalUpCompleteFunc);
  //};
  //verticalDownCompleteFunc = ()=>{
    //verticalSubs.dispose();
    //if(slideUpWindow.getPosition()[1] > slideUpWindow.upPosition()[1])
      //verticalSubs = finishSwipeDown(slideUpWindow, verticalUpSwipeObs, verticalObserverFunc, verticalUpCompleteFunc);
    //else
      //verticalSubs = finishSwipeUp(slideUpWindow, verticalDownSwipeObs, verticalObserverFunc, verticalDownCompleteFunc);
  //};

  horizontalObserverFunc = eventPair =>{
      try{
        console.log('hori');
        var touchCoords = new THREE.Vector2();
        touchCoords.x =  (eventPair[1].touches[0].clientX / $(container).width()) * 2 - 1;
        touchCoords.y = -(eventPair[1].touches[0].clientY / $(container).height()) * 2 + 1;
        if(prevTouchCoords){

            raycaster.setFromCamera( touchCoords, orb.getCamera() );
            var intersects = raycaster.intersectObject( orb.mesh );
            var point = intersects[0].point;
            var horizontalPoint = new THREE.Vector3(point.x, 0, point.z);

            raycaster.setFromCamera( prevTouchCoords, orb.getCamera() );
            intersects = raycaster.intersectObject( orb.mesh );
            var prevPoint = intersects[0].point;
            var prevHorizontalPoint = new THREE.Vector3(prevPoint.x, 0, prevPoint.z);

            var angle =  -Math.acos( horizontalPoint.dot(prevHorizontalPoint) / horizontalPoint.length() / prevHorizontalPoint.length() ); 
            var axis = horizontalPoint.cross(prevHorizontalPoint).normalize();
            if(angle !== 0 && (axis.x !== 0 || axis.y !== 0 || axis.z !== 0 )){
                var rotQuat = new THREE.Quaternion();
                rotQuat.setFromAxisAngle(axis, angle);
                //console.log(axis, angle);
                orb.mesh.quaternion.multiply(rotQuat);
            }
        }
        prevTouchCoords = touchCoords;
      } catch(ex){
          //alert(ex.message);
      }
  };

  horizontalCompleteFunc = () =>{
    prevTouchCoords = null;
    horizontalSubs = horizontalSwipeObs.subscribe(horizontalObserverFunc, $.noop, horizontalCompleteFunc);
  };

  //verticalSubs = verticalUpSwipeObs.subscribe(verticalObserverFunc, $.noop, verticalUpCompleteFunc);
  horizontalSubs = horizontalSwipeObs.subscribe(horizontalObserverFunc, $.noop, horizontalCompleteFunc);
  const leavingPageSub = leavingPageSrc.subscribe((e)=>{
    //verticalSubs.dispose();
    horizontalSubs.dispose();

    $("#slide-up-handle").text("Swipe up");
    leavingPageSub.dispose();
  });
  const popStateSub = Rx.Observable.fromEvent(window, "popstate").
                        subscribe(()=>{
                          popStateSub.dispose();
                          FView.byId("loading-box").node.show();
                        });

}


function onClickSavePreviewButton(){
  FView.byId("loading-box").node.show();
  const $canvas = $("#container");
  const canvasOriginalSize = {
    width: $canvas.width(),
    height: $canvas.height()
  };
  $canvas.width(1200);
  $canvas.height(630);
  const position = {
    x: photoOrb.controls.object.position.x,
    y: photoOrb.controls.object.position.y,
    z: photoOrb.controls.object.position.z
  };
  let url = Router.current().data().url;
  if(url.search(/\?x=/)){
    url = url.replace(/\?x=.+/, "");
  }
  url = url + "?" + $.param(position);

  photoOrb.onWindowResize();
  photoOrb.reRender();
  photoOrb.afterRender(()=>{
    setTimeout(function() {
      saveCanvasSnapshotToImageStore("#container canvas", "snsThumbs", 
      {centerCrop: false},
      ()=> {
        FView.byId("loading-box").node.hide();
        $canvas.width(canvasOriginalSize.width);
        $canvas.height(canvasOriginalSize.height);
      });
    }, 500);
  });
}

function saveCanvasSnapshotToImageStore(cssSelector, storeName, options, callbackFunc){
  var dataUrl = $(cssSelector)[0].toDataURL("image/jpeg");
  var imageId = Router.current().data().imageId;
  var size = {};
  size.width = $(cssSelector).width();
  size.height = $(cssSelector).height();
  console.log(size);
  Meteor.call("saveToImageStore", storeName, imageId, size, dataUrl, options, function(err){
    if(err)
      console.error(err);
    callbackFunc();
  });
}

function renderPhotoSphere(cssSelector, imageFilePath) {
    var orb;
    var SLIDE_UP_HANDLE_SIZE = famous.customLayouts.SlideUpWindow.constants.SLIDE_UP_HANDLE_SIZE;

    vrDeviceInfo = getVRDeviceInfo();
    
    container = $(cssSelector)[0];

    console.log("loading material");
    var material = new THREE.MeshBasicMaterial({
        map: THREE.loader.load(imageFilePath, function() {
          FView.byId("loading-box").node.hide();
        }, $.noop,function(error) {
            console.log('error while loading texture - ');
            console.log(error);
        })
    });

    if (vrDeviceInfo.type === "HMD") {
        orb = OrbBuilders.createOrb(OrbBuilders.HMDControlOrbBuilder, material, container);
    //} else if (vrDeviceInfo.type === "MOBILE") {
        //orb = OrbBuilders.createOrb(OrbBuilders.MobileControlOrbBuilder, material, container);
    } else {
        orb = OrbBuilders.createOrb(OrbBuilders.NormalControlOrbBuilder, material, container);
        $("#info").show();
        const params = Router.current().params.query;
        const post = Router.current().data();
        if(post){
          if(params.x && params.y && params.z){
            orb.controls.object.position.x = Number.parseFloat(params.x);
            orb.controls.object.position.y = Number.parseFloat(params.y);
            orb.controls.object.position.z = Number.parseFloat(params.z);
          }
          else if ( post && post.viewPosition && vrDeviceInfo.type !== "HMD" && vrDeviceInfo.type !== "MOBILE"){
              orb.controls.object.position.x = post.viewPosition.x;
              orb.controls.object.position.y = post.viewPosition.y;
              orb.controls.object.position.z = post.viewPosition.z;
          }
          else{
              orb.controls.object.position.x = -500;
              orb.controls.object.position.y = 500;
              orb.controls.object.position.z = -50;
          }
          
          if (Meteor.userId() && Meteor.userId() == post.user._id)
              observeViewPosition(orb, ()=>{
                $("#position-save-button").show();
              });
        }

    }
    console.log('orb render');
    orb.render();
    
    if (vrDeviceInfo.type === "MOBILE"){

        $(window).scrollTop(0);

    }
    return orb;
}

function getSwipingDirection(eventPair){
  const dx = eventPair[1].touches[0].clientX - eventPair[0].touches[0].clientX;
  const dy = eventPair[1].touches[0].clientY - eventPair[0].touches[0].clientY;
  let result;

  //console.log(`dx=(${eventPair[0].touches[0].clientX} ~ ${eventPair[1].touches[0].clientX}) dy(${eventPair[0].touches[0].clientY} ~${eventPair[1].touches[0].clientY})`);
  if(Math.abs(dx) > Math.abs(dy)){
    result = (dx>0)? SwipingDirection.RIGHT:SwipingDirection.LEFT;
  }
  else if(Math.abs(dx) < Math.abs(dy)){
    result = (dy>0)? SwipingDirection.DOWN:SwipingDirection.UP;
  }
  else{
    result = SwipingDirection.NONE;
  }
  //console.log(result);
  return result;
}

function observeViewPosition(orb, callbackFunc) {
    originalPosition.copy(orb.controls.object.position);

    var positionCheckSrc = Rx.Observable.
    interval(100).
    takeUntil(leavingPageSrc);
    
    var positionCheckSub = positionCheckSrc.subscribe(function() {
        var currentPosition = orb.controls.object.position;
        if (originalPosition.x != currentPosition.x ||
            originalPosition.y != currentPosition.y ||
            originalPosition.z != currentPosition.z) {
        
            callbackFunc();
            positionCheckSub.dispose();
        }
    });
}


function getCurrentPost() {
    try {
        post = Router.current().data();
        return post;
    } catch (e) {
        return null;
    }
}

function getDefaultControls(camera, element) {
    var controls;

    if (isMobile.phone) {
        controls = new THREE.DeviceOrientationControls(camera, true);
        controls.connect();
        controls.update();
    } else {
        controls = new THREE.OrbitControls(camera, element);
        controls.rotateUp(Math.PI / 4);
        controls.target.set(
            0.1, 0, 0
        );
        controls.noZoom = false;
        controls.noPan = true;
    }
    return controls;
}

function disableVRMode(orb) {
    if (vrDeviceInfo.type === "MOBILE")
        OrbBuilders.setOrb(OrbBuilders.MobileControlOrbBuilder, orb);

    orb.setFullScreen(false);
    isInVRModeReact.set(false);
}

function enableVRMode(orb) {
    if (vrDeviceInfo.type === "MOBILE")
        OrbBuilders.setOrb(OrbBuilders.CardboardControlOrbBuilder, orb);

    orb.setFullScreen(true);
    isInDOModeReact.set(false);
    isInVRModeReact.set(true);
}

function enableDOMode(orb) {
  console.log('enable DO');
  OrbBuilders.setOrb(OrbBuilders.MobileControlOrbBuilder, orb);
  isInVRModeReact.set(false);
  isInDOModeReact.set(true);
  //enableHorizontalSwipe();
}
function disableDOMode(orb) {
  console.log('disable DO');
  OrbBuilders.setOrb(OrbBuilders.NormalControlOrbBuilder, orb);
  isInDOModeReact.set(false);
}

function toggleVRMode(orb) {
    if (vrDeviceInfo.type != "NONE") {
        if (isInVRModeReact.get()) {
            disableVRMode(orb);
        } else {
            enableVRMode(orb);
        }
    } //else
        //$('#NoneVRModal').modal('show');
}
function toggleDOMode(orb) {
    if (vrDeviceInfo.type != "NONE") {
        if (isInDOModeReact.get()) {
          disableDOMode(orb);
        } else {
          enableDOMode(orb);
        }
    } //else
        //$('#NoneVRModal').modal('show');
}

function getPostsInfo(){
  let postIds;
  
  if(location.search.search("isUploading"))
    postIds = Session.get("uploadingPostIds"); 
  else
    postIds = Session.get("postIds"); 
  
  if(!postIds) return null;
  const postId = Router.current().data()._id;
  const index = postIds.indexOf(postId);

  if(postIds.length <= 1 || !postId || index === -1)
    return null;
  
  return {
    postIds: postIds,
    postId: postId,
    index: index
  }
}

function getUrlOfPostIndex(postId, postIds){
  let urlString =  `/posts/${postId}`;
  if(location.search.search("isUploading=1") > -1)
      urlString = urlString.concat("?isUploading=1");
  return urlString;
}


function savePosition(){
  FView.byId("loading-box").node.show();
  post = getCurrentPost();
  Meteor.call("updatePostViewPosition", post, photoOrb.controls.object.position);
  
  saveCanvasSnapshotToImageStore($("#container canvas"), "thumbs", 
  {centerCrop: true},
  ()=> {
    FView.byId("loading-box").node.hide();
  });
  //$("#position-save-button").hide();
  observeViewPosition(photoOrb, ()=>{
    $("#position-save-button").show();
  });
}



const postsShowHelpers = {
    "numberOfComments": function(){
      return Comment.find({postId: Router.current().data()._id}).count();
    },
    thumbUrl: function(imageId, isVideo) {
      let image
      if (isVideo) {
        image = Video.findOne({
                    _id: imageId
                  }).url({
                      store: 'video_thumbs'
                  });
      } else {
          image = Models.Image.findOne({
              _id: imageId
          });

      }
      if(image.isUploaded())
        return image.url({store: 'thumbs'}); 
      else
        return "/images/loading.gif";
    },
    "modeVRSelectedClass": function(){
      if(isInVRModeReact.get()){
        return 'selected-mode';
      }
      return '';
    },
    "modeDOSelectedClass": function(){
      if(isInDOModeReact.get()){
        return 'selected-mode';
      }
      return '';
    },
    "isUploadingListVisible": function(){
      return (location.search.search("isUploading=1") > -1);
    },
    "isArrowVisible": function(){
      return (location.search.search("isUploading=1") > -1) && !(Router.current().data().isPublished);
    },
    "post": function(){
      return Router.current().data();
    },
    "moreButtonVisible": function(){
      return (location.search.search("isUploading=1") > -1) && Post.find().count() > 5;
    },
    "forcusedPosts": function(){
      const postIds = Session.get("uploadingPostIds"); 
      if(!postIds) return null;
      const posts = Post.find({
        _id: {
          $in: postIds
        }
      }, {
        $sort:{
          createdAt: -1
         }
      }).fetch().sort((a,b) => postIds.indexOf(a._id) > postIds.indexOf(b._id));;
      const currentPostId = Router.current().data()._id;
      const post = posts.filter((p)=> currentPostId === p._id)[0];
      const currentIndex = posts.indexOf(post); 
      let lastIndex = Math.min(posts.length, currentIndex + 4);
      let startIndex = lastIndex - 6;
      if(startIndex < 0){
        startIndex = 0;
        lastIndex = 5;
      }
      return posts.slice(startIndex, lastIndex);
    },
    "posts": function(){
      const postIds = Session.get("postIds"); 
      if(!postIds) return null;
      return Post.find({
        _id: {
          $in: postIds
        }
      }).fetch().sort((a,b) => postIds.indexOf(a._id) > postIds.indexOf(b._id));
    },
    "nextPostUrl": function(){
      const res = getPostsInfo();
      if(!res) return null;
      if(res.postIds[res.index + 1]){
        return getUrlOfPostIndex(res.postIds[res.index+1], res.postIds);
      }
      else{
        return null;
      }
    },
    "prevPostUrl": function(){
      const res = getPostsInfo();
      if(!res) return null;
      if(res.index > 0){
        return getUrlOfPostIndex(res.postIds[res.index-1], res.postIds);
      }
      else{
        return null;
      }
    },
    "isInVRMode": function(){
      return isInVRModeReact.get();
    },
    "isInDOMode": function(){
      return isInDOModeReact.get();
    },
    "isMyPost": function() {
        try {
            return getCurrentPost().user._id == Meteor.userId();
        } catch (e) {
            return false;
        }
    },
    "isEmbedded": function() {
        return Router.current().params.query.hasOwnProperty("embedded");
    },
    "embedUrl": function() {
        var hrefList = location.href.split('/');
        var address = location.protocol + "//" + hrefList[1] + hrefList[2] + "/ep/" + Router.current().params._id;
        return "<iframe width='560' height='315' src='" + address + "' frameborder='0' allowfullscreen></iframe>";
    },
    "didILikeIt": function(){
      if(Router.current().ready())
        return Like.findOne({
          userId: Meteor.userId(),
          postId: Router.current().data()._id
        });
      else
        return false;
    }

};

Template.PostsShow.helpers(postsShowHelpers);
Template.PostsShowMobile.helpers(postsShowHelpers);

const postsShowEvents = {
  "click .content-edit-button": function(){
    $(".hide-on-modal").hide();
    FView.byId("post-content").node.slideDown();
  },
  "click .share-button": function(e){
    onClickSavePreviewButton();
    e.preventDefault();
    return false;
  },
  "click .zoom-in-btn": function(e){
    photoOrb.controls.dollyOut();
    e.preventDefault();
    return false;
  },
  "click .zoom-out-btn": function(e){
    photoOrb.controls.dollyIn();
    e.preventDefault();
    return false;
  },
  "click #red-publish-button": function(e){
    clickedPublishButton = true;
  },
  "click #publish-post-button": function(e){
    const post = Router.current().data();
    post.isPublished = true;
    Meteor.call("updatePost", post);
    savePosition();
    Materialize.toast('Successfully published', 1000, '', function(){
      const res = getPostsInfo();
      if(!res) return null;
      if(res.postIds[res.index + 1]){
        Router.go(getUrlOfPostIndex(res.postIds[res.index+1], res.postIds));
      }
      else{
        Router.go("/posts");
      }
    })
  },
  "click .close-modal-button": function(e){
    closeModals();
  },
  "click .like-button": function(){
    if(Meteor.user())
      Meteor.call("like",  Router.current().data()._id);
    else
      FView.byId("login-form").node.slideDown();
  },
  "click .unlike-button": function(){
    Meteor.call("unlike", Router.current().data()._id);
  },
  "click .shareModalOpenBtn": function(){
    //$("#shareModal").modal();
  },
  "click #share-modal-close-btn":  function(){
    //$("#shareModal").modal('hide');
    previewOrb.setState("stop");
    photoOrb.setState("running");
  },
  "click #do-mode-button": function(){
    toggleDOMode(photoOrb);
    closeModals();
  },
  "click #vr-mode-button": function() {
    toggleVRMode(photoOrb);
    $(".modal").closeModal();
    $(".lean-overlay").remove();
  },
  "click #home-button": function() {
      Router.go("home");
  },
  "click #container": function() {
      if (isInVRModeReact.get()) toggleVRMode(photoOrb);
  },
  "click #remove-button": function() {
      var post = getCurrentPost();
      Router.go('Posts');
      Meteor.call("removePost", post._id);
      return false;
  },

  "submit #edit-post": function(event) {
      //post = getCurrentPost();
      //post.title = event.target.title.value;
      //post.desc = event.target.desc.value;
      //post.isPublished = event.target.isPublished.checked;
      //Meteor.call("updatePost", post, ()=>{
        //Meteor.subscribe('posts', 1, {_id: post._id});
      //});
      //turnEditingMode(false);
      //return false;
  },
  "click a[target!='_blank']:not(.share-buttons a):not(.inpage-buttons)": function(){
      FView.byId("loading-box").node.show();
  },
  "click #position-save-button": savePosition, 
  "click #save-preview-button": onClickSavePreviewButton
};
Template.PostsShow.events(postsShowEvents);
Template.PostsShowMobile.events(postsShowEvents);

Template.PostsShow.toggleVRMode = ()=>{
    toggleVRMode();
};

templatePostsShowRendered = function() {

  $("body").css('padding-top','0px');
  leavingPageSrc = Rx.Observable.merge(
                        Rx.Observable.fromEvent(window, "popstate"),
                        Rx.Observable.fromEvent($("a[target!='_blank']:not(.share-buttons a):not(.inpage-buttons)"), "click"),
                        Rx.Observable.fromEvent($("button.page-change"), "click"));
  const leavingPageSub = leavingPageSrc.subscribe(()=>{
    FView.byId("loading-box").node.show();
    leavingPageSub.dispose();
  });

  clickedPublishButton = false
  setArrowBoxPosition();
  $(".arrow_box").removeClass('hide');
  $('.dropdown-button').dropdown();

  const albums = getAlbums();
  Template.tagAutocomplete.albumsReact.set(albums);

  $('.modal-trigger').leanModal({
    opacity: .5,
    dismissible: true,
    ready: function(){
      $(".lean-overlay").prependTo("#wrapping-container");
      $(".lean-overlay").click(closeModals);
      $(".hide-on-modal").hide();
      $(".arrow_box").addClass("hide");
      photoOrb.setState("stop")
    },
    complete: function(){
      $(".hide-on-modal").show();
      $(".arrow_box").removeClass("hide");
      photoOrb.setState("running");
      //photoOrb.reRender();
    }
  });
  $('body').css("overflow", 'hidden');
  newNavbarHeight = $("#top-mobile-nav-bar").height();
  $("#desktop-menu-bar").css({"top": newNavbarHeight + 15 +"px"})
  setArrowBoxPosition();

  var oldNavbarHeight = $("#top-mobile-nav-bar").height();
  resizeInterval = setInterval(function(){
    var newNavbarHeight;
    if(isInVRModeReact.get()){
      newNavbarHeight = 0;
    }
    else{
      newNavbarHeight = $("#top-mobile-nav-bar").height();
    }

    oldNavbarHeight = newNavbarHeight;
    $("#desktop-menu-bar").css({"top": newNavbarHeight + 15 +"px"})
    setArrowBoxPosition();
  },500);
  Session.set("posts-show-url", location.href);
  
  leavingPageSrc = Rx.Observable.merge(
                        Rx.Observable.fromEvent(window, "popstate"),
                        Rx.Observable.fromEvent($("a[target!='_blank']:not(.share-buttons a):not(.inpage-buttons)"), "click"),
                        Rx.Observable.fromEvent($("button.page-change"), "click"));

    //const closeModalSub = leavingPageSrc.
      //subscribe(function(e) {
          //$(".modal").modal('hide');
          //$(".modal-backdrop").remove();
          //closeModalSub.dispose();
      //});

  photoOrb = renderPhotoSphere("#container", "/images/canvas_loading.png");
  window.pho = photoOrb;


  Tracker.autorun(function(){
    const imageId = Session.get("showingImageId");
    if(imageId){
      const image = Models.Image.findOne(imageId);
      if(image.isUploaded()){
        const imageFilePath = image.url();
        photoOrb.mesh.material.map.dispose();
        photoOrb.mesh.material.dispose();
        console.log("actual material : " + imageFilePath);
        photoOrb.setMaterial(
          new THREE.MeshBasicMaterial({
            map: THREE.loader.load(imageFilePath, function() {
              FView.byId("loading-box").node.hide();
            },
            $.noop,
            function(error) {
                console.log('error while loading texture - ');
                console.log(error);
            })
          })
        );
      }
    }
  });

  post = Router.current().data(); 
  if(post){
    var image = Models.Image.findOne({
        _id: post.imageId
    });
    if(image){
      var imageFilePath = image.url({
        store: 'images'
      });

    }
  }

  (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=1018333888196733&version=v2.0";
      fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

}

const templatePostsShowDestroyed = function(){
  photoOrb.dispose();
  $('body').css("overflow", 'scroll');
  $('body').css
  delete photoOrb;

  const navHeight = $(".top-nav-bar").height();
  console.log(navHeight);
  if(isMobile.phone)
    $("body").css('padding-top', navHeight + 10 + 'px');
  else
    $("body").css('padding-top', navHeight + 20 + 'px');


  FView.byId("post-content").node.slideUp();
};

Template.PostsShowMobile.rendered = templatePostsShowRendered;
Template.PostsShow.rendered = templatePostsShowRendered;

Template.PostsShow.destroyed = templatePostsShowDestroyed;
Template.PostsShowMobile.destroyed = templatePostsShowDestroyed;
