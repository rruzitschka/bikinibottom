
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
  
    console.log('assetID in assetsID.js: ' + assetsID);
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
        console.log("Hits in AssetID.js:" + hits);
        resolve(hits);
      } else {
        reject('Asset with IF not found');
      }

    }, function (error) {
      console.trace(error.message);
    });
    
  })
  
 

}

