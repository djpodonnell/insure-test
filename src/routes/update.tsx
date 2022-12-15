const expressUpdate = require('express');
const routerUpdate = expressUpdate.Router();
const update = require('../services/hello');

/* GET quotes listing. */
routerUpdate.get('/', function(req:any, res:any, next:any) {
  try {
    var user = "";
    var provider = "";
    var count = 0;
    
    var url = req.url;
    var index1 = url.lastIndexOf('param1=');
    var index2 = url.lastIndexOf('&param2=');
    var index3 = url.lastIndexOf('&param3=');
    if(index1 > -1 && index2 > -1 && index3 > -1) {
        user= url.substring(index1+7, index2);
        provider= url.substring(index2+8,index3);
        count= url.substring(index3+8);
    }
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.json(update.updateCount(user,provider,count));
  } catch(err:any) {
    console.error(`Error while getting quotes `, err.message);
    next(err);
  }
});

module.exports = routerUpdate;