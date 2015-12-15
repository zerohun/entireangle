var createCamera = function(far) {
    return new THREE.PerspectiveCamera(70, 1, 0.0001, far);
};

var getRenderer = function() {
    return new THREE.WebGLRenderer({
        antialias: true,
        devicePixelRatio: window.devicePixelRatio,
        preserveDrawingBuffer: true
    });
};


var createOrb = function(builder, material, container) {
    return builder.create(material, container);
};

var setOrb = function(builder, orb) {
    return builder.set(orb);
};


var createNormalControlOrbBuilder = function() {
    return {
        far: 5000,
        create: function(material, container) {
            var camera = createCamera(this.far);
            var renderer = getRenderer();
            var element = renderer.domElement;
            var controls = new THREE.OrbitControls(camera, element);
            controls.rotateUp(Math.PI / 4);
            controls.target.set(0.1, 0, 0);
            controls.noZoom = false;
            controls.noPan = true;
            return new Orb({
                material: material,
                controls: controls,
                container: container,
                renderer: renderer,
                camera: camera
            });
        },
        set: function(orb) {
            var camera = orb.getCamera();
            camera.far = this.far;
            var controls = new THREE.OrbitControls(camera, orb.getElement());
            orb.setControls(controls);
            orb.renderable = orb.renderer;
        }
    };
};

var createMobileControlOrbBuilder = function() {
    return {
        far: 500,
        create: function(material, container) {
            var camera = createCamera(this.far);
            var renderer = getRenderer();
            var element = renderer.domElement;
            var controls = new THREE.DeviceOrientationControls(camera, true);
            controls.connect();
            controls.update();
            return new Orb({
                material: material,
                controls: controls,
                container: container,
                renderer: renderer,
                camera: camera
            });
        },
        set: function(orb) {
            var camera = orb.getCamera();
            camera.far = this.far;
            orb.removeEffect();
            var controls = new THREE.DeviceOrientationControls(camera, true);
            controls.connect();
            controls.update();
            orb.setControls(controls);
        }
    };
};

var createAltspaceVRContorlOrbBuilder = function(){
    return {
        create: function(material, container){
            var renderer = altspace.getThreeJSRenderer();
            return new Orb({
                material: material,
                container: container,
                renderer: renderer
            });
        }
    };
}

var createCardboardControlOrbBuilder = function() {
    var getSetFullScreenFunc = function(container) {
        return function(trueOrFalse) {
            if (trueOrFalse) {
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.msRequestFullscreen) {
                    container.msRequestFullscreen();
                } else if (container.mozRequestFullScreen) {
                    container.mozRequestFullScreen();
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                }
            } else {
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
        };
    };
    return {
        far: 500,
        create: function(material, container) {
            var camera = createCamera(this.far);
            var renderer = getRenderer();
            var effect = new THREE.StereoEffect(renderer);
            var element = renderer.domElement;
            var controls = new THREE.DeviceOrientationControls(camera, true);
            controls.connect();
            controls.update();
            return new Orb({
                material: material,
                controls: controls,
                container: container,
                renderer: renderer,
                camera: camera,
                effect: effect,
                setFullScreen: getSetFullScreenFunc(container)
            });
        },
        set: function(orb) {
            orb.setState("stop");
            var camera = orb.getCamera();
            camera.far = this.far;
            var controls = new THREE.DeviceOrientationControls(camera, true);
            orb.setControls(controls);
            var renderer = orb.renderer;
            var clonedRenderer = jQuery.extend(true, {}, renderer);
            var effect = new THREE.StereoEffect(renderer);
            orb.setEffect(effect);
            orb.renderer = clonedRenderer;
            orb.setFullScreen = getSetFullScreenFunc(orb.container);
            orb.render();
        }
    };
};
var createHMDControlOrbBuilder = function() {
    var getSetFullScreen = function(orb) {
        return function(trueOrFalse) {
            if (trueOrFalse) {
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.msRequestFullscreen) {
                    container.msRequestFullscreen();
                } else if (container.mozRequestFullScreen) {
                    container.mozRequestFullScreen();
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                }
            } else {
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
        };
    };
    return {
        far: 1000,
        create: function(material, container) {
            var camera = createCamera(this.far);
            var renderer = getRenderer();
            var element = renderer.domElement;
            var controls = new THREE.VRControls(camera, function(error) {});
            var effect = new THREE.VREffect(renderer, function(error) {
                if (error) {
                    alert(error);
                }
            });
            var orb = new Orb({
                material: material,
                controls: controls,
                container: container,
                renderer: renderer,
                camera: camera,
                effect: effect
            });

            orb.setFullScreen = getSetFullScreen(orb);
            return orb;
        },
        set: function(orb) {
            var camera = orb.getCamera();
            camera.far = this.far;
            var controls = new THREE.VRControls(camera, function(error) {});
            orb.setControls(controls);
            var renderer = orb.renderer;
            var effect = new THREE.VREffect(renderer, function(error) {
                if (error) {
                    alert(error);
                }
            });
            orb.setEffect(effect);
            orb.setFullScreen = getSetFullScreen(orb);
        }
    };
};


window.OrbBuilders = {
    createOrb: createOrb,
    setOrb: setOrb,
    NormalControlOrbBuilder: createNormalControlOrbBuilder(),
    MobileControlOrbBuilder: createMobileControlOrbBuilder(),
    CardboardControlOrbBuilder: createCardboardControlOrbBuilder(),
    HMDControlOrbBuilder: createHMDControlOrbBuilder(),
    AltspaceVRContorlOrbBuilder: createAltspaceVRContorlOrbBuilder()
};
