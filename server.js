var express = require("express");
var alexa = require("alexa-app");
var express_app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var UserDetails = require('./app/models/UserDetails');
var config = require('./app/config/config.js');
var Speech = require('ssml-builder');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(config.dbUrl);

var app2 = require('./app/controllers/app2');

var podcastURL = "https://am.jpmorgan.com/blob-gim/1383421019357/83456/Slide_15_KR.mp3";

var stream = {
  "url": podcastURL,
  "token": "0",
  "expectedPreviousToken": null,
  "offsetInMilliseconds": 0
};


var speech = new Speech()
  .audio('https://am.jpmorgan.com/blob-gim/1383544275901/83456/general_intro_first_phase1.mp3')
  .pause('2s')
  .audio('https://am.jpmorgan.com/blob-gim/1383544277586/83456/general_intro_prompt_phase1_q.mp3');
  var speechOutput = speech.ssml(true);


  var speech1 = new Speech()
  .audio('https://am.jpmorgan.com/blob-gim/1383544287071/83456/quotes_mothersbasement.mp3')
  .pause('1s')
  .audio('https://am.jpmorgan.com/blob-gim/1383544287282/83456/quotes_playgroundslide.mp3')
  .pause('1s')
  .audio('https://am.jpmorgan.com/blob-gim/1383544287493/83456/quotes_tortoiseandhare.mp3');
  var speechOutput1 = speech1.ssml(true);

  var speech2 = new Speech()
  .audio('https://am.jpmorgan.com/blob-gim/1383544273521/83456/exception_about_skill_phase1.mp3')
  .pause('1s')
  .audio('https://am.jpmorgan.com/blob-gim/1383544277367/83456/general_intro_prompt_phase1.mp3')
 
  var speechOutput2 = speech2.ssml(true);



var app1 = new alexa.app("guide_to_retirement");
app1.id = require('./package.json').alexa1.applicationId1;
app1.launch(function(request,response) {
  console.log(JSON.stringify(request));
  response.say(speechOutput).shouldEndSession(false);
});


var speechOutput = speech.ssml(false);

// express_app.use();

app1.intent('AboutDrKellyIntent', {
},
function(req, res) {
  console.log('------------About Dr------------------');
  console.log(JSON.stringify(req));
  res.say("<audio src='https://am.jpmorgan.com/blob-gim/1383544273410/83456/exception_about_author.mp3'/> ")
  .shouldEndSession(false);
}
);

app1.intent('QuoteIntent', {
},
function(req, res) {
  res.say(speechOutput1).shouldEndSession(false);
}
);

app1.intent('WhatIsThisIntent', {
},
function(req, res) {
  res.say(speechOutput2).shouldEndSession(false);
}
);

app1.intent('ThanksIntent', {
},
function(req, res) {
  res.say("<audio src='https://am.jpmorgan.com/blob-gim/1383544278455/83456/goodbye_general.mp3'/> ").shouldEndSession(true);
}
);

app1.intent('AMAZON.NoIntent', {
  },
function(req, res) {
  
  var session1 = req.getSession("no");
  var quote1 = session1.get("no");

  if(quote1 == "no"){
    res.say("<audio src='https://am.jpmorgan.com/blob-gim/1383544278455/83456/goodbye_general.mp3'/> " , 'Goodbye' )
    .shouldEndSession(true);
  } else {
    res.say("Let me know if you would like to hear anyting else .. you can say things like play a quote, who is Dr. Kelly ?  " )
    .shouldEndSession(false);
    req.getSession().set("yes", "yes");
    req.getSession().set("no", "no");
  }
      
  }
);

app1.intent('AMAZON.YesIntent', {
},
function(req, res) {
    res.audioPlayerPlayStream("REPLACE_ALL", stream).shouldEndSession(false);
   }
);

app1.intent('AMAZON.StopIntent', {
 
},
function(req, res) {
  console.log('app.AMAZON.StopIntent');
  res.say("Thanks you and come back soon");
  res.audioPlayerStop();
  res.send();
}
);

app1.intent('AMAZON.PauseIntent', {},
  function(req, res) {
    console.log('app.AMAZON.PauseIntent');
    res.audioPlayerStop();
    res.send();
  }
);

app1.intent('AMAZON.ResumeIntent', {},
  function(req, res) {
    console.log('app.AMAZON.ResumeIntent');
    if (req.context.AudioPlayer.offsetInMilliseconds > 0 && req.context.AudioPlayer.playerActivity === 'STOPPED') {
      res.audioPlayerPlayStream('REPLACE_ALL', {
        token: req.context.AudioPlayer.token,
        url: req.context.AudioPlayer.token, // hack: use token to remember the URL of the stream
        offsetInMilliseconds: req.context.AudioPlayer.offsetInMilliseconds
      });
    }
    res.send();
  }
);


app1.express({ expressApp: express_app });
app2.express({ expressApp: express_app });
// express_app.listen(process.env.PORT);


express_app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

express_app.use(bodyParser.json());

express_app.post("/guidetoretirement", function(req, res) {
  var speech = "";
  //console.log(JSON.stringify(req.body));
  console.log(JSON.stringify(req.body));
  console.log(req.body.queryResult.parameters);
  console.log(JSON.stringify(req.body.queryResult.parameters));
  // console.log(req.body.queryResult.parameters.retirement)

  

  if(req.body.queryResult.parameters.givenName ) {

    if(req.body.queryResult.parameters.givenName.toLowerCase() == 'retirement' || req.body.queryResult.parameters.retirement.toLowerCase() == 'guide' ) {
      speech = '<speak> Welcome, here is the preview of simplify the complex with the Guide to Retirement'+
    '</speak>';
    } else {
      speech = '<speak> Can you please repeat that again.'+
      '</speak>';
    }
    // speech =
    // '<speak> Welcome, here is the preview of simplify the complex with the Guide to Retirement'+
    // '<audio src="https://am.jpmorgan.com/blob-gim/1383559729729/83456/WeeklyStory.mp3"></audio>' +
    // '<break time="2s"/>Do you want to continue Retirement Program Introduction ?' +
    // '</speak>';
  }

  if(req.body.queryResult.parameters.userResponse) {
    speech =
    '<speak><audio src="https://am.jpmorgan.com/blob-gim/1383563844873/83456/gtr-test.mp3"></audio>'+
    '<break time="2s"/>would you like to hear more on retirement plans ? <break time="2s"/></speak>';
  }

  //https://am.jpmorgan.com/blob-gim/1383421019357/83456/Slide_15_KR.mp3
  if(req.body.queryResult.parameters.mobile || req.body.queryResult.parameters.email) {

    var mobile = "";
    var email = "";

    if(req.body.queryResult.parameters.mobile) {
      mobile = req.body.queryResult.parameters.mobile;
    } 

    if(req.body.queryResult.parameters.email) {
      email = req.body.queryResult.parameters.email;
    } 

    var UserDetailsObj = new UserDetails({
      "userId":req.body.originalDetectIntentRequest.payload.user.userId,
      "conversationId": req.body.originalDetectIntentRequest.payload.conversation.conversationId,
      "mobile" : mobile,
      "email": email
    }); 
    
    console.log(JSON.stringify(UserDetailsObj));

    UserDetailsObj.save(function(error) {
        console.log("Your UserDetailsObj has been saved!");
        
      if (error) {
         console.error(error);
       }
     });

     speech = "Thank you, come back again";
    }

 
  if(req.body.queryResult.intent.displayName.toLowerCase() == 'WelcomeIntent'.toString().toLowerCase() ) {
    console.log('inside welcome intent');
    speech =
    '<speak> Welcome, here is the preview of simplify the complex with the Guide to Retirement'+
    '<audio src="https://am.jpmorgan.com/blob-gim/1383559729729/83456/WeeklyStory.mp3">did not get your audio file</audio>' +
    '<break time="2s"/>Do you want to continue Retirement Program Introduction ?' +
    '</speak>'
  }

  return res.json({
    fulfillmentText: speech,
    source: "webhook-echo-sample"
  });
});

express_app.listen(process.env.PORT);
// express_app.listen(80);



console.log("Server started at port ");