/*This code was made with the assistance of CHATGPT version 4o- to:
 - make recommendations
 - provide feedback
 - correct syntax and logic
 */

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
        const data = await this.getRouterValue(`/api/v1/get-uid/${email}`)
        
        if (data['data'].length === 0) {
            return undefined
        }

        return data['data'][0]['id']
    }

    static async getUser(uid) {
        const data = await this.getRouterValue(`/api/v1/get-user/${uid}`)

        if (data['data'].length === 0) {
            return undefined
        }

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
        
        this.postRouter(res, "/api/v1/post-user", body)
    }

}