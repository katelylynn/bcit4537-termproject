const { ERROR_MESSAGES } = require('../lang/en');

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
        fetch(process.env["AUTH-SERVICE"] + path, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        })
            .then(response => {
                // Forward status code and body
                const setCookieHeader = response.headers.get('set-cookie');
                
                // Forward `Set-Cookie` header if present
                if (setCookieHeader) {
                    res.setHeader('set-cookie', setCookieHeader);
                }

                // Return the response JSON
                return response.json().then(data => ({
                    status: response.status,
                    data
                }));
            })
            .then(({ status, data }) => {
                res.status(status).json(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error.message || error.statusText);
                res.status(error.status || 500).json({ error: error.message || ERROR_MESSAGES.internalServerError });
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

    static loginUser(req, res) {
        const email = req.body.email
        const password = req.body.password
        const body = {
            'email': email,
            'password': password,
        }
        this.postAuthService(res, `/login/`, body)
    }

    static logoutUser(req, res) {
        const body = {}
        this.postAuthService(res, `/logout/`, body)
    }

}
