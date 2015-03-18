if(Meteor.isServer){
  Meteor.startup(function () {
      process.env.MAIL_URL = 'smtp://entireangle%40gmail.com:1324513245Choi@smtp.gmail.com:465/';

      Accounts.emailTemplates.from = 'EntireAngle';
      Accounts.emailTemplates.siteName = 'EntireAngle';
  });
}
