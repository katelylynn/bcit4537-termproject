const { WORD_TO_NUMBER } = require('../lang/en');

function wordToNumber(word) {
    return WORD_TO_NUMBER[word.toLowerCase()] ?? word;
}

function convertWordsToNumbers(args) {
    return args.map(arg => {
        const converted = wordToNumber(arg);
        return isNaN(Number(converted)) ? converted : Number(converted);
    });
}
    
module.exports = { convertWordsToNumbers };