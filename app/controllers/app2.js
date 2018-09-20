var alexa = require("alexa-app");

var app2 = new alexa.app("hey_test");
app2.id = require('../../package.json').alexa2.applicationId2;
app2.launch(function(request,response) {
  console.log('APP2');
  console.log(request);
  response.say("Hello how are you vikas").shouldEndSession(true);
});

module.exports = app2;