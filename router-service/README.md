# Router-Service

### Purpose
---
This subdirectory contains the Router service. Its primary role is to route requests between different microservices, acting as a gateway for the application's other services (e.g., whisper-service, car-service). 

### Requirements
---
- `axios`
- `express`

### Installation
---
Run the following command to install the required dependencies:
```
npm install
```
### Usage
To start the Router service, run:

```
node app.js
```

Make sure that other services (e.g., whisper-service, car-service) are running and accessible at their respective URLs.

### Project Structure
controllers/: Contains logic for handling requests to external services.
routes/: Defines the endpoints for the Router service.
app.js: Main entry point for the Router service.