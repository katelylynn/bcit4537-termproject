# Kate, Justin and Harrison

## Project Requirements

- [X] Follow microservice architecture
- [ ] Protect project against SQL injection or XSS attack

Client:
- [ ] Create project title
- [X] Create Login page
- [ ] Make call to back end to register user
- [ ] Make call to back end to login user
- [ ] Make call to back end for forgotten password
- [X] Create Landing page
- [ ] Display user's API consumption in the login/landing page
- [ ] Display all users' API consumption if logged in as admin user
- [ ] Warn user if they have used up 20 free API calls (continues providing services)

Router:
- [ ] User Registration
- [ ] User Login
- [ ] Calls to LLM-service
- [ ] Calls to car-service
- [ ] Ensure CORS is set to only allow requests from client

Auth-service:
- [ ] Use httpOnly cookie and/or JWT for auth

LLM-service:
- [ ] Use downloaded pre-trained LLM model
- [ ] Host LLM model from HuggingFace
- [ ] Ensure CORS is set to only allow requests from router-service

Car-service:
- [ ] Ensure CORS is set to only allow requests from router-service

Database service:
- [X] Setup a DB
- [ ] Respond with correct status codes
- [ ] Hash passwords before storing in DB
- [ ] Ensure CORS is set to only allow requests from router-service
- [ ] Extract db query strings into const variables
- [ ] FIX: DB connection automatically closes if you leave the hosted app deployed for like a day
- [ ] Limit user's privilege