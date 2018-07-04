'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = 'amzn1.ask.skill.9c093dfa-0fc5-4939-875f-31e2e9de1239';

var simpleIntents = require('./intents');
var searchAPI = require('./searchAPI');

const handlers = {
    'LaunchRequest': function () {
        this.response.speak(simpleIntents.filmOnkelHandler('Welcome'));
        this.response.listen(simpleIntents.answerHandler('Default'));
        this.emit(':responseReady');
    },
    'SessionEndedRequest' : function() {
        // do nothing;
    },
    'AMAZON.StopIntent' : function() {
        this.emit(':tell', simpleIntents.filmOnkelHandler('Stop') + simpleIntents.goodByeHandler());
    },
    'AMAZON.CancelIntent' : function() {
        this.emit(':tell', simpleIntents.filmOnkelHandler('Stop')  + simpleIntents.goodByeHandler());
    },
    'AMAZON.HelpIntent': function () {    
        this.response.speak(simpleIntents.filmOnkelHandler('Help'));
        this.response.listen(simpleIntents.answerHandler('Help'));
        this.emit(':responseReady');
  },
  'MoviesByGenre' : function(){
        console.log('Dialog state: ' + this.event.request.dialogState);
        if (this.event.request.dialogState !== 'COMPLETED'){
             if (!this.event.request.intent.slots.genre.value){
                 
                 var slotToElicit = 'genre';
                 var speechOutput = 'Über Filme aus welchem Genre möchtest Du Informationen bekommen? Ich kenne folgende Genres und auch noch andere: ' + getRandomGenres();
                 var repromptSpeech = 'Ich habe Informationen über Filme aus diesen Genres: ' + getAllGenres() + ' In welchem Genre soll ich suchen?';
                 
                 this.emit(':elicitSlot' , slotToElicit, speechOutput, repromptSpeech);
             }
             else {
                this.emit(':delegate');
             }
         }
        else {
            var requestedGenre = this.event.request.intent.slots.genre.value;
            var resolvedGenre = undefined;
            var speechOutput = '';
            if (this.event.request.intent.slots.genre.resolutions.resolutionsPerAuthority[0].status.code === 'ER_SUCCESS_MATCH'){
                resolvedGenre = this.event.request.intent.slots.genre.resolutions.resolutionsPerAuthority[0].values[0].value.name; 
                speechOutput = 'Hier ist eine Liste von Filmen aus dem Genre: ' + requestedGenre + '. ';
            }
            else {
                resolvedGenre = undefined;
                speechOutput = 'Leider kenn ich das Genre ' + requestedGenre + ' nicht. Aber hier ist eine Liste von Filmen aus anderen Genres.';
            }
            
            var self = this;
            searchAPI.getAssetsByGenre({ genre: resolvedGenre }, function(output){
                
                if (output.code){
                    speechOutput += output.speech;
                }
                else {
                    speechOutput = output.speech;
                }
                
                self.response.speak(speechOutput);
                self.emit(':responseReady');
            });
            //this.emit(':responseReady');
        }
  },
  'MoviesByName' : function(){
        console.log('Dialog state: ' + this.event.request.dialogState);
        if (this.event.request.dialogState !== 'COMPLETED'){
             if (!this.event.request.intent.slots.movies.value){
                 
                 var slotToElicit = 'movies';
                 var speechOutput = 'Welchen Film soll ich suchen? Sage bitte: suche<break time=\'1s\'/>und dann den Titel des Films.';
                 var repromptSpeech = 'Sage mir bitte nach welchem Film sich suchen soll? Sage bitte suche und dann den Titel des Films.';
                 
                 this.emit(':elicitSlot' , slotToElicit, speechOutput, repromptSpeech);
             }
             else {
                this.emit(':delegate');
             }
         }
        else {
            var requestedMovie = this.event.request.intent.slots.movies.value;
            console.log('Requested Movie: ' + requestedMovie);
            var speechOutput = '';
            var self = this;
            searchAPI.getAssetsByName({ q: requestedMovie }, function(output){
                
                if (output.code){
                    speechOutput += output.speech;
                }
                else {
                    speechOutput = output.speech;
                }
                self.response.speak(speechOutput);
                self.emit(':responseReady');
            });
        }  
  }
}

function getRandomGenres() {
    var genres = require('./genres.json');
    var start = Math.floor(Math.random() * (genres.length - 4)) + 1;
    var genre = '';
    for (var i = start; i <= start + 3; i++) {
        genre += genres[i] + ', ';
    }
    genre = genre.substr(0, genre.lastIndexOf(",")) + '. Oder sage einfach: kein Genre.';
    return genre;
}

function getAllGenres() {
    var genres = require('./genres.json');
    var maxGenres = genres.length;
    var genre = '';
    for (var i = 0; i < maxGenres; i++) {
        genre += genres[i] + ', ';
    }
    genre = genre.substr(0, genre.lastIndexOf(",")) + '. Oder sage einfach: kein Genre.';
    return genre;
}

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    //alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
