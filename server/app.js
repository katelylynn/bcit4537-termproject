const ApiServer = require('./modules/apiServer');

const s = new ApiServer()
console.log("Starting API Server...")
s.start(8080)
console.log("API Server Started!")