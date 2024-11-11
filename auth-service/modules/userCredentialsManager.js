require('dotenv').config();

module.exports = class UserCredentialsManager {

    static getRouter(res, path) {
        fetch(process.env["ROUTER-SERVICE"] + path)
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
                console.error('Error posting data:', response.statusText);
                return res.status(response.status).json({ error: response.statusText });
            });
    }

    static async getRouterValue(path) {
        return await fetch(process.env["ROUTER-SERVICE"] + path)
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then(data => {
                return data
            })
            .catch(response => {
                console.error('Error posting data:', response.statusText);
                return undefined
            });
    }

    static postRouter(res, path, body) {
        fetch(process.env["ROUTER-SERVICE"] + path,{
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
                console.error('Error posting data:', response.statusText);
                return res.status(response.status).json({ error: response.statusText });
            });
    }

    static async getUid(email) {
        const data = await this.getRouterValue(`/api/get-uid/${email}`)
        return data['data'][0]['id']
    }

    static async getUser(uid) {
        const data = await this.getRouterValue(`/api/get-user/${uid}`)
        return data['data'][0]
    }

    static registerUser(req, res) {
        const { email, hashedPassword } = req.body
        const role = "user"

        const body = {
            'email': email,
            'password': hashedPassword,
            'role': role
        }
        
        this.postRouter(res, "/api/post-user", body)
    }

}


// callDatabaseService(res, path) {
//     fetch(process.env["ROUTER-SERVICE"] + path)
//         .then(response => {
//             if (!response.ok) {
//                 return res.status(response.status).json({ error: `Error: ${response.statusText}` });
//             }

//             return response.json();
//         })
//         .then(data => {
//             res.status(200).json(data);
//         })
//         .catch(error => {
//             console.error('Error fetching data:', error.message);
//             return res.status(500).json({ error: 'Internal server error' });
//         });
// }

// getApiConsumptionSingleUser(req, res) {
//     const uid = req.params.uid;
//     this.callDatabaseService(res, `/requests/single-user/${uid}`);
// }
