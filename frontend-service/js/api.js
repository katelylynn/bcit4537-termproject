// const ROUTER_SERVICE = "https://hjdjprojectvillage.online/router-service/api/v1"
const ROUTER_SERVICE = "http://localhost:3000/api/v1"

export class Api {

    static getRouterService(path, cb) {
        fetch(ROUTER_SERVICE + path, {
            credentials: 'include'
        })
            .then(response => {
                if (response.status === 401) {
                    window.location.href = '/login.html'
                    return
                }
                return response.json()
            })
            .then(cb)
            .catch(error => {
                console.error(error.message)
            })
    }

    static postRouterService(path, body, cb) {
        fetch(ROUTER_SERVICE + path, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                if (response.status === 401) {
                    window.location.href = '/login.html'
                    return
                }
                return response.json();
            })
            .then(cb)
            .catch(error => {
                console.error(error.message)
            });
    }

    static callRouterService(path, method, body, cb) {
        fetch(ROUTER_SERVICE + path, {
            method: method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                if (response.status === 401) {
                    window.location.href = '/login.html'
                    return
                }
                return response.json();
            })
            .then(cb)
            .catch(error => {
                console.error(error.message)
            });
    }

}
