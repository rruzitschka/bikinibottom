// takes the results from assets.js, extracts all the asset titles and
// creates a JSON response that can be returned to Alexa

var _ = require('underscore');

module.exports = function (hits, synopsisFlag) {
    var TitleList = [];
    hits.forEach(element => {
        let AssetTitle = {};
        if(synopsisFlag === true){
            AssetTitle.name = element._source.originalName;
            AssetTitle.language = element._source.mediaLangs[0].langId;
            AssetTitle.synopsis = element._source.mediaLangs[0].synopsis.long;
            AssetTitle.id = element._id;
 


         } else {
            
            let actorsArray = element._source.mediaLangs[0].actors;
            let actorsNameArray = [];
            AssetTitle.name = element._source.originalName;
            AssetTitle.language = element._source.mediaLangs[0].langId;
            AssetTitle.ProductionYear = element._source.productionYear;
            actorsArray.forEach((actor) => {
                console.log (_.pick(actor, 'name'));
                actorsNameArray.push(_.pick(actor, 'name'));
            });
            AssetTitle.actors = actorsNameArray;
            AssetTitle.id = element._id;
            console.log(AssetTitle.actors);
 


      }
     
      TitleList.push(AssetTitle);

    });
    return(TitleList);
}

