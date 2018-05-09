// This function retrieves the synopsis for the asset witht the specified ID
// query parameters: lang  (language) and length (short, medium, long)
"use strict";

var request = require ('request');
var elasticSearch = require('elasticsearch');

module.exports = function(assetsID, synopsisLanguage, synopsisLength) {
 
  return new Promise(function (resolve, reject){
    
    var client = new elasticSearch.Client ({
      host: 'https://search-sve-test-bdwhx3oa447ij3yezaokfdeup4.us-east-1.es.amazonaws.com/mediaasset',
      log: 'info'
    });
  
    var hits;
    var resultSynopsis;

  
    console.log('assetID in assetsynopsis.js: ' + assetsID);
    client.search({
      body:{
        query: {
          match: {
            _id  : assetsID
          }
        }
      }
      
    }).then(function (body) {
      hits = body.hits.hits;
      resultSynopsis = hits[0]._source.mediaLangs[0].synopsis[synopsisLength];
      console.log(resultSynopsis);
      resolve(resultSynopsis);
    }, function (error) {
      console.trace(error.message);
    });
    
  })

}