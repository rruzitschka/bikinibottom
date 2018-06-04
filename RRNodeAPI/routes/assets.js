
// fetches the list of matching assets based on the query string from ElasticSearch

var request = require ('request');
var elasticSearch = require('elasticsearch');
var ESIndexURL = require('../config/config.js').ES_URL;
var formatAlexa = require ('./assets_alexa');
var _ = require('lodash');

//initalize the elastic search client


module.exports = function(queryParams, format) {

  return new Promise(function (resolve, reject){
    
    var client = new elasticSearch.Client ({
      host: ESIndexURL,
      log: 'info'
    });
  
   var queryString = '*';
   var exactMatch = false; 
   var queryStringParsed = [];
   var queryAttribute;
   var queryValue;
   
  if (queryParams.hasOwnProperty('q') && _.isString(queryParams.q)){
    queryString = queryParams.q;
    queryStringParsed = _.split(queryString, ':');
    queryAttribute = queryStringParsed[0];
    queryValue = queryStringParsed[1];
  }

  if (queryParams.hasOwnProperty('exactMatch') && queryParams.exactMatch === 'true'){
    exactMatch = true;
  } 

    var hits;
    var query = {};

    if(exactMatch){
      query = {
          body: {
            query:{
             match_phrase: {
               // this dynamically sets the search attribute - ES6 syntax
              [queryAttribute]: queryValue
              } 
            }  
          },
          _sourceExclude: '*relatedAssets'
        };

    } else {
      query = {
        q: queryString,
        _sourceExclude: '*relatedAssets'
      }
    }

    client.search(query)
    .then(function (body) {
      hits = body.hits.hits;
      console.log("Hits in Assets.js" + hits);
      if (format !== 'alexa'){
             resolve(hits); 
      } else {
        resolve(formatAlexa(hits));
      }

    }, function (error) {
      console.trace(error.message);
    });
    
  })
  
 

}