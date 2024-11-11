# Kate, Justin and Harrison

## Project Requirements

- [X] Follow microservice architecture
- [ ] Protect project against SQL injection or XSS attack
- [X] Admin gets to see API consumption per user

Client:
- [X] Create project title
- [X] Create Login page
- [X] Make call to back end to register user
- [X] Make call to back end to login user
- [ ] Make call to back end for forgotten password
- [X] Create Landing page
- [X] Display user's API consumption in the login/landing page
- [X] Display all users' API consumption if logged in as admin user
- [X] Warn user if they have used up 20 free API calls (continues providing services)
- [ ] Logout

Router:
- [X] User Registration
- [X] User Login
- [X] Calls to LLM-service
- [X] Calls to car-service
- [X] Ensure CORS is set to only allow requests from client
- [ ] Show informative message if email is incorrect, not just throwing internal error

Auth-service:
- [X] Use httpOnly cookie and/or JWT for auth
- [X] Hash passwords before storing in DB

LLM-service:
- [X] Use downloaded pre-trained LLM model
- [X] Host LLM model from HuggingFace

Database service:
- [X] Setup a DB
- [X] Create user table if not already created
- [X] Respond with correct status codes
- [X] Extract db query strings into const variables
- [ ] FIX: DB connection automatically closes if you leave the hosted app deployed for like a day
- [ ] Limit user's privilege