// takes the results from assets.js, extracts all the asset titles and
// creates a JSON response that can be returned to Alexa

var _ = require('underscore');

module.exports = function (hits) {
    var TitleList = [];
    hits.forEach(element => {
        let AssetTitle = {};
        let assetName = element._source.originalName;
        console.log(assetName);
        AssetTitle.name = element._source.originalName;
        AssetTitle.id = element._id;
        TitleList.push(AssetTitle);
    });
    return(TitleList);
}

