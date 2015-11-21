var facebookConfig;
if(location.host == "entireangle.com"){
  facebookConfig = {
    'appId': '1018333888196733'
  };
}
else{
  facebookConfig = {
    'appId': '1129515350411919'
  }; 
}


ShareIt.configure({
    iconOnly: true,
    siteOrder: ['facebook', 'twitter', 'googleplus'],
    sites: {
      'facebook': facebookConfig
    }
});
