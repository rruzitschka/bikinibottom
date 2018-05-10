var assets = require('./assets.js');
var assetid = require('./assetid.js');
var assetSynopsis = require('./assetsynopsis.js');
var assetActors = require('./assetactors.js');
var assetCrew = require('./assetcrew.js');
var findLangIndex = require ('../findlangindex.js');


var appRouter = function (app) {



  app.get("/", function (req, res) {
    res.status(200).send({ message: 'Welcome to our bikinibottom API' });
  });


//generic assets search


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
 
 // get an asset with a specific assetID 
  
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


 // get the synopsis for an asset with a specific assetID

  app.get("/v1/assets/:id/synopsis", function (req, res) {
    console.log('in routes.js assets/id service called');
    //req.params.id gives access to the value of the id parameter in the URL
    let assetId=req.params.id;
    // parameters lang and length hold the desired language 
    let synopsisLang = req.query.lang;
    

    // set defaults in case parameters are not given

    if (synopsisLang === undefined){
      synopsisLang = "en";
    }

 

    console.log('asset id:'+ assetId);
    console.log('Synopsis Language Param: '+ synopsisLang);
    //this calls the assetID function
    assetSynopsis(assetId, synopsisLang)
    .then(function(data) {
      res.status(200).send(data);
    })
    .catch( function() {
      console.log('Promise catched');
    })
   
  });

// get the actors for an asset with a specific asset ID


  app.get("/v1/assets/:id/actors", function (req, res) {
    console.log('in routes.js assets/id service called');
    //req.params.id gives access to the value of the id parameter in the URL
    let assetId=req.params.id;
    // parameters lang and length hold the desired language 
    let actorsLang = req.query.lang;

    // set defaults in case parameters are not given

    if (actorsLang === undefined){
      actorsLang = "en";
    }

    console.log('asset id:'+ assetId);
    console.log('Actors Language Param: '+ actorsLang);
    //this calls the assetID function
    assetActors(assetId, actorsLang)
    .then(function(data) {
      res.status(200).send(data);
    })
    .catch( function() {
      console.log('Promise catched');
    })
  });


 // get the crew for an asset with a specific asset ID

    app.get("/v1/assets/:id/crew", function (req, res) {
      console.log('in routes.js assets/id service called');
      //req.params.id gives access to the value of the id parameter in the URL
      let assetId=req.params.id;
      // parameters lang and length hold the desired language 
      let crewLang = req.query.lang;
      
  
      // set defaults in case parameters are not given
  
      if (crewLang === undefined){
        crewLang = "en";
      }

  
      console.log('asset id:'+ assetId);
      console.log('Crew Language Param: '+ crewLang);
      //this calls the assetID function
      assetCrew(assetId, crewLang)
      .then(function(data) {
        res.status(200).send(data);
      })
      .catch( function() {
        console.log('Promise catched');
      })


});


}

module.exports = appRouter;