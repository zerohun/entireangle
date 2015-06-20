window.Orb = function(reqiredParams, options){
	var scene, element, mesh;
	var clock = new THREE.Clock();
	var container;

	var material = reqiredParams.material;
	var controls = reqiredParams.controls;
	var container = reqiredParams.container;
	var camera = reqiredParams.camera;
	var renderer = reqiredParams.renderer;
	var effect = reqiredParams.effect;
	var renderable = renderer;
	this.setFullScreen = reqiredParams.setFullScreen;

	this.getCamera = function(){
		return camera;
	}
	this.getElement = function(){
		return element;
	}
	this.setControls = function(newControls){
		controls = newControls;
	};
	this.setEffect = function(effect){
		if(effect) renderable = effect;
		else renderable = renderer;
		this.renderable = renderable;
	}
	this.removeEffect = function(){
		this.renderable = renderer;
	}
	this.setEffect(effect);

	this.renderer = renderer;
	this.renderable = renderable;

	this.render = function(){
		init();
		animate();
		
	};

	this.registerWindowResizeListener = function(){
		window.addEventListener('resize', onWindowResize, false);
	};

	function init(){

		scene = new THREE.Scene();
		scene.add(camera);

		var geometry = new THREE.SphereGeometry( 400, 60, 40 );
		geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );
		geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0,0,0 ) );

		mesh = new THREE.Mesh( geometry, material );
		scene.add( mesh );

		var element = renderer.domElement;
		container.appendChild(element);
	};

	function getSize(container){
		var width = container.offsetWidth;
		var height = container.offsetHeight;
		return {width: width, height: height};
	};

	function onWindowResize() {
		var containersize = getSize(container);
		camera.aspect = containersize.width/containersize.height;
		camera.updateProjectionMatrix();
		renderable.setSize(containersize.width, containersize.height);
	};


	function animate() {
		requestAnimationFrame( animate );
		//    var dt = clock.getDelta();
		update();
	};

	function update(dt) {
		//        console.log(controls);
		onWindowResize();
//		camera.updateProjectionMatrix();
	    controls.update(dt);
		//				camera.position.copy( camera.target ).negate();
		renderable.render( scene, camera );
	};

}
