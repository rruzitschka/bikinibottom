'use strict';
const devDebug = require('debug')('app:dev');

// exported functions
module.exports = { 
  getMediaAssetById: getMediaAssetById,
  searchAssets : searchAssets
};

// implement interface to elastic search

// address of the elastic search host
const esHost = process.env.ES_HOST || 'https://search-sve-test-bdwhx3oa447ij3yezaokfdeup4.us-east-1.es.amazonaws.com';
// const esHost = process.env.ES_HOST || 'https://arch-sve-test-bdwhx3oa447ij3yezaokfdeup4.us-east-1.es.amazonaws.com';
const esIndex = process.env.ES_INDEX || 'mediaasset';
const request = require('request');

// exported function
function getMediaAssetById(id,callback) {
  // fetch a dedicated asset from ES
  // id ... does contain the assetID to be fetched
  // callback() is called with:
  //  error ... in case of an error error.HTTPCode & .message are set
  //  document ... in case of success, contains the found asset document
  id = id || 'undefined';
  let requestURL = esHost + '/' + esIndex + '/_doc/' + id + '?pretty';

  request(requestURL, function(error,resp,body) {
    let document;
    if (error) {
      // error: has to be an internal issue - 500
      console.log('error:', error);
      error.HTTPCode=500;
    }
    else {
      // ok
      console.log('statusCode:', resp && resp.statusCode);
      if ( resp.statusCode === 200) {
        // ok
        document = JSON.parse(body);
        if ('_source' in document) {
          console.log('_source found in response of ES!');
          document=document._source; // return just the relevant document only
          console.log('document:',JSON.stringify(document,null,'\t'));
        }
        else {
          // error: prepare error object
          error = { 
              message : 'Document _source not found!',
              HTTPCode : 404
          };
          document = null; // not a valid document
        }
      }
      else {
        // error: document not found, prepare error object
        error = { 
          message : 'Document not found!',
          HTTPCode : 404
        };
      }
    }
    console.log('getMediaAssetById: call callback() with error: ',typeof error,'document:',typeof document);
    callback(error,document); // continue with workflow
  } );
}

// exported function
function searchAssets(query,callback){
  // does a fuzzy search for assets from ES
  // query ... contains the search string in format str1&str2...&strn
  // callback() is called with:
  //  error ... in case of an error error.HTTPCode & .message are set
  //  assets ... in case of success, contains the found array of assets
  query = query || '__undefined__';
  let reqURL = esHost + '/' + esIndex + '/_search?q=' + query + '&pretty';
  devDebug('reqURL:',reqURL);
  _ESrequest(reqURL,callback)
    .then(doc => {
      if (doc.hits.total > 0) {
        let assets = []; // target list of assets
        devDebug('searchAssets: document.hits.total:',doc.hits.total);
        for (let i=0;i<doc.hits.total;i++)
          // add just the _source to the array!
          assets.push(doc.hits.hits[i]._source);
        callback(undefined,assets); // return the asset array
      }
      else {
        let err = new Error('No documents found!');
        err.HTTPCode=404;
        callback(err,null);
      }
    })
    .catch(err=>{
      err.HTTPCode=404; 
      callback(err,null);
    });
}

function _ESrequest(reqURL, callback) {
  return new Promise( (resolve,reject) => {
    // execute async task
    request(reqURL, (err,resp,body) => {
      let document;
      if (err) {
        reject(err);
      }
      else {
        devDebug('_ESrequest: body:',body);
        document = JSON.parse(body);
        resolve(document);
      }
    })
  });

}


