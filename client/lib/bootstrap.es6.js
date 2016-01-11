if(location.host == "entireangle.com"){
  window.fbAsyncInit = function() {
      FB.init({
        appId      : '1018333888196733',
        xfbml      : true,
        version    : 'v2.4'
      });
    };
}
else{
  window.fbAsyncInit = function() {
      FB.init({
        appId      : '1129515350411919',
        xfbml      : true,
        version    : 'v2.4'
      });
    };
}

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
