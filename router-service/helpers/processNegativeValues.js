function processNegativeValues(args) {
    return args.map((arg, index, array) => {
        if (arg === "negative" && index + 1 < array.length) {
            const nextArg = array[index + 1];
            // If the next argument is a number, prepend a negative sign
            if (!isNaN(Number(nextArg))) {
                array[index + 1] = String(-1 * Number(nextArg)); // Convert nextArg to negative
                return null; // Remove "negative" itself
            }
        }
        return arg;
    }).filter(arg => arg !== null); // Remove null values
}

module.exports = { processNegativeValues };