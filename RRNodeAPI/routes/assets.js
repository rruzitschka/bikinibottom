
var request = require ('request');
var elasticSearch = require('elasticsearch');

//initalize the elastic search client


module.exports = function(queryString) {

  return new Promise(function (resolve, reject){
    
    var client = new elasticSearch.Client ({
      host: 'https://search-sve-test-bdwhx3oa447ij3yezaokfdeup4.us-east-1.es.amazonaws.com/mediaasset',
      log: 'info'
    });
  
    var hits;
  //edit
    console.log('querystring in assets.js: '+queryString);
    client.search({
      q: queryString,
      _sourceExclude: '*relatedAssets'
    }).then(function (body) {
      hits = body.hits.hits;
      console.log("Hits in Assets.js" + hits);
      resolve(hits);
    }, function (error) {
      console.trace(error.message);
    });
    
  })
  
 

}