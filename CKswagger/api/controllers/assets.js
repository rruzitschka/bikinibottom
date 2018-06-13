'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */

const devDebug = require('debug')('app:dev');
var util = require('util');
const es = require('./elasticsearch'); // fetch elasticsearch API

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  getAssetById: getAssetById,
  searchAssets: searchAssets
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function getAssetById(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  console.log('getAssetById() entered');
  var id = req.swagger.params.id.value || null;
  if ( id == null ) {
    // error
    res.status(400).json({ message : 'Asset id missing!'});
    return;
  }
  es.getMediaAssetById(id, (error,document) => {
    // this sends back the document as a JSON object which is a single string
    console.log('runs getMediaAssetbyId callback() with error:',error,'document:', typeof document);
    if (error) {
        res.status(error.HTTPCode).json( { message: error.message } );
        // res.status(404).send(error);
    }
    else {
      res.json(document);
    }
  });

}

function searchAssets(req, res) {
  console.log('searchAssets() entered');
  var query = req.swagger.params.q.value || null;
  console.log(`q=${query}`);
  if ( query == null ) {
    // error in request
    res.status(400).json({ message : 'Bad Request'});
    return;
  }
  es.searchAssets(query,(err,document) => {
    if (err) {
      res.status(err.HTTPCode).json({message: err.message});
    }
    else {
      // ok
      devDebug('searchAssets: document:',document);
      res.json(document);
    }
  });
}
