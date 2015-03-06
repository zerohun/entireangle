//Template.Posts.helpers({
//})

Template.PostsShow.events({
  "click #vr-mode-button": function(){
    enableVRmode();
  }
});

Template.PostsShow.rendered = function() {
  var camera, scene, renderer, controls;
  var renderable;
  var clock = new THREE.Clock();
  var getSize;
  var vrDeviceInfo
  var vrButton;

  init();
  animate();

  function init() {

    vrDeviceInfo = getVRDeviceInfo();

    var container, mesh;

    container = document.getElementById( 'container' );
    camera = new THREE.PerspectiveCamera( 70, 1, 0.001, 500);
    scene = new THREE.Scene();
    scene.add(camera);

    var geometry = new THREE.SphereGeometry( 500, 60, 40 );
    geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );
    geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0,0,0 ) );

    var post = Router.current().data();
    console.log(post);
    var image = Image.findOne({_id: post.image._id})
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

  function fullscreen() {
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

  function enableVRmode(){
    if(vrDeviceInfo.type === "MOBILE"){
      effect = new THREE.StereoEffect(renderer);
      renderable = effect;

      controls = new THREE.DeviceOrientationControls(camera, true);
      controls.connect();
      controls.update();
      window.addEventListener('click', fullscreen, false);
      
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
      window.addEventListener('click', function(){
        fullscreen();
  //            effect.setFullScreen(true);
      }, true);
    }
    else{
      $('#NoneVRModal').modal('show');
    }
  }
}
