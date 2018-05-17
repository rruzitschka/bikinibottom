
// This searches for an asset with a specific ID


var request = require ('request');
var elasticSearch = require('elasticsearch');
var ESIndexURL = require('./indexURL.js').ES_URL;

module.exports = function(assetsID) {
 
  return new Promise(function (resolve, reject){
    
    var client = new elasticSearch.Client ({
      host: ESIndexURL,
      log: 'info'
    });
  
    var hits;
  
    client.search({
      body:{
        query: {
          match: {
            _id  : assetsID
          }
        }
      }   
    })
    .then(function (body) {
      hits = body.hits.hits;
      if(hits.length !== 0){
        resolve(hits);
      } else {
        reject('Asset with ID not found');
      }

    }, function (error) {
      console.trace(error.message);
    });
    
  })
  
 

}

