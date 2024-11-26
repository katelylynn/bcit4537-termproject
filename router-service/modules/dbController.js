const { WARNING_MESSAGES } = require('../lang/en');

module.exports = class DBController {

    static getDatabaseService(res, path) {
        fetch(process.env["DB-SERVICE"] + path)
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then(data => {
                res.status(200).json(data);
            })
            .catch(response => {
                console.error('Error in getDatabaseService fetching data:', response.statusText);
                return res.status(response.status).json({ error: response.statusText });
            });
    }

    static postDatabaseService(res, path, body) {
        fetch(process.env["DB-SERVICE"] + path, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then(data => {
                res.status(200).json(data);
            })
            .catch(response => {
                console.error('Error in postDatabaseService fetching data:', response.statusText);
                return res.status(response.status).json({ error: response.statusText });
            });
    }

    static callDatabaseService(res, method, path, body) {
        fetch(process.env["DB-SERVICE"] + path, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then(data => {
                res.status(200).json(data);
            })
            .catch(response => {
                console.log(response)
                console.error('Error in callDatabaseService fetching data:', response.statusText);
                return res.status(response.status).json({ error: response.statusText });
            });
    }

    static getApiConsumptionAllEndpoints(req, res) {
        this.getDatabaseService(res, "/requests/per-endpoint");
    }

    static getApiConsumptionAllUsers(req, res) {
        this.getDatabaseService(res, "/requests/per-user");
    }

    static getApiConsumptionSingleUser(req, res) {
        const uid = req.user.user.id;
        fetch(`${process.env["DB-SERVICE"]}/requests/single-user/${uid}`)
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then(response => {
                if (response.data[0].total_requests >= 20) {
                    response.data[0].warning = WARNING_MESSAGES.consumptionLimit;
                }
                res.status(200).json(response);
            })
            .catch(response => {
                console.error('Error in getDatabaseService fetching data:', response.statusText);
                res.status(500).json({ error: response.statusText });
            });
    }
    

    static postUser(req, res) {
        const email = req.body.email
        const password = req.body.password
        const role = req.body.role
        const body = {
            'email': email,
            'password': password,
            'role': role
        }
        this.postDatabaseService(res, `/users/`, body)
    }

    static updateEmail(req, res) {
        const uid = req.user.user.id
        const email = req.body.email
        this.callDatabaseService(res, "PATCH", `/users/${uid}`, { 'email': email })
    }

    static deleteUser(req, res) {
        const uid = req.user.user.id
        this.callDatabaseService(res, "DELETE", `/users/${uid}`)
    }

    static getEndpointId(method, path, res) {
        const queryParams = new URLSearchParams({ method, path }).toString();
        this.getDatabaseService(res, `/endpoints/get-endpointid?${queryParams}`);
    }

    static postEndpoint(req, res) {
        const body = {
            'method': req.body.method,
            'path': req.body.path,
        }
        this.postDatabaseService(res, `/endpoints/`, body)
    }

    static incrementUserCallCount(userId, endpointId, res) {
        const body = { userId, endpointId };
        this.postDatabaseService(res, `/requests/increment`, body);
    }

    static getUid(req, res) {
        const email = req.params.email
        this.getDatabaseService(res, `/users/get-userid/${email}`)
    }

    static getUser(req, res) {
        const uid = req.params.uid
        this.getDatabaseService(res, `/users/${uid}`)
    }

}
