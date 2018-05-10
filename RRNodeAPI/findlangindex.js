// finds the index of the appropriate mediaLang element in the media lang array and retruns it
//called with the medialang array and the requested language

module.exports = function(mediaLangArray, requestedLang) {

    var i = 0;
    var langIndex;
    var found = false;
    // iterate through mediaLang array to find the proper index number for the requested synopsis language
    // if match is found, store index value
    for(i; i < mediaLangArray.length; i++){
        if(mediaLangArray[i].langID === requestedLang){
            langIndex = i;
            found = true;
        }

    }
    // if no match is found, use language with index 0 as default
    if (found !== true){
        langIndex = 0;
    }
    console.log('Lang index in findlangindex.js'+langIndex);
    return(langIndex);
}