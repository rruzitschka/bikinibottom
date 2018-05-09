
var request = require ('request');
var elasticSearch = require('elasticsearch');

//initalize the elastic search client


module.exports = function(queryString) {

  var client = new elasticSearch.Client ({
    host: 'https://search-sve-test-bdwhx3oa447ij3yezaokfdeup4.us-east-1.es.amazonaws.com/mediaasset/',
    log: 'trace'
  });

  client.search({
    q: queryString
  }).then(function (body) {
    var hits = body.hits.hits;
    console.log(hits);
  }, function (error) {
    console.trace(error.message);
  });

  return hits;
 
 /* 
  return new Promise (function (resolve, reject){  
    var encQueryString = encodeURI(queryString);
    var url = 'https://search-sve-test-bdwhx3oa447ij3yezaokfdeup4.us-east-1.es.amazonaws.com/mediaasset/_search?' +'q=' + encQueryString;

    console.log('In assets function');
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
}