module.exports = class DBController {

    static callDatabaseService(res, path) {
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
                console.error('Error fetching data:', response.statusText);
                return res.status(response.status).json({ error: response.statusText });
            });
    }

    static postDatabaseService(res, path, body) {
        fetch(process.env["DB-SERVICE"] + path,{
            "method": "POST",
            "headers": {
                'Content-Type': 'application/json'
            },
            "body": JSON.stringify(body)
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
                console.error('Error fetching data:', response.statusText);
                return res.status(response.status).json({ error: response.statusText });
            });
    }

    static getApiConsumptionAllEndpoints(req, res) {
        this.callDatabaseService(res, "/requests/per-endpoint");
    }

    static getApiConsumptionAllUsers(req, res) {
        this.callDatabaseService(res, "/requests/per-user");
    }

    static getApiConsumptionSingleUser(req, res) {
        console.log(`router dbcontroller singleuserapi params: ${JSON.stringify(req.user)}`)
        const uid = req.user.user.id;
        console.log(`router dbcontroller singleuserapi uid: ${uid}`)
        this.callDatabaseService(res, `/requests/single-user/${uid}`);
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

    static getUid(req, res) {
        const email = req.params.email
        this.callDatabaseService(res, `/users/get-userid/${email}`)
    }

    static getUser(req, res) {
        const uid = req.params.uid
        this.callDatabaseService(res, `/users/${uid}`)
    }

}
