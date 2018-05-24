
// fetches the list of matching assets based on the query string from ElasticSearch

var request = require ('request');
var elasticSearch = require('elasticsearch');
var ESIndexURL = require('./indexURL.js').ES_URL;
var formatAlexa = require ('./assets_alexa');
var _ = require('underscore');

//initalize the elastic search client


module.exports = function(queryParams, format) {

  return new Promise(function (resolve, reject){
    
    var client = new elasticSearch.Client ({
      host: ESIndexURL,
      log: 'info'
    });
  
   var queryString = '';
   var synopsisFlag = false;
   
  if (queryParams.hasOwnProperty('q') && _.isString(queryParams.q)){
    queryString = queryParams.q;
  }

  if (queryParams.hasOwnProperty('synopsis') && queryParams.synopsis === 'true'){
    synopsisFlag= true;
  } 

    var hits;
  //edit
    console.log('querystring in assets.js: '+queryString);
    console.log('format in assets.js: '+ format);
    client.search({
      q: queryString,
      _sourceExclude: '*relatedAssets'
    }).then(function (body) {
      hits = body.hits.hits;
      //console.log("Hits in Assets.js" + hits);
      if (format !== 'alexa'){
             resolve(hits); 
      } else {
        resolve(formatAlexa(hits, synopsisFlag));
      }

    }, function (error) {
      console.trace(error.message);
    });
    
  })
  
 

}