const templateHomeHelpers = {
  "featuredPosts": ()=>{
    const posts = Post.find(
        Session.get("postsQuery"),
        {$limit: 30});

    Session.set("postIds", posts.fetch().map((p) => p._id));
    return posts;
  },
  "cameraStatus": function(){
    return Session.get("camera-status");
  },
  "isCameraButtonVisible": function(){
    return navigator.userAgent.search("Entireangle") > -1
  }
};
const templateHomeEvents = {
  "click .connect-camera-button": function(){
      cordova.exec(function(res){
        const cameraInterval = setInterval(function(){
          cordova.exec(function(res){
            if(res === "success"){
              Session.set("camera-status", "success");
              alert("successully connect to camera");
              clearInterval(cameraInterval);
            }
            if(res === "failed"){
              Session.set("camera-status", "failed");
              clearInterval(cameraInterval);
              alert('Failed to connect to camera. please check your wifi connetion');
            }
            if(res === "in progress"){
              Session.set("camera-status", "in progress");
            }
          }, 
          function(){alert('error');},
          "HybridBridge", "checkCameraConnection", []);

        }, 500);
      }, 
      function(){alert('error');},
      "HybridBridge", "connectCamera", []);
  }
}

const templateHomeRendered = ()=>{
  FView.byId("loading-box").node.hide();
  $("body").css("overflow", "scroll");
};

Template.homeMobile.helpers(templateHomeHelpers);
Template.homeMobile.events(templateHomeEvents);
Template.homeMobile.rendered = templateHomeRendered;
Template.home.helpers(templateHomeHelpers);
Template.home.rendered = templateHomeRendered;
