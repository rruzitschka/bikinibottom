'use strict';

module.exports.filmOnkelHandler = function filmOnkelHandler(intent){
    var allIntents = require('./filmonkel.json');
    var intentList = allIntents[intent];
    var index = Math.floor(Math.random() * intentList.length);
    var randomAnswer = intentList[index];
    return randomAnswer;
}

module.exports.answerHandler = function answerHandler(intent) {
    var allAnswers = require('./answers.json');
    var answer = allAnswers[intent];
    var defaultAnswer = allAnswers['Default'];
    try {
        if (answer == undefined || answer == null)
            return defaultAnswer;
        else
            return answer;
    }
    catch (err) {

    }
}