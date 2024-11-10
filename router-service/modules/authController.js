module.exports = class AuthController {

    static callAuthService(res, path) {
        fetch(process.env["AUTH-SERVICE"] + path)
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

    static postAuthService(res, path, body) {
        fetch(process.env["AUTH-SERVICE"] + path,{
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

    static registerUser(req, res) {
        const email = req.body.email
        const password = req.body.password
        const body = {
            'email': email,
            'password': password,
        }
        this.postAuthService(res, `/register/`, body)
    }

}
