// This function retrieves the actors for the asset with the specified ID
// query parameters: lang  (language) 
"use strict";

var request = require ('request');
var elasticSearch = require('elasticsearch');
var mediaLangIndex = require('../findlangindex.js');
var getAssetbyID = require('./assetid.js');

module.exports = function(assetID, language) {
 
  return new Promise(function (resolve, reject){
   
  getAssetbyID(assetID)
  .then(function (hits) {
 
     // store the mediaLang JSON array    

      let mediaLangs = hits[0]._source.mediaLangs;
      let langIndex = mediaLangIndex(mediaLangs,language);
      let resultActors;


    // fetch proper actors array from object

      resultActors = hits[0]._source.mediaLangs[langIndex].actors;
      console.log(resultActors);
    // resolve promise with actors array  
      resolve(resultActors);
    })
 .catch(function(error) {
     reject(error);
 });
    
})

}