window.Orb = function(reqiredParams, options) {
    self = this;
    var scene, element, mesh;
    var clock = new THREE.Clock();

    var material = reqiredParams.material;
    var controls = reqiredParams.controls;
    var container = reqiredParams.container;
    var camera = reqiredParams.camera;
    var renderer = reqiredParams.renderer;
    var effect = reqiredParams.effect;
    var renderable = renderer;
    this.setFullScreen = reqiredParams.setFullScreen;

    this.getCamera = function() {
        return camera;
    };
    this.getElement = function() {
        return element;
    };
    this.setControls = function(newControls) {
        controls = newControls;
    };
    this.setEffect = function(effect) {
        if (effect) renderable = effect;
        else renderable = renderer;
        this.renderable = renderable;
    };
    this.removeEffect = function() {
        this.renderable = this.renderer;
    };
    this.setEffect(effect);

    this.renderer = renderer;
    this.renderable = renderable;
    this.container = container;
    this.controls = controls;

    this.render = function() {
        this.state = "running";
        init();
        animate();

    };

    this.registerWindowResizeListener = function() {
        window.addEventListener('resize', onWindowResize, false);
    };
    
    this.setState = function(state){
      self.state = state;
      if(self.state === "running"){
        init();
        animate();
      }
    };
    this.afterRenderCallbacks = [];
    this.afterRender = function(callbackFunc){
      this.afterRenderCallbacks.push(callbackFunc);
    };

    function init() {

        self.scene = new THREE.Scene();
        self.scene.add(camera);

        geometry = new THREE.SphereGeometry(400, 60, 40);
        geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

        self.mesh = new THREE.Mesh(geometry, material);
        self.scene.add(self.mesh);

        var element = renderer.domElement;
        container.appendChild(element);
    }

    function refreshScene(){
        self.scene = new THREE.Scene();
        self.scene.add(camera);
        self.scene.add(self.mesh);
    }

    function getSize(container) {
        var width = container.offsetWidth;
        var height = container.offsetHeight;
        return {
            width: width,
            height: height
        };
    }

    function onWindowResize() {
        var containersize = getSize(container);
        camera.aspect = containersize.width / containersize.height;
        camera.updateProjectionMatrix();
        renderable.setSize(containersize.width, containersize.height);
    }
    this.onWindowResize = onWindowResize;


    function animate() {
      if(self.state === "running"){
        requestAnimationFrame(animate);
        //    var dt = clock.getDelta();
        update();
      }
    }

    function update(dt) {
        //        console.log(controls);
        onWindowResize();
        //		camera.updateProjectionMatrix();
        self.controls.update(dt);
        //				camera.position.copy( camera.target ).negate();
        self.renderable.render(self.scene, camera);
        
        if(self.afterRenderCallbacks.length > 0){
          self.afterRenderCallbacks[0](self);
          self.afterRenderCallbacks.shift();
        }
    }
    this.reRender = function(){
      self.renderable.render(this.scene, camera);
    }
};
