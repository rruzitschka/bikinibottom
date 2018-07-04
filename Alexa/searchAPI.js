var https = require('http');

const HOST = 'ec2-18-205-145-82.compute-1.amazonaws.com';
const PORT = 3000;
const ASSET_PATH = '/v1/alexa/assets';
const MAX_ASSETS_TO_RETURN = 5;

function getData(options, callback) {

    console.log('API Request: ' + options.host + ':' + options.port + options.path);
    
    var text = "";

    https.get(options, function (res) {
        res.on("data", function (chunk) {
            text += chunk.toString('utf-8');
        });

        res.on('end', function () {
            return callback(text);
        });
    }).on('error', function (e) {
        console.error('getData (' + options + '): ' + e.message);
        return callback('error');
    });
}

module.exports.getAssetsByName = function (queryObject, callback) {

    var path = ASSET_PATH;
    if (queryObject.q !== undefined) {
        path += '?q=' + encodeURIComponent(queryObject.q);
    }

    var options = {
        host: HOST,
        port: PORT,
        path: path,
        method: 'GET'
    };

    getData(options, function (jsondata) {
        if (jsondata === 'error') {
            callback({ code: false, speech: 'Leider ist beim Zugriff auf die Filmdatenbank ein Fehler passiert.' });
        }
        else {
            var assets = JSON.parse(jsondata);
            var speechOutput = '';
            var maxAssets = Math.min(assets.length, MAX_ASSETS_TO_RETURN);
            if (maxAssets === 0) {
                speechOutput = 'Leider konnte ich keinen Film finden.';

                if (queryObject.q !== undefined) {
                    speechOutput = 'Leider konnte ich den Film ' + queryObject.q + ' nicht finden.';
                }
                callback({ code: false, speech: speechOutput });
            }
            else {
                //maxAssets = 1;
                if (maxAssets == 1) {
                    speechOutput = 'Ich habe einen Film gefunden. ';
                }
                else {
                    speechOutput = 'Ich habe folgende Filme gefunden: ';
                }
                for (var i = 0; i < maxAssets; i++) {
                    if (assets[i].name !== undefined) {
                        speechOutput += assets[i].name;
                    }
                    if (assets[i].ProductionYear !== undefined) {
                        speechOutput += ', aus dem Jahr ' + assets[i].ProductionYear + ' ';
                        if (assets[i].actors !== undefined && assets[i].actors.length > 0) {
                            speechOutput += ' mit ';
                            for (var j = 0; j < assets[i].actors.length; j++) {
                                speechOutput += assets[i].actors[j].name + ' und ';
                            }
                            
                            speechOutput = speechOutput.substr(0, speechOutput.length - 5) + '. ';
                        }
                    }
                }
                if (maxAssets === 1) {
                    callback({ code: true, speech: speechOutput, assetCnt: maxAssets, guid: assets[0].id });
                }
                else {
                    callback({ code: true, speech: speechOutput, assetCnt: maxAssets })
                }
            }
        }
    });
}

module.exports.getAssetsByGenre = function (queryObject, callback) {

    var path = ASSET_PATH;
    if (queryObject.genre !== undefined) {
        path += '?q=genres:' + queryObject.genre.charAt(0).toUpperCase() + queryObject.genre.slice(1);
    }

    var options = {
        host: HOST,
        port: PORT,
        path: path,
        method: 'GET'
    };

    getData(options, function (jsondata) {

        if (jsondata === 'error') {
            callback({ code: false, speech: 'Leider ist beim Zugriff auf die Filmdatenbank ein Fehler passiert.' });
        }
        else {
            var assets = JSON.parse(jsondata);
            var speechOutput = '';
            var maxAssets = Math.min(assets.length, MAX_ASSETS_TO_RETURN);
            if (maxAssets === 0) {
                speechOutput = 'Leider konnte ich keine Filme finden.';

                if (queryObject.genre !== undefined) {
                    speechOutput = 'Leider konnte ich keine Film aus dem Genre ' + queryObject.genre + ' finden.';
                }
                callback({ code: false, speech: speechOutput });
            }
            else {
                speechOutput = 'Ich habe folgende Filme gefunden. ';
                for (var i = 0; i < maxAssets; i++) {
                    if (assets[i].name !== undefined) {
                        speechOutput += assets[i].name;
                    }
                    if (assets[i].ProductionYear !== undefined) {
                        speechOutput += ', aus dem Jahr ' + assets[i].ProductionYear + '. ';
                    }
                }
                if (maxAssets === 1) {
                    callback({ code: true, speech: speechOutput, assetCnt: maxAssets, guid: assets[0].id });
                }
                else {
                    callback({ code: true, speech: speechOutput, assetCnt: maxAssets })
                }
            }
        }
    });
}