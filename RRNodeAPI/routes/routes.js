var assets = require('./assets.js');
var assetid = require('./assetid.js');
var assetSynopsis = require('./assetsynopsis.js');
var assetActors = require('./assetactors.js');
var assetCrew = require('./assetcrew.js');
var genres = require('./genres.js');
var findLangIndex = require ('../findlangindex.js');
var findcinemasformovie = require('./findcinemasformovie');

var _ = require('lodash');




var appRouter = function (app) {



  app.get("/", function (req, res) {
    res.status(200).send({ message: 'Welcome to our bikinibottom API' });
  });


//generic assets search


  app.get("/v1/assets", function (req, res) {

    //req.query.q gives access to the value of the q parameter in the URL
    let queryString=req.query.q;
    let format = req.query.format;
    let queryParams=req.query;
   
    console.log('Assets requested with query string: ' + queryString);
    
    assets(queryParams, '').then(function(data) {
  
        res.status(200).send(data);
 
    })
    .catch( function() {
      console.log('Promise catched');
    })

  });
 
 // get an asset with a specific assetID 
  
  app.get("/v1/assets/:id", function (req, res) {
 
    //req.params.id gives access to the value of the id parameter in the URL
    let assetId=req.params.id;
    console.log('Asset Data requested for Asset with asset id: '+ assetId);
    //this calls the assetID function
    assetid(assetId).then(function(data) {
      if(!data) {
        res.status(404).send('Asset not found');
      } else {
        res.status(200).send(data);
      }
    })
    .catch( function(error) {
      console.log('Promise catched');
      res.status(404).send(error);
    })
  });


 // get the synopsis for an asset with a specific assetID

  app.get("/v1/assets/:id/synopsis", function (req, res) {

    //req.params.id gives access to the value of the id parameter in the URL
    let assetId=req.params.id;
    // parameters lang and length hold the desired language 
    let synopsisLang = req.query.lang;
    
    console.log('Synopsis Data requested for Asset with asset id: '+ assetId);

    // set defaults in case parameters are not given

    if (synopsisLang === undefined){
      synopsisLang = "en";
    }

    //this calls the assetID function
    assetSynopsis(assetId, synopsisLang)
    .then(function(data) {

      if(!data) {
        res.status(404).send('Asset not found');
      } else {
        res.status(200).send(data);
      }
    })
    .catch( function() {
      console.log('Promise catched');
    })
   
  });

// get the actors for an asset with a specific asset ID


  app.get("/v1/assets/:id/actors", function (req, res) {

    //req.params.id gives access to the value of the id parameter in the URL
    let assetId=req.params.id;
    // parameters lang and length hold the desired language 
    let actorsLang = req.query.lang;

    // set defaults in case parameters are not given

    console.log('Actor Data requested for Asset with asset id: '+ assetId);
    if (actorsLang === undefined){
      actorsLang = "en";
    }

    //this calls the assetID function
    assetActors(assetId, actorsLang)
    .then(function(data) {
      if(data.length > 0) {
        res.status(200).send(data);
      } else {
        res.status(404).send('Asset not found');
      }
    })
    .catch( function() {
      console.log('Promise catched');
    })
  });


 // get the crew for an asset with a specific asset ID

    app.get("/v1/assets/:id/crew", function (req, res) {
      //req.params.id gives access to the value of the id parameter in the URL
      let assetId=req.params.id;
      // parameters lang and length hold the desired language 
      let crewLang = req.query.lang;
      
      // set defaults in case parameters are not given
      console.log('Crew Data requested for Asset with asset id: '+ assetId);
      if (crewLang === undefined){
        crewLang = "en";
      }

      //this calls the assetID function
      assetCrew(assetId, crewLang)
      .then(function(data) {
        if(data.length > 0) {
        res.status(200).send(data);
      } else {
        res.status(404).send('Asset not found');
      }
      })
      .catch( function() {
        console.log('Promise catched');
      })


});

  // get the showtimes for a movie, details are in the query string:
  // q=<movieString> name of the movie to seek for the showtimes
  // country=AT      seeks in Austria
  // city=Wien       seeks for acertain city only
  // na: dayrange=1      seeks for today only
  // na: timeRange=16-20 seeks for start of movie between 16h-20h
  app.get("/v1/showtimes", async function (req, res) {
    const movieString = req.query.q;
    const city = req.query.city;
    const country = req.query.country;
    if (movieString===undefined || city===undefined ) {
      // error
      res.status(400).send('The query parameters "q" and "city" are mandatory!');
    }  
    try {
      const response = await findcinemasformovie(movieString, country, city);
      res.send(response);
      return;  
    }
    catch(err) {
      const HTTPCode = err.HTTPCode || 500;
      res.status(HTTPCode).send(err.message);
    }
  });


// Alexa API

app.get("/v1/alexa/assets", function (req, res) {

  //req.query.q gives access to the value of the q parameter in the URL
  let queryParams=req.query;
 
  //console.log('Assets requested with query string: ' + queryString);
  
  assets(queryParams, 'alexa').then(function(data) {

      res.status(200).send(data);

  })
  .catch( function() {
    console.log('Promise catched');
  })

});


app.get("/v1/alexa/genres", function (req, res) {

  genres().then(function(data) {

      res.status(200).send(data);

  })
  .catch( function() {
    console.log('Promise catched');
  })

});

}

module.exports = appRouter;