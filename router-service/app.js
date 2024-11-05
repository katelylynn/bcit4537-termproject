const Server = require("./modules/server");

const server = new Server();
console.log("Starting routing service...")
server.start(process.env.PORT || 3000);
console.log("Routing service started!")
