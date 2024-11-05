module.exports = class DBController {

    static getApiConsumptionAllUsers(req, res) {
        fetch(process.env["DB-SERVICE"] + "/requests/per-user")
            .then(response => {
                if (!response.ok) {
                    return res.status(response.status).json({ error: `Error: ${response.statusText}` });
                }

                return response.json();
            })
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error.message);
                return res.status(500).json({ error: 'Internal server error' });
            });
    }

}