const expressHello:any = require('express');
const routerHello:any = expressHello.Router();
const insert = require('../services/hello');

/* GET quotes listing. */
routerHello.get('/', function(req:any, res:any, next:any) {
  try {
    var user = "";
    var provider = "";
    
    var url = req.url;
    var index1 = url.lastIndexOf('param1=');
    var index2 = url.lastIndexOf('&param2=');
    if(index1 > -1 && index2 > -1) {
        user= url.substring(index1+7, index2);
        provider= url.substring(index2+8);
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept"
        );
        res.json(insert.insertRow(user,provider));
    }
    
  } catch(err:any) {
    console.error(`Error while getting quotes `, err.message);
    next(err);
  }
});

module.exports = routerHello;