// This middleware checks if the API key is valid
// the API key is in the Authentication header
const validAPIkey = require('./validapikey.js')
const API_KEY_REQUIRED = require('../config/config.js').API_KEY_REQUIRED;
const _= require('lodash');

module.exports = (req, res, next) => {
    
     // check if Authentication header exists

    let apiKey;
    if(API_KEY_REQUIRED){

        if(req.header('Authentication')){
            apiKey = req.header('Authentication');
        } else {
            return res.status(400).json('API key is missing')
        }
        
        // check if Value of authentication header is valid by calling validAPIkey()
        // if not ok then return 400 response
        // if it exists continue..
        if (!validAPIkey(apiKey)){
            return res.status(400).json('No valid API key');
        }
    }

    next();

}