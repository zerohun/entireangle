var orb; 
var container;
var vrDeviceInfo
var vrButton;
var container;
var isInVRMode = false;
var post = null;

function turnEditingMode(onOfOff){
  if(onOfOff) {
    $(".view-box").hide();
    $(".edit-field").show();
  }
  else{
    $(".view-box").show();
    $(".edit-field").hide();
  }
}

function getCurrentPost(){
  try{
  post = Router.current().data();
  return post;
  }
  catch(e){
    return null
  }
}

function getDefaultControls(camera, element){
  var controls;

  if(isMobile.phone){
    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();
  }
  else{
    controls = new THREE.OrbitControls(camera, element);
    controls.rotateUp(Math.PI / 4);
    controls.target.set(
      0.1,0,0
    );
    controls.noZoom = false;
    controls.noPan = true;
  }
  return controls;
}


function enableFullscreen(container) {
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.msRequestFullscreen) {
    container.msRequestFullscreen();
  } else if (container.mozRequestFullScreen) {
    container.mozRequestFullScreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  }
}

function disableFullScreen(){
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}
function disableVRMode(){
  if(vrDeviceInfo.type === "MOBILE"){
	  OrbBuilders.setOrb(OrbBuilders.MobileControlOrbBuilder, orb);
	  disableFullScreen();
  }
  else if(vrDeviceInfo.type = "HMD"){ 
	  orb.setFullScreen(false);
  }
  isInVRMode = false;
}

function enableVRMode(){
  if(vrDeviceInfo.type === "MOBILE"){
	  OrbBuilders.setOrb(OrbBuilders.CardboardControlOrbBuilder, orb);
	  enableFullscreen(container);
  }
  else if(vrDeviceInfo.type == "HMD"){
	  orb.setFullScreen(true);
  }
  isInVRMode = true;
}

function toggleVRMode(){
  if(vrDeviceInfo.type != "NONE"){
    if(isInVRMode) { 
      disableVRMode();
    }
    else {
      enableVRMode();
//      enableFullscreen(container);
    }
  }
  else
    $('#NoneVRModal').modal('show');
}

Template.VideoPostsShow.helpers({
  "isMyPost": function(){
    try{
    return getCurrentPost().user._id == Meteor.userId();
    }
    catch(e){
      return false;
    }
  },
  "isEmbedded": function(){
    return Router.current().params.query.hasOwnProperty("embedded");
  },
  "embedUrl": function(){
    var hrefList = location.href.split('/');
    var address = location.protocol + "//" + hrefList[1] + hrefList[2] + "/ep/" + Router.current().params._id;
    return "<iframe width='560' height='315' src='" + address + "' frameborder='0' allowfullscreen></iframe>";
  }
})


Template.VideoPostsShow.events({
  "click #vr-mode-button": function(){
    if(vrDeviceInfo.type === "MOBILE"){
        alert("Sorry Video VR mode is not supported in mobile devices yet");
    }
    else{
        toggleVRMode();
    }
  },
  "click #home-button": function(){
    Router.go("home")
  },
  "click #container": function(){
    if(isInVRMode) toggleVRMode();
  },
  "click #remove-button": function(){
    var post = getCurrentPost();
    Router.go('posts');
    Meteor.call("removePost", post._id);
    return false;
  },
  "click #edit-button": function(){
    turnEditingMode(true);
    return false;
  },
  "submit #edit-post": function(){
    post = getCurrentPost();
    post.title = event.target.title.value;
    post.desc = event.target.desc.value;
    Meteor.call("updatePost", post)
    turnEditingMode(false)
    return false;
  }
});

Template.VideoPostsShow.rendered = function() {

  turnEditingMode(false);

	post = getCurrentPost();
	Tracker.autorun(function (computation) {
		var video = Video.findOne({_id: post.imageId});
		var videoFilePath = video.url({store:'videos'});
		if(videoFilePath){
			computation.stop();
			renderPhotoShpere(videoFilePath);
		}
	});

  function renderPhotoShpere(videoFilePath){
    vrDeviceInfo = getVRDeviceInfo();

    container = document.getElementById( 'container' );

	video = document.createElement( 'video' );
    document.getElementById('hidden-video').appendChild(video);
	video.loop = true;
	video.src = videoFilePath;
    video.id = "orb-player";
    video.onloadeddata = function(){
        $("#loading-box").hide();
        video.play();
    }
	console.log('play video');

    if(vrDeviceInfo.type === "MOBILE" ){
        $(video).attr("controls", "controls");
        $(video).css("width", "100%");
        $(video).parent().css("display", "block");
        $(container).remove();
        toastr.warning("Sorry. Play video sphere is not supported for mobile devices yet. I recommned you watch to this video in desktop or laptop computer for now");
    }
    else{
        texture = new THREE.VideoTexture( video );
        texture.minFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;
        texture.generateMipmaps = false;

        var material = new THREE.MeshBasicMaterial( { map: texture } );

        if(vrDeviceInfo.type === "HMD"){
            orb = OrbBuilders.createOrb(OrbBuilders.HMDControlOrbBuilder, material, container);
        }
        else{
            orb = OrbBuilders.createOrb(OrbBuilders.NormalControlOrbBuilder, material, container);
        }
        orb.render();
        console.log('orb is rendered');
    }

	/*

	var camera = new three.perspectivecamera( 70, 1, 0.0001, 5000);

	var renderer = new THREE.WebGLRenderer({ antialias: true,
										 devicePixelRatio: window.devicePixelRatio});

	var element = renderer.domElement;
    var controls = new THREE.OrbitControls(camera, element);
    controls.rotateUp(Math.PI / 4);
    controls.target.set(
      0.1,0,0
    );
    controls.noZoom = false;
    controls.noPan = true;

	var orb = new Orb({
		material: material,
		controls: controls,
		container: container,
	    renderer: renderer,
		camera: camera
	});

	orb.render();
	*/

  }



  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=1018333888196733&version=v2.0";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

}
