
var request = require ('request');
var elasticSearch = require('elasticsearch');

module.exports = function(assetsID) {
 
  return new Promise(function (resolve, reject){
    
    var client = new elasticSearch.Client ({
      host: 'https://search-sve-test-bdwhx3oa447ij3yezaokfdeup4.us-east-1.es.amazonaws.com/mediaasset',
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
      console.log("Hits in AssetID.js" + hits);
      resolve(hits);
    }, function (error) {
      console.trace(error.message);
    });
    
  })
  
 

}

