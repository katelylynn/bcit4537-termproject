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

    static getApiConsumptionAllEndpoints(req, res) {
        this.callDatabaseService(res, "/requests/per-endpoint");
    }

    static getApiConsumptionAllUsers(req, res) {
        this.callDatabaseService(res, "/requests/per-user");
    }

    static getApiConsumptionSingleUser(req, res) {
        const uid = req.params.uid;
        this.callDatabaseService(res, `/requests/single-user/${uid}`);
    }

    static getUserId(req, res) {
        const email = req.params.email
        this.callDatabaseService(res, `/users/get-userid/${email}`)
    }

}