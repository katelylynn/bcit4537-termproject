import { Api } from "./api.js"
import { Auth } from "./auth.js"

const BUTTON_ID_DONUT = "carDonutButton"
const BUTTON_ID_STOP = "carStopButton"
const PATH_DONUT = "/donut"
const PATH_STOP = "/stop"

export class CarControl {

    constructor() {
        console.log("making Car Control")
        document.getElementById(BUTTON_ID_DONUT).onclick = this.donut
        document.getElementById(BUTTON_ID_STOP).onclick = this.stop
    }

    donut() {
        console.log("do a donut")
        Api.postRouterService(PATH_DONUT, {}, (res) => {console.log(res)})
    }

    stop() {
        console.log("stop")
        Api.postRouterService(PATH_STOP, {}, (res) => {console.log(res)})
    }

}
