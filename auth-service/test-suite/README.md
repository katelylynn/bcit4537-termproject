# Description
this suite currently assumes the authentication service will run on port 3000

running the suite will allow you to verify the auth-service functionality by simulating a skeleton app with frontend/router/resource all hosted on different origins

this folder contains /frontend-service, /router-service, and /resource-service for testing the authentication server
/frontend-service - port=3001 - is for serving up a simple simple static frontend
/router-service - port=3002 - is for serving up a routing service 
/resource-service - port=3003 - is for serving up a simulated resource


# how to run:
start in root directory of the term project repository

node ./app.js # starts the main authentication server on port 3000
node ./testing-suite/client-service/app.js # starts the frontend on port 3001
node ./testing-suite/router-service/app.js # starts the router on port 3002
node ./testing-suite/client-service/app.js # starts the resource service on port 3003

open a browser and visit http://localhost:3001


# what should happen
- the frontend server should serve you a page with login and getsomething buttons
- when you click getsomething you should get an alert saying you're not authorized
- when you enter username:'admin' and password:'111' and click login, it should log you in
- now when you click getsomething you should get an alert showing that you've been sent a resource

