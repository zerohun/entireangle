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

function disableVRMode(){
  if(vrDeviceInfo.type === "MOBILE")
	  OrbBuilders.setOrb(OrbBuilders.MobileControlOrbBuilder, orb);

  orb.setFullScreen(false);
  isInVRMode = false;
}

function enableVRMode(){
  if(vrDeviceInfo.type === "MOBILE")
	  OrbBuilders.setOrb(OrbBuilders.CardboardControlOrbBuilder, orb);

  orb.setFullScreen(true);
  isInVRMode = true;
}

function toggleVRMode(){
  if(vrDeviceInfo.type != "NONE"){
    if(isInVRMode) { 
      disableVRMode();
    }
    else {
      enableVRMode();
    }
  }
  else
    $('#NoneVRModal').modal('show');
}

Template.PostsShow.helpers({
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


Template.PostsShow.events({
  "click #vr-mode-button": function(){
    toggleVRMode();
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

Template.PostsShow.rendered = function() {

  turnEditingMode(false);

	post = getCurrentPost();
	Tracker.autorun(function (computation) {
		var image = Image.findOne({_id: post.imageId});
		var imageFilePath = image.url({store:'images'});
		if(imageFilePath){
			computation.stop();
			renderPhotoShpere(imageFilePath);
		}
	});

  function renderPhotoShpere(imageFilePath){
    vrDeviceInfo = getVRDeviceInfo();

    container = document.getElementById( 'container' );

    var material = new THREE.MeshBasicMaterial( {
      map: THREE.ImageUtils.loadTexture(imageFilePath, null, null, function(error){
		  console.log('error while loading texture - ');
		  console.log(error);
	  })
    } );

    if(vrDeviceInfo.type === "HMD"){
		orb = OrbBuilders.createOrb(OrbBuilders.HMDControlOrbBuilder, material, container);
    }
	else if(vrDeviceInfo.type === "MOBILE"){
		orb = OrbBuilders.createOrb(OrbBuilders.MobileControlOrbBuilder, material, container);
	}
	else{
		orb = OrbBuilders.createOrb(OrbBuilders.NormalControlOrbBuilder, material, container);
	}
	orb.render();
  }



  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=1018333888196733&version=v2.0";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

}
