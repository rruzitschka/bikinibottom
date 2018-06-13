// this function returns the list of available genres
// just a mock currently
"use strict";

var request = require ('request');
var elasticSearch = require('elasticsearch');
var ESIndexURL = require('../config/config.js').ES_URL;



module.exports = function() {
  /*
  return new Promise(function (resolve, reject){
    
    var client = new elasticSearch.Client ({
      host: ESIndexURL,
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
      //console.log("Hits in Assets.js" + hits);
      resolve(hits);
    }, function (error) {
      console.trace(error.message);
    });
    
  })
  */
 return new Promise(function (resolve, reject) {

    resolve({"genres": ["Action", "Comedy", "Drama", "Kids", "Thriller", "Music", "Musical", "Theater", "Horror", 
    "Documentation", "Biography", "History", "Science Fiction"]});


 });
  
 

}