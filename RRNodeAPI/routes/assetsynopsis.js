// This function retrieves the synopsis for the asset witht the specified ID
// query parameters: lang  (language) and length (short, medium, long)
"use strict";

var request = require ('request');
var elasticSearch = require('elasticsearch');

module.exports = function(assetsID, synopsisLanguage) {
 
  return new Promise(function (resolve, reject){
   
    //create ElasticSearch Client

    var client = new elasticSearch.Client ({
      host: 'https://search-sve-test-bdwhx3oa447ij3yezaokfdeup4.us-east-1.es.amazonaws.com/mediaasset',
      log: 'info'
    });
  
    var hits;
    var resultSynopsis;

  
    console.log('assetID in assetsynopsis.js: ' + assetsID);

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
      let i = 0;
      let langIndex;
      let found = false;
    // iterate through mediaLang array to find the proper index number for the requested synopsis language
    // if match is found, store index value
      for(i; i < mediaLangs.length; i++){
          if(mediaLangs[i].langID === synopsisLanguage){
              langIndex = i;
              found = true;
          }

      }
    // if no match is found, use language with index 0 as default
      if (found !== true){
          langIndex = 0;
      }

    // fetch proper synopsis attribute from object

      resultSynopsis = hits[0]._source.mediaLangs[langIndex].synopsis;
      console.log(resultSynopsis);
    // resolve promise with synopsis array  
      resolve(resultSynopsis);
    }, function (error) {
      console.trace(error.message);
    });
    
  })

}