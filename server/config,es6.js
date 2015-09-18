ServiceConfiguration.configurations.upsert(
  { service: "facebook" },
  {
    $set: {
      appId: "1129515350411919",
      loginStyle: "popup",
      secret: "681902127c2afb85abdb0a97a255f98c"
    }
  }
);