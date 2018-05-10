// This function retrieves the actors for the asset witht the specified ID
// query parameters: lang  (language) 
"use strict";

var request = require ('request');
var elasticSearch = require('elasticsearch');
var mediaLangIndex = require('../findlangindex.js');

module.exports = function(assetsID, synopsisLanguage) {
 
  return new Promise(function (resolve, reject){
   
    //create ElasticSearch Client

    var client = new elasticSearch.Client ({
      host: 'https://search-sve-test-bdwhx3oa447ij3yezaokfdeup4.us-east-1.es.amazonaws.com/mediaasset',
      log: 'info'
    });
  
    var hits;
    var resultActors;

  
    console.log('assetID in assetactors.js: ' + assetsID);

//create asynchronuous search request that looks for the asset with the proper assetID

    client.search({
      body:{
        query: {
          match: {
            _id  : assetsID
          }
        }
      }
      
    }).then(function (body) {
     // store all hits found in the body, in this case it should be just one
     
        hits = body.hits.hits;
     
     // store the mediaLang JSON array    

      let mediaLangs = hits[0]._source.mediaLangs;
      let langIndex = mediaLangIndex(mediaLangs,synopsisLanguage);



    // fetch proper actors array from object

      resultActors = hits[0]._source.mediaLangs[langIndex].actors;
      console.log(resultActors);
    // resolve promise with synopsis array  
      resolve(resultActors);
    }, function (error) {
      console.trace(error.message);
    });
    
  })

}