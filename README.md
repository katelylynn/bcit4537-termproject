# Kate, Justin and Harrison

## Project Requirements

- [ ] Follow microservice architecture
- [ ] Use httpOnly cookie or JWT for auth
- [ ] Protect project against SQL injection or XSS attack
- [ ] FIX: DB connection automatically closes if you leave the hosted app deployed for like a day
- [ ] BONUS: Implement forgot password feature

Front end:
- [ ] Create project title
- [X] Create Login page
- [ ] Make call to back end to register user
- [ ] Make call to back end to login user
- [ ] Make call to back end for forgotten password
- [X] Create Landing page
- [ ] Make API calls to backend
- [ ] Display user's API consumption in the login/landing page
- [ ] Display all users' API consumption if logged in as admin user
- [ ] Warn user if they have used up 20 free API calls (continues providing services)
- [ ] Hosted on its own origin

Back end:
- [ ] Set up API endpoints
  - [ ] User Registration
  - [ ] User Login
  - [ ] Get all user API consumption data
- [X] Setup a DB
- [ ] Hash passwords before storing in DB
- [ ] Use downloaded pre-trained LLM model, not third-party service
- [ ] Host LLM model from HuggingFace
- [ ] Warn user if they have used up 20 free API calls
- [ ] Ensure CORS is set to only allow requests from client
- [X] Hosted on its own origin