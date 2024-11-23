const Server = require("./modules/server");

const api_version = 1;

const server = new Server(api_version);
console.log("Starting routing service...")
server.start(process.env.PORT || 3000);
console.log("Routing service started!")
