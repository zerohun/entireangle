var container;
var vrDeviceInfo;
var vrButton;
var container;
var isInVRMode = false;
var post = null;
var originalPosition = new THREE.Vector3();
let leavingPageSrc; 
let isPreviewRendered = false;
let previewOrb, photoOrb;

var SwipingDirection = {};
SwipingDirection.LEFT = Symbol("LEFT");
SwipingDirection.RIGHT = Symbol("RIGHT");
SwipingDirection.UP = Symbol("UP");
SwipingDirection.DOWN = Symbol("DOWN");
SwipingDirection.NONE = Symbol("NONE");


function onClickSavePreviewButton(){
  FView.byId("loading-box").node.show();
  saveCanvasSnapshotToImageStore($("#share-preview canvas"), "snsThumbs", 
  ()=> {
    FView.byId("loading-box").node.hide();
    $(".sns-buttons").show();
    $("#save-preview-button").hide();
    observeViewPosition(previewOrb, ()=>{
      $(".sns-buttons").hide();
      $("#save-preview-button").show();
    })
  });
}

function saveCanvasSnapshotToImageStore(cssSelector, storeName, callbackFunc){
  var dataUrl = $(cssSelector)[0].toDataURL("image/jpeg");
  var imageId = Router.current().data().imageId;
  var size = {};
  size.width = $(cssSelector).width();
  size.height = $(cssSelector).height();
  Meteor.call("saveToImageStore", storeName, imageId, size, dataUrl, function(err){
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

    var material = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(imageFilePath, null, function() {
          FView.byId("loading-box").node.hide();
        }, function(error) {
            //console.log('error while loading texture - ');
            //console.log(error);
        })
    });

    if (vrDeviceInfo.type === "HMD") {
        orb = OrbBuilders.createOrb(OrbBuilders.HMDControlOrbBuilder, material, container);
    } else if (vrDeviceInfo.type === "MOBILE") {
        orb = OrbBuilders.createOrb(OrbBuilders.MobileControlOrbBuilder, material, container);
    } else {
        orb = OrbBuilders.createOrb(OrbBuilders.NormalControlOrbBuilder, material, container);
        $("#info").show();
    }
    orb.render();
    if ( post.viewPosition && vrDeviceInfo.type !== "HMD" && vrDeviceInfo.type !== "MOBILE"){
        orb.controls.object.position.x = post.viewPosition.x;
        orb.controls.object.position.y = post.viewPosition.y;
        orb.controls.object.position.z = post.viewPosition.z;
    }
    if (Meteor.userId() && Meteor.userId() == post.user._id)
        observeViewPosition(orb, ()=>{
          $("#position-save-button").show();
        });

    if (vrDeviceInfo.type === "MOBILE"){

        var prevTouchCoords;
        var touchCoords = THREE.Vector2();
        var raycaster = new THREE.Raycaster();
        var slideUpWindow = FView.byId("slide-up-menu").node;
        Session.set('slideUpVisible', true);
        console.log('show');
        $(window).scrollTop(0);

        var slideUpPosition = slideUpWindow.upPosition();
        const resizeSub = Rx.Observable.fromEvent(window, 'resize').
          subscribe(() =>{
            slideUpPosition = slideUpWindow.upPosition();
          });

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

        const finishSwipeUp = (slideWindow, nextObs, nextObserver, nextComplete) =>{
            slideWindow.slideUp();
            //slideWindow.setMountPoint(0.5, 0.5);
            $("#slide-up-handle").text("Swipe down");
            return nextObs.subscribe(nextObserver, $.noop, nextComplete);
        };


        const slideUpMenu = document.getElementById("slide-up-menu");
        const slideUpMenuHandle = document.getElementById("slide-up-handle");
        const body = document.getElementsByTagName("body")[0];

        horizontalSwipeObs = Rx.Observable.fromEvent(container, "touchstart").
          flatMap(startEvent =>{
              return Rx.Observable.fromEvent(body, "touchmove").
                map(moveEvent =>{
                  return [startEvent,moveEvent];
                });
          }).
          takeUntil(Rx.Observable.fromEvent(body, "touchend")).
          filter(eventPair =>{
            const swipeDirection = getSwipingDirection(eventPair);

            return (swipeDirection === SwipingDirection.LEFT ||
                    swipeDirection === SwipingDirection.RIGHT);
          });

        verticalSwipeObs = Rx.Observable.fromEvent(slideUpMenuHandle, "touchstart").
          flatMap(startEvent =>{
              return Rx.Observable.fromEvent(body, "touchmove").
                map(moveEvent =>{
                  return [startEvent,moveEvent];
                });
          }).
          takeUntil(Rx.Observable.fromEvent(body, "touchend")).
          filter(eventPair =>{
            const swipeDirection = getSwipingDirection(eventPair);
            return (swipeDirection === SwipingDirection.UP || 
                    swipeDirection === SwipingDirection.DOWN);
          }).takeUntil(horizontalSwipeObs);

        verticalUpSwipeObs = verticalSwipeObs.filter(eventPair =>{
          return getSwipingDirection(eventPair) === SwipingDirection.UP;
        });
        verticalDownSwipeObs = verticalSwipeObs.filter(eventPair =>{
          return getSwipingDirection(eventPair) === SwipingDirection.DOWN;
        });

        verticalObserverFunc = eventPair=>{
          slideUpPosition[1] = eventPair[1].touches[0].clientY;
          //slideUpWindow.setMountPoint(0.5, 0.0);
          slideUpWindow.setPosition(slideUpPosition[0], slideUpPosition[1], slideUpPosition[2]);
        };

        verticalUpCompleteFunc = ()=>{
          verticalSubs.dispose();
          if(slideUpWindow.getPosition()[1] < slideUpWindow.downPosition()[1])
            verticalSubs = finishSwipeUp(slideUpWindow, verticalDownSwipeObs, verticalObserverFunc, verticalDownCompleteFunc);
          else
            verticalSubs = finishSwipeDown(slideUpWindow, verticalUpSwipeObs, verticalObserverFunc, verticalUpCompleteFunc);
        };
        verticalDownCompleteFunc = ()=>{
          verticalSubs.dispose();
          if(slideUpWindow.getPosition()[1] > slideUpWindow.upPosition()[1])
            verticalSubs = finishSwipeDown(slideUpWindow, verticalUpSwipeObs, verticalObserverFunc, verticalUpCompleteFunc);
          else
            verticalSubs = finishSwipeUp(slideUpWindow, verticalDownSwipeObs, verticalObserverFunc, verticalDownCompleteFunc);
        };

        horizontalObserverFunc = eventPair =>{
            try{
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

        verticalSubs = verticalUpSwipeObs.subscribe(verticalObserverFunc, $.noop, verticalUpCompleteFunc);
        horizontalSubs = horizontalSwipeObs.subscribe(horizontalObserverFunc, $.noop, horizontalCompleteFunc);
        const leavingPageSub = leavingPageSrc.subscribe(()=>{
          verticalSubs.dispose();
          horizontalSubs.dispose();
          resizeSub.dispose();
          Session.set('slideUpVisible', false);
          $("#slide-up-handle").text("Swipe up");
          leavingPageSub.dispose();
        });
        const popStateSub = Rx.Observable.fromEvent(window, "popstate").
                              subscribe(()=>{
                                popStateSub.dispose();
                                FView.byId("loading-box").node.show();
                              });
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

function turnEditingMode(onOfOff) {
  if (onOfOff) {
        $(".view-box").hide();
        $(".edit-field").show();
    } else {
        $(".view-box").show();
        $(".edit-field").hide();
    }
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

function disableVRMode() {
    if (vrDeviceInfo.type === "MOBILE")
        OrbBuilders.setOrb(OrbBuilders.MobileControlOrbBuilder, orb);

    orb.setFullScreen(false);
    isInVRMode = false;
}

function enableVRMode() {
    if (vrDeviceInfo.type === "MOBILE")
        OrbBuilders.setOrb(OrbBuilders.CardboardControlOrbBuilder, orb);

    orb.setFullScreen(true);
    isInVRMode = true;
}

function toggleVRMode() {
    if (vrDeviceInfo.type != "NONE") {
        if (isInVRMode) {
            disableVRMode();
        } else {
            enableVRMode();
        }
    } else
        $('#NoneVRModal').modal('show');
}

Template.PostsShow.helpers({
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
    }
});


Template.PostsShow.events({
    "click .shareModalOpenBtn": function(){
      $("#shareModal").modal();
    },
    "click #share-modal-close-btn":  function(){
      $("#shareModal").modal('hide');
      previewOrb.setState("stop");
      photoOrb.setState("running");
    },
    "click #vr-mode-button": function() {
        toggleVRMode();
    },
    "click #home-button": function() {
        Router.go("home");
    },
    "click #container": function() {
        if (isInVRMode) toggleVRMode();
    },
    "click #remove-button": function() {
        var post = getCurrentPost();
        Router.go('Posts');
        Meteor.call("removePost", post._id);
        return false;
    },
    "click #edit-button": function() {
        turnEditingMode(true);
        return false;
    },
    "submit #edit-post": function() {
        post = getCurrentPost();
        post.title = event.target.title.value;
        post.desc = event.target.desc.value;
        Meteor.call("updatePost", post);
        turnEditingMode(false);
        return false;
    },
    "click #position-save-button": function() {
        FView.byId("loading-box").node.show();
        post = getCurrentPost();
        Meteor.call("updatePostViewPosition", post, photoOrb.controls.object.position);
        
        saveCanvasSnapshotToImageStore($("#container canvas"), "thumbs", 
        ()=> {
          FView.byId("loading-box").node.hide();
        });
        $("#position-save-button").hide();
        observeViewPosition(photoOrb, ()=>{
          $("#position-save-button").show();
        });
        
    },
    "click #save-preview-button": onClickSavePreviewButton
});

Template.PostsShow.rendered = function() {
    $('body').css("overflow", 'hidden');
    FView.byId("loading-box").node.show();
    
    $("#shareModal").on("shown.bs.modal",function() {
      photoOrb.setState("stop");
      let previewHeight = $("#share-preview").width() * 0.525;
      $("#share-preview").height(previewHeight);
      if(!isPreviewRendered){
        var image = Image.findOne({
            _id: post.imageId
        });
        var imageFilePath = image.url({
            store: 'images'
        });
        previewOrb = renderPhotoSphere("#share-preview", imageFilePath);
        
        previewOrb.afterRender(()=>{
          previewOrb.controls.object.position.x = photoOrb.controls.object.position.x;
          previewOrb.controls.object.position.y = photoOrb.controls.object.position.y;
          previewOrb.controls.object.position.z = photoOrb.controls.object.position.z;
          onClickSavePreviewButton();
          
        });
        
        window.pre = previewOrb;
        window.pho = photoOrb;
      
        isPreviewRendered = true;
      }
      else{
        previewOrb.setState("running");
      }
    });
    
    $("#shareModal").on("hidden.bs.modal",function() {
      previewOrb.setState("stop");
      photoOrb.setState("running");
    });
    
    leavingPageSrc = Rx.Observable.merge(
                          Rx.Observable.fromEvent(window, "popstate"),
                          Rx.Observable.fromEvent($("a[target!='_blank']:not(.share-buttons a)"), "click"),
                          Rx.Observable.fromEvent($("button.page-change"), "click"));
    var fview = FView.byId('header-footer');
    fview.node.setHeightMode(famous.customLayouts.HeaderFooterLayout.HEIGHT_MODES.FILL);

    const closeModalSub = leavingPageSrc.
    subscribe(function(e) {
        $(".modal").modal('hide');
        $(".modal-backdrop").remove();
        closeModalSub.dispose();
    });

    turnEditingMode(false);

    post = getCurrentPost();
    Tracker.autorun(function(computation) {
        var image = Image.findOne({
            _id: post.imageId
        });
        var imageFilePath = image.url({
            store: 'images'
        });
        if (imageFilePath) {
            computation.stop();
            photoOrb = renderPhotoSphere("#container", imageFilePath);
        }
    });

    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=1018333888196733&version=v2.0";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

};

Template.PostsShow.toggleVRMode = ()=>{
    toggleVRMode();
};