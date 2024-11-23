module.exports = class CarController {

    static sendCarCommand(command, res) {
        // code to send command
        return true; // success!

        try {

            // Determine the appropriate car endpoint based on the `command` parameter
            // e.g., "move forward" -> `${CAR_SERVICE_URL}/forward`
            //       "move backward" -> `${CAR_SERVICE_URL}/backward`
            //       "stop" -> `${CAR_SERVICE_URL}/stop`
    
            let carEndpoint;
            let payload = { speed: 1.0 }; // Default payload; modify as needed
    
            // Map the command to a car endpoint and any necessary payload
            // Use a switch-case or if-else statement to check the value of `command`
    
            // Send the command to the determined endpoint using axios
            // e.g., `await axios.post(carEndpoint, payload);`
    
            // Respond with the car service's response
            // Use `res.json(response.data);` to send the result back to the client
    
        } catch (error) {
    
            // Handle errors: log the error and send a response to the client
            // e.g., `res.status(500).json({ error: "Failed to send command to car" });`
    
        }
    }

    static justin1(req, res) {

    }

    static justin2(req, res) {

    }

}
