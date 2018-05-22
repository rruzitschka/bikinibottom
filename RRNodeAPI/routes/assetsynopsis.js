// This function retrieves the synopsis for the asset witht the specified ID
// query parameters: lang  (language) and length (short, medium, long)
"use strict";

var mediaLangIndex = require('../findlangindex.js');
var request = require ('request');
var elasticSearch = require('elasticsearch');
var getAssetbyID = require('./assetid.js');
var _ = require('underscore');

module.exports = function(assetID, synopsisLanguage) {
 
  return new Promise(function (resolve, reject){
   
   getAssetbyID(assetID)
   .then(function (hits) {

    let mediaLangs = hits[0]._source.mediaLangs;
    let timeStamp1 = Date.now();
    let resultSynopsis;


    resultSynopsis = _.findWhere(mediaLangs, {langId : synopsisLanguage}).synopsis;
    console.log(Date.now() - timeStamp1);
    resolve(resultSynopsis);  

   }).catch(function(error){

    reject(error);
   });

  })

}