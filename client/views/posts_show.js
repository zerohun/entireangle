
var camera, scene, renderer, controls, element;
var renderable;
var clock = new THREE.Clock();
var getSize;
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

  controls = new THREE.OrbitControls(camera, element);
  controls.rotateUp(Math.PI / 4);
  controls.target.set(
    0.1,0,0
  );
  renderable = renderer;
  isInVRMode = false;
}

function enableVRMode(){
  if(vrDeviceInfo.type === "MOBILE"){
    effect = new THREE.StereoEffect(renderer);
    renderable = effect;

    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();
  }
  else if(vrDeviceInfo.type === "HMD"){

    controls = new THREE.VRControls(camera, function(error){alert(error);});
    controls.update();
    effect = new THREE.VREffect(renderer, function(error){
      if (error) {
        vrButton.innerHTML = error;
        vrButton.classList.add('error');
      }
    });
    renderable = effect;
  }
  isInVRMode = true;
}

function toggleVRMode(){
  if(vrDeviceInfo.type != "NONE"){
    if(isInVRMode) { 
      disableVRMode();
      disableFullScreen();
    }
    else {
      enableVRMode();
      enableFullscreen(container);
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
    console.log(location.href);
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

  init();
  animate();

  function init() {

    vrDeviceInfo = getVRDeviceInfo();

    var mesh;

    container = document.getElementById( 'container' );
    camera = new THREE.PerspectiveCamera( 70, 1, 0.001, 500);
    scene = new THREE.Scene();
    scene.add(camera);

    var geometry = new THREE.SphereGeometry( 500, 60, 40 );
    geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );
    geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0,0,0 ) );

    post = getCurrentPost();
    var image = Image.findOne({_id: post.imageId});
    var imageFilePath = image.url({store:'images'});

    var material = new THREE.MeshBasicMaterial( {
      map: THREE.ImageUtils.loadTexture(imageFilePath)
    } );

    mesh = new THREE.Mesh( geometry, material );
    
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer({ antialias: true,
                                         devicePixelRatio: window.devicePixelRatio});
    renderable = renderer;

    var element = renderer.domElement;
    container.appendChild(element);
    controls = new THREE.OrbitControls(camera, element);
    controls.rotateUp(Math.PI / 4);
    controls.target.set(
      0.1,0,0
    );
  //				window.addEventListener( 'resize', onWindowResize, false );


    getSize = function(container){
      var width = container.offsetWidth;
      var height = container.offsetHeight;
      return {width: width, height: height};
    }
  }

  function onWindowResize() {
    var containerSize = getSize(container);
    
    camera.aspect = containerSize.width/containerSize.height;
    camera.updateProjectionMatrix();
    renderable.setSize(containerSize.width, containerSize.height);
    
  }

  window.addEventListener('resize', onWindowResize, false);

  function animate() {

    requestAnimationFrame( animate );
//    var dt = clock.getDelta();
    update();

  }

  function update(dt) {
  //        console.log(controls);
    onWindowResize();
    camera.updateProjectionMatrix();
    controls.update(dt);
  //				camera.position.copy( camera.target ).negate();

    renderable.render( scene, camera );
  }

  turnEditingMode(false);
}
