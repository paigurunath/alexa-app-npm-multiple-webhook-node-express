var express = require("express");
var router = express.Router();

const guideToRetirment = require('../controllers').guideToRetirement;

router.get('api',
    (request,response) => response.status(200).send({message: 'Welcome'})
);


router.post('/guidetoretirement',guideToRetirment.guidetoretirementwebhook);

module.exports = router;

