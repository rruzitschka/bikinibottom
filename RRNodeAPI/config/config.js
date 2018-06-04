// this file holds all configuration parameters for the server

module.exports = {

// this is the base URL for the Elastic Search Search Index

    ES_URL: 'https://search-sve-test-bdwhx3oa447ij3yezaokfdeup4.us-east-1.es.amazonaws.com/mediaasset',

// This parameter deifines if API key authentication is required or not. At th emoment, this is a genral 
// parameter valid for ALL requests. If set to true, a valid API key must be included for all requests.
// if set to false, the API is not validated.

    API_KEY_REQUIRED: false

}