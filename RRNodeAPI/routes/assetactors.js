// This function retrieves the actors for the asset with the specified ID
// query parameters: lang  (language) 
"use strict";

var request = require ('request');
var getAssetbyID = require('./assetid.js');
var _ = require ('underscore');

module.exports = function(assetID, language) {
 
  return new Promise(function (resolve, reject){
   
  getAssetbyID(assetID)
  .then(function (hits) {
 
     // store the mediaLang JSON array    

      let mediaLangs = hits[0]._source.mediaLangs;
      let resultActors;


    // fetch proper actors array from object

      resultActors = _.findWhere(mediaLangs, {langId : language}).actors;
      console.log(resultActors);
    // resolve promise with actors array  
      resolve(resultActors);
    })
 .catch(function(error) {
     reject(error);
 });
    
})

}