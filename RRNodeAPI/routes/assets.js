
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
   
    // check if the query parmeter is separated by a colon 
    // this means there is a specific attribute required and a spcific value for this attribute should be searched
    // if this is not valid, the query attribute will default to orignalName 
    // this will only be used if the exactMatch parameter is set
    // exact match can only be used to match for specific given attributes

    if(queryStringParsed.length === 2){
      if(_.isString(queryStringParsed[0]) && queryStringParsed[0].length > 0){
        queryAttribute = queryStringParsed[0];
      } else{
        queryAttribute = 'originalName';
      }
      if(_.isString(queryStringParsed[1]) && queryStringParsed[1].length > 0){
        queryValue = queryStringParsed[1];
      } else{
        queryValue = queryString;
      }

    } else {
      queryAttribute = 'originalName';
      queryValue = queryString;
    } 

  }

  if (queryParams.hasOwnProperty('exactMatch') && queryParams.exactMatch === 'true'){
    exactMatch = true;
  } 

    var hits;
    var query = {};
    console.log(queryAttribute);
    console.log(queryValue);

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
    console.log(JSON.stringify(query));
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