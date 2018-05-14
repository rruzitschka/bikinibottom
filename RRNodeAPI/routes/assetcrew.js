// This function retrieves the crew for the asset with the specified ID
// query parameters: lang  (language) 
"use strict";

var request = require ('request');
var elasticSearch = require('elasticsearch');
var mediaLangIndex = require('../findlangindex.js');
var getAssetbyID = require('./assetid.js');

module.exports = function(assetID, language) {
 
  return new Promise(function (resolve, reject){
   
    getAssetbyID(assetID, language)
    .then(function (hits) {

     // store the mediaLang JSON array    
      let resultCrew;
      let mediaLangs = hits[0]._source.mediaLangs;

    // find the mediaLang array index number of the requested language
      let langIndex = mediaLangIndex(mediaLangs,language);

    // fetch proper crew array from object

      resultCrew = hits[0]._source.mediaLangs[langIndex].crew;
      console.log(resultCrew);
    // resolve promise with crew array  
      resolve(resultCrew);
    })
    .catch (function (error) {
      reject(error);
    });
    
  })

}