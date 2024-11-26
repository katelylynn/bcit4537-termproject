/*This code was made with the assistance of CHATGPT version 4o- to:
 - make recommendations
 - provide feedback
 - correct syntax and logic
 */
function processNegativeValues(args) {
    return args.map((arg, index, array) => {
        if (arg === "negative" && index + 1 < array.length) {
            const nextArg = array[index + 1];
            if (!isNaN(Number(nextArg))) {
                array[index + 1] = String(-1 * Number(nextArg));
                return null;
            }
        }
        return arg;
    }).filter(arg => arg !== null);
}

module.exports = { processNegativeValues };