
var request = require ('request');
var elasticSearch = require('elasticsearch');

module.exports = function(assetsID) {
 
  return new Promise(function (resolve, reject){
    
    var client = new elasticSearch.Client ({
      host: 'https://search-sve-test-bdwhx3oa447ij3yezaokfdeup4.us-east-1.es.amazonaws.com/mediaasset',
      log: 'info'
    });
  
    var hits;
  //edit
    console.log('assetID in assetsID.js: ' + assetsID);
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
      console.log("Hits in AssetID.js" + hits);
      resolve(hits);
    }, function (error) {
      console.trace(error.message);
    });
    
  })
  
 

}


 /* 
  return new Promise (function (resolve, reject){  
    var encAssetsID = encodeURI(assetsID);
    var url = 'https://search-sve-test-bdwhx3oa447ij3yezaokfdeup4.us-east-1.es.amazonaws.com/mediaasset/_search?' +'q=' + encAssetsID;

    console.log('In assets/ID function');
    console.log(url);

    request({url: url, json: true},
      function(error, response, body){
        if (error) {
          console.log('Error');
          reject(error);
        } else {
          // check if return code is 200 otherwise reject promise...
          if(response.statusCode === 200){ 
             console.log('resolve');
             console.log(body.hits.hits);
             let resultsArray = body.hits.hits;
             console.log('nr of found results:'+ resultsArray.length);
             resolve(body.hits.hits);
          } else {
            console.log('return code' + response.statusCode);
            reject(error);
          }
         
          //console.log(JSON.stringify(body, null, 4));
        }
      });
   
    
  });
*/
