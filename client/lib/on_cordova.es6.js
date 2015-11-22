Meteor.startup(function () {
  if (navigator.userAgent.search("Entireangle") > -1){ 
    document.addEventListener('deviceready', function(){
      cordova.exec(function(){alert('success');}, function(){alert('error');}, "HybridBridge", "checkCameraConnection", []);
    }, false);
  }
});
