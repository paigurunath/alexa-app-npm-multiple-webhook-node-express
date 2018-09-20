var express = require("express");
var express_app = express();
var path = require("path");
var bodyParser = require("body-parser");
var app = express();
var routes = require('./app/routes/index');



app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));

app.get("/",function(request,response){
    response.json({message: "Express is up!"});
});

// app.express({ expressApp: express_app });
// express_app.listen(process.env.PORT );
// app.listen(80);
app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  
app.use(bodyParser.json());

app.post("/guidetoretirement", function(req, res) {
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

app.listen(process.env.PORT);
app.listen(80);


