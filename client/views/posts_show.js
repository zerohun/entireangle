var orb;
var container;
var vrDeviceInfo;
var vrButton;
var container;
var isInVRMode = false;
var post = null;
var originalPosition = new THREE.Vector3();

function observeViewPosition(orb) {
    originalPosition.copy(orb.controls.object.position);

    var positionCheckSrc = Rx.Observable.
    interval(100).
    takeUntil(Rx.Observable.fromEvent(window, "popstate"));

    var positionCheckSub = positionCheckSrc.subscribe(function() {
        var currentPosition = orb.controls.object.position;
        if (originalPosition.x != currentPosition.x ||
            originalPosition.y != currentPosition.y ||
            originalPosition.z != currentPosition.z) {

            $("#position-save-button").show();
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
        post = getCurrentPost();
        Meteor.call("updatePostViewPosition", post, orb.controls.object.position);
        $("#position-save-button").hide();
        observeViewPosition(orb);
    }
});

Template.PostsShow.rendered = function() {

    var fview = FView.byId('header-footer');
    fview.node.setHeightMode(famous.customLayouts.HeaderFooterLayout.HEIGHT_MODES.FILL);

    $('body').css({overflow: "hidden"});

    $("#loading-box").show();
    var popStateSub = Rx.Observable.fromEvent(window, "popstate").
    subscribe(function(e) {
        $(".modal").modal('hide');
        $(".modal-backdrop").remove();
        popStateSub.dispose();
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
            renderPhotoShpere(imageFilePath);
        }
    });

    function renderPhotoShpere(imageFilePath) {
        vrDeviceInfo = getVRDeviceInfo();

        container = document.getElementById('container');

        var material = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture(imageFilePath, null, function() {
                $("#loading-box").hide();
            }, function(error) {
                console.log('error while loading texture - ');
                console.log(error);
            })
        });

        if (vrDeviceInfo.type === "HMD") {
            orb = OrbBuilders.createOrb(OrbBuilders.HMDControlOrbBuilder, material, container);
        } else if (vrDeviceInfo.type === "MOBILE") {
            orb = OrbBuilders.createOrb(OrbBuilders.MobileControlOrbBuilder, material, container);
        } else {
            orb = OrbBuilders.createOrb(OrbBuilders.NormalControlOrbBuilder, material, container);
        }
        orb.render();
        window.o = orb;
        if ( post.viewPosition && vrDeviceInfo.type !== "HMD" && vrDeviceInfo.type !== "MOBILE"){
            orb.controls.object.position.x = post.viewPosition.x;
            orb.controls.object.position.y = post.viewPosition.y;
            orb.controls.object.position.z = post.viewPosition.z;
        }
        if (Meteor.userId() && Meteor.userId() == post.user._id)
            observeViewPosition(orb);

        if (vrDeviceInfo.type === "MOBILE"){
            var prevTouchCoords;
            var touchCoords = THREE.Vector2();
            var raycaster = new THREE.Raycaster();

            var swipeUpSub = Rx.Observable.fromEvent(container, "touchstart").
                flatMap(function(startEvent){
                    return Rx.Observable.fromEvent(container, "touchmove").
                        takeUntil(Rx.Observable.fromEvent(container, "touchend"));
                }).
                takeUntil(Rx.Observable.fromEvent(window, "popstate"));
            
            swipeUpSub.subscribe(function(e){
                try{
                var touchCoords = new THREE.Vector2();
                touchCoords.x =  (e.touches[0].clientX / $(container).width()) * 2 - 1;
                touchCoords.y = -(e.touches[0].clientY / $(container).height()) * 2 + 1;
                //console.log(touchCoords);
                if(prevTouchCoords){
                    var dy = touchCoords.y - prevTouchCoords.y;
                    if(dy > 0.3){
                        //swipeUpSub.dispose();
                        //alert('title:' + post.title);
                    }
                    console.log(dy);

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
                        console.log(axis, angle);
                        orb.mesh.quaternion.multiply(rotQuat);
                    }
                }
                prevTouchCoords = touchCoords;
                } catch(ex){
                    //alert(ex.message);
                }
                
            });
            Rx.Observable.fromEvent(container, "touchend").
                takeUntil(Rx.Observable.fromEvent(window, "popstate")).
                subscribe(function(){
                    prevTouchCoords = null;
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

};
