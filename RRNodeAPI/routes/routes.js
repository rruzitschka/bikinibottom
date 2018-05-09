var assets = require('./assets.js');
var assetid = require('./assetid.js');


var appRouter = function (app) {



  app.get("/", function (req, res) {
    res.status(200).send({ message: 'Welcome to our bikinibottom API' });
  });

  app.get("/v1/assets", function (req, res) {
    console.log('in routes.js assets service called');
    //req.query.q gives access to the value of the q parameter in the URL
    let queryString=req.query.q;
   
    console.log('in routes.js' + assets(queryString));
    
    assets(queryString).then(function(data) {
      console.log('Hits found:'+ data.length);
      res.status(200).send(data);
    })
    .catch( function() {
      console.log('Promise catched');
    })

  });
 
  
  app.get("/v1/assets/:id", function (req, res) {
    console.log('in routes.js assets/id service called');
    //req.params.id gives access to the value of the id parameter in the URL
    let assetId=req.params.id;
    console.log('asset id:'+ assetId);
    //this calls the assetID function
    assetid(assetId).then(function(data) {
      res.status(200).send(data);
    })
    .catch( function() {
      console.log('Promise catched');
    })
   
  });

}

module.exports = appRouter;