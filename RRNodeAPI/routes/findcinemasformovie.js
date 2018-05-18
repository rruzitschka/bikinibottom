// this function takes the voice input from alexa, and tries to find a matching movie from ElasticSearch
// then it calls the movieshowtimes API and retrives cinemas for the movie
// result should be a JSON object that include strings digestible from Alexa.

// parameters movieString: the parameter delivered from Alexa Voice recognition.




var request = require ('request');
var elasticSearch = require('elasticsearch');
var ESIndexURL = require('./indexURL.js').ES_URL;

//initalize the elastic search client


module.exports = function(movieString, Country, City, dayRange, timeRange) {
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

  return('Terminator 1 wird heute im Apollo Kino um 19h gespielt');
 

}