// this function checks if the delivered API key is exisiting
// Int eh first prototype this is stored in an array
// later on it will persisted in a DB

const _ = require('lodash');

var apiKeys = [
    {key: '12345678',
     id: 1},
    {key: '87654321',
     id: 2}
];

module.exports = (apiKey) => {
    if (_.find(apiKeys, {key: apiKey})){   
      return(true);
    }
  console.log ('Invalid API key: ' + apiKey);
  return(false);
}