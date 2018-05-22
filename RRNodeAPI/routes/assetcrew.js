// This function retrieves the crew for the asset with the specified ID
// query parameters: lang  (language) 
"use strict";

var request = require ('request');
var getAssetbyID = require('./assetid.js');
var _ = require('underscore');

module.exports = function(assetID, language) {
 
  return new Promise(function (resolve, reject){
   
    getAssetbyID(assetID, language)
    .then(function (hits) {

     // store the mediaLang JSON array    
      let resultCrew;
      let mediaLangs = hits[0]._source.mediaLangs;
    
    // fetch proper crew array from object
      resultCrew = _.findWhere(mediaLangs, {langId : language}).crew;
      console.log(resultCrew);
    // resolve promise with crew array  
      resolve(resultCrew);
    })
    .catch (function (error) {
      reject(error);
    });
    
  })

}