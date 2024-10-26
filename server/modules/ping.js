module.exports = class Ping {

    constructor() {
        console.log("pinger set up")
    }

    ping1(req, res) {
        res.send("ping 1")
    }

    ping2(req, res) {
        res.send("ping 2")
    }

}