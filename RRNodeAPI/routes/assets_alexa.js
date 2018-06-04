// takes the results from assets.js, extracts all the asset titles and
// creates a JSON response that can be returned to Alexa
// The response will include also the short form of the sysnopsis

var _ = require('lodash');

module.exports = function (hits) {
    var TitleList = [];
    hits.forEach(element => {
        let AssetTitle = {};
  
            let actorsArray = element._source.mediaLangs[0].actors;

            let actorsNameArray = [];
            AssetTitle.genres = [];
            AssetTitle.actors=[];

            AssetTitle.name = element._source.originalName;
            AssetTitle.language = element._source.mediaLangs[0].langId;
            AssetTitle.ProductionYear = element._source.productionYear;
            // check if assets actors array is not empty
            if(actorsArray !== undefined && actorsArray.length > 0 ){
                            actorsArray.forEach((actor) => {
                            console.log (_.pick(actor, 'name'));
                            actorsNameArray.push(_.pick(actor, 'name'));
                  });
                AssetTitle.actors = actorsNameArray;
            }

            if(element._source.hasOwnProperty('genres')){
                AssetTitle.genres = element._source.genres;
            }
            AssetTitle.id = element._id;
            AssetTitle.synopsis = element._source.mediaLangs[0].synopsis.short;

      
     
      TitleList.push(AssetTitle);

    });
    return(TitleList);
}

