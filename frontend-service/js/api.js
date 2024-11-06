const ROUTER_SERVICE = "http://localhost:3000/api"

export class Api {

    static callRouterService(path, cb) {
        fetch(ROUTER_SERVICE + path)
            .then(response => {
                return response.json()
            })
            .then(cb)
            .catch(error => {
                console.error(error.message)
            })
    }

}