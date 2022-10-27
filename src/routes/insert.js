const express = require('express');
const router = express.Router();
const insert = require('../services/hello');

/* GET quotes listing. */
router.get('/', function(req, res, next) {
  try {
    var user = "";
    var provider = "";
    
    var url = req.url;
    var index1 = url.lastIndexOf('param1=');
    var index2 = url.lastIndexOf('&param2=');
    if(index1 > -1 && index2 > -1) {
        user= url.substring(index1+7, index2);
        provider= url.substring(index2+8);
        console.log("user ins= "+user);
        console.log("prov ins= "+provider);
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept"
        );
        //res.json(insert.insertRow(user,provider));
        res.json("message : ok");
    }
    
  } catch(err) {
    console.error(`Error while getting quotes `, err.message);
    next(err);
  }
});

module.exports = router;