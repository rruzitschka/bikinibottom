// This function retrieves the synopsis for the asset witht the specified ID
// query parameters: lang  (language) and length (short, medium, long)
"use strict";



var mediaLangIndex = require('../findlangindex.js');
var request = require ('request');
var elasticSearch = require('elasticsearch');
var getAssetbyID = require('./assetid.js');

module.exports = function(assetID, synopsisLanguage) {
 
  return new Promise(function (resolve, reject){
   
   getAssetbyID(assetID)
   .then(function (hits) {

    let mediaLangs = hits[0]._source.mediaLangs;
    let langIndex = mediaLangIndex(mediaLangs,synopsisLanguage);
    let resultSynopsis;

    // fetch proper synopsis attribute from object
    resultSynopsis = hits[0]._source.mediaLangs[langIndex].synopsis;
    
    // resolve promise with synopsis array  
    resolve(resultSynopsis);  

   }).catch(function(error){

    reject(error);
   });
    
   


  })

}