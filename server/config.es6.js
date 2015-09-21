let facebookConfig;

if(Meteor.absoluteUrl().search("entireangle.com") > - 1){
  facebookConfig = {
      appId: "1018333888196733",
      loginStyle: "popup",
      secret: "d707144fdfca9e7d8bfdaaefbfa486fe"
  };
}
else{
  facebookConfig = {
      appId: "1129515350411919",
      loginStyle: "popup",
      secret: "681902127c2afb85abdb0a97a255f98c"
  };
}

ServiceConfiguration.configurations.upsert(
  { service: "facebook" },
  { $set: facebookConfig }
);