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
        const url = process.env["DB-SERVICE"] + path;
    
        console.log('postDatabaseService - Sending request to:', url);
        console.log('postDatabaseService - Request body:', body);
    
        fetch(url, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
            .then(response => {
                console.log('postDatabaseService - Response status:', response.status);
                if (!response.ok) {
                    console.error('postDatabaseService - Response not OK:', {
                        status: response.status,
                        statusText: response.statusText
                    });
                    throw response; // Ensure this is caught in the catch block below.
                }
                return response.json();
            })
            .then(data => {
                console.log('postDatabaseService - Response data:', data);
                res.status(200).json(data);
            })
            .catch(response => {
                console.error('postDatabaseService - Caught error:', {
                    status: response.status,
                    statusText: response.statusText
                });
                res.status(response.status).json({ error: response.statusText || 'Unknown error' });
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
        console.log(`router dbcontroller singleuserapi params: ${JSON.stringify(req.user)}`)
        const uid = req.user.user.id;
        console.log(`router dbcontroller singleuserapi uid: ${uid}`)
        this.getDatabaseService(res, `/requests/single-user/${uid}`);
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
