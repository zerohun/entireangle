window.Orb = function(reqiredParams, options) {
    self = this;
    var scene, element, mesh;
    var clock = new THREE.Clock();

    this.material = reqiredParams.material;
    var controls = reqiredParams.controls;
    var container = reqiredParams.container;
    var camera = reqiredParams.camera;
    this.camera = camera;
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
        this.controls = newControls;
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
      const oldState = this.state;
      self.state = state;
      if(oldState !== "running" && self.state === "running"){
        //init();
        animate();
      }
    };
    this.afterRenderCallbacks = [];
    this.afterRender = function(callbackFunc){
      this.afterRenderCallbacks.push(callbackFunc);
    };

    this.dispose = function(){
      this.mesh.material.map.dispose();
      this.mesh.material.dispose();
      this.setState("stop");
    };

    this.setMaterial = function(material){
      this.material = material; 
      this.mesh.material = material;
    };
    this.enableControl = function(){
      if(this.controls.enable){
        this.controls.enable();
      }
    };
    this.disableControl = function(){
      if(this.controls.disable){
        this.controls.disable();
      }
    };
    function init() {

      console.log('orb init');
        self.scene = new THREE.Scene();
        self.scene.add(camera);

        geometry = new THREE.SphereGeometry(400, 60, 40);
        geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

        self.material.name = "material";
        self.mesh = new THREE.Mesh(geometry, self.material);
        self.mesh.name = "mesh";
        self.scene.add(self.mesh);
        self.scene.name = 'scene';

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
        const animationID = requestAnimationFrame(animate);

        if(window.aniDebug){
          console.log(animationID);
        }
        //    var dt = clock.getDelta();
        update();
      }
    }
    this.animate = animate;

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
    this.update = update;
    this.reRender = function(){
      self.renderable.render(this.scene, camera);
    }
    window.Orb.oneInstance = this;
};
