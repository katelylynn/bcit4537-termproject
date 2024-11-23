# Kate, Justin and Harrison

## Project Requirements

- [X] Follow microservice architecture
- [/] Protect project against SQL injection or XSS attack 
- [X] Admin gets to see API consumption per user

Client:
- [X] Create project title
- [X] Create Login page
- [X] Make call to back end to register user
- [X] Make call to back end to login user
- [ ] Make call to back end for forgotten password (Harrison)
- [X] Create Landing page
- [X] Display user's API consumption in the login/landing page
- [X] Display all users' API consumption if logged in as admin user
- [X] Warn user if they have used up 20 free API calls (continues providing services)
- [X] Logout
- [ ] Make proper redirects (Justin)

Router:
- [X] User Registration
- [X] User Login
- [X] Calls to LLM-service
- [X] Calls to car-service
- [X] Ensure CORS is set to only allow requests from client
- [X] Show informative message if email is incorrect, not just throwing internal error

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
- [ ] FIX: DB connection automatically closes if you leave the hosted app deployed for like a day (Kate)
- [ ] Limit user's privilege (Kate, on db side)

## Milestone II

General
- [ ] Connect to database service, keep client up (Kate)
- [X] Connect the car service to the model service (Harrison)
    - [X] Car router logic and controller (Harrison)

- [X] An API server which provides some services through API
- [X] And one client web app that consumes those services 
- [X] Your server uses a hosted pre-trained AI/ML models from HuggingFace (if you are using multiple ML models, at least one has to be hosted and downloaded locally and not via using API) *
- [X] Client and sever hosted in two different origins (using more than two hosting services is ok too. e.g. as well as two origins, you may want to use Kaggle etc to host your HuggingFace model)
- [X] Authentication implementation using httpOnly cookies and JWT (not using third party APIs)
- [X] Admin and users' page implemented
- [ ] Documentation page of your API using swagger etc. E.g. myAPIserver.xyz/API/v1/docs

Authentication: 
- [X] Users of your app need to register by entering their information such as first name and email address at the client app  ( the authentication is a service happening at the server side ) 
- [X] Each user receives 20 API calls for free, after that the server tells the client app that this user maxed his/her free API calls and the client displays an appropriate  warning to user but continues providing services 
    - [ ] Move to server side (Justin / Kate)
- [X] The authentication has to be token based, httpOnly cookie or jwt etc. you cannot use any third party APIs for authentication
- [/] follow standard practices 

Security/Robustness 
- [X] Protect your project against SQl injection, XSS etc 
- [X] Hash passwords before storage in DB
- [X] Take care of CORS and proper header setting at the server side 
- [X] User types ( admin, user)
- [X] The user shall see his/her API consumption upon the login
- [X] There has to be an admin user with more privileges such as monitoring who has consumed how much API, and the stat of API calls . You can manually select a user role in database to be an admin
- [X] For signing JWTs its ok to store secrete key hard coded in your nodejs source  (storing it in environment variable is preferred but not a must) 

Recommendations 
- [X] Please use GitHub so that everyone's contribution is visible. That will be helpful at the time of project assessment which happens in-person where I ask each team member about their contribution 
- [ ] If your server takes a while to respond to API requests, it's advisable to show a loading animation to let users know that their request is still being processed.
- [X] Using third party* APIs for authentication is not allowed. 
- [X] Using any third party libraries not recommended either. Implement the whole authentication yourself 

### API Server 
- [X] The client and the server have to be hosted in two totally different origins. 
- [X] Your server app has to provide at least 8 endpoints (Kate)

- [X] At least two have to be on POST methods
- [X] At least one DELETE method
- [X] At least one PUT/PATCH method 
- [X] At least one GET method


- [X] The RESTful services have to offer all the CRUD operations on the stored data in DB ( e.g. endpoints to read data from DB,  endpoints to write data into DB, endpoints to delete data fromDB, endpoint to update data of DB):
        - [X] Create using Post methods,
        - [X] Read using Get methods,
        - [X] Update using PUT or PATCH methods,
        - [X] Delete using DELETE  methods

- [X] All connections/requests have to be done over https ( and use of JWT tokens and httpOnly)
- [X] json format for exchanging payload


### Client app 
a. Admin page
- [X] show APIs stats 
- [X] After the admin logs in, admin shall see the list of all endpoints and their corresponding stats ( how many times each end point served requests etc)  and users and their API consumption 
- [ ] Stats for each of the 8 endpoints ( how many times each endpoint served requests) in tabular format.  (Kate)
  - [X] Create endpoints on router startup
- [X] Break down of API usages/consumption stats for each user 


B. user page
- [X] The user shall see his/her API consumption* upon the login at the profile landing page
- [X] *: total API consumptions or individual APIs consumption ( whichever you prefer) 

Other Client requirements 

- [X] 1- Client has to utilize all the endpoints 
    - [ ] Router should increment all tracked endpoints (Justin/Kate)
- [ ] 2- somewhat mobile friendly UX. It would be acceptable as long as buttons/labels etc are visible and legible in mobile, no fancy UI is needed (Harrison)
- [ ] 3- Proper http status codes to be sent by server and displayed at client side to the user
    - [ ] Needs to display full page error message (Justin)
- [X] 4- Descriptive user messages 
- [ ] 5- All user message strings must be stored in a separate file (All)
- [X] 6- proper DB design. Each entity has to have its own table . 
e.g. Do not put users info and their API usage stat in the same DB table. Those are two different entities. 
- [X] Each column has to have only one purpose, e.g. for the language table of your last lab assignment , you should not use language codes such as EN, JP and primary keys for the language table. - [X] Use a unique integer number to represent primary keys 
- [ ] 7- Proper API documentation for developers to use your API service using swagger (https://swagger.io/solutions/api-documentation/) (All)
    The documentation should specify at least the following:
    - [ ] A description of available resources and their URI ( end points)
    - [ ] Available HTTP methods for each resource in the API
    - [ ] Sample JSON representation of each resource in the API
    - [ ] Examples of JSON representation of client payload for the services
    - [ ] The url of API documentation must end with /doc/ e.g. example.com/doc ( returns documentation about your API) 

- [ ] 8- Proper API versioning e.g. http://api.example.com/v1 (add v1 in path, all)
- [ ] 9-Input validation    (Justin)
    - [ ] These apply to both your apps, the client an the server 
    - [ ] If an email is expected to input, you must validate the input to be in the format of an email ( e.g. at some text with an @ followed by a domain name. You can use existing regex samples from the net. 
    - [ ] If a number is expected to input, your app has to return an error if something else gets entered 
    - [ ] Never trust input at the server side either. You need to do a sanity check ( input validation) at the end point of APIs as well

- [ ] 10- Attribution to chatGPT or any resources at the comment section of learning hub and and also in your source code (Harrison, Justin)
- [ ] 11- Every member has to be 100% familiar with the entire project code and details and be able to answer questions otherwise there will be deductions

### Coding style
- [X] Modular folder structure: separate folders for HTML, JS and CSS ( although I mentioned no fancy UI is needed, as long as buttons and inputs etc are visible in desktop and mobile)
- [X] Clean code: good organization using modules
- [ ] All user message strings to be stored in a separate file ( no hard-coded string messages in your code) (all)
- [ ] For variable declaration first use const, then let; never var (all check; Harrison - landing)

Recommended but not required:
- [/] Implement OOP  ( use classes like the begging of the term)
- [ ] All functions have to be arrow functions
- [ ] Separation of concerns, meaning each function has to do one thing 
- [ ] Short function declaration ( preferably not more than 15 lines)

- [X] No third party APIs is allowed to use for authentication 


Deliverable 
A) At the comment section of learning hub : 
1- URL of user login/registration page ( with pre-register user to test)
    sample user id: 'john@john.com'
    sample user pass:'123'
2- URL of admin login page ( with the pre-registered admin )
    Admin-id : 'admin@admin.com'
    Admin-pass: '111'
3- Link to your work so that I can test the features of your project
4. link to your API documentation page  ( a html page generated by swagger hosted at your server origin) 
5. 2-3 samples of making http requests to your server 
6- Attribution to chatGPT or other resources used ( also include that in your project source code )

B) (attach) team#finalProjectTitle.pdf 
a pdf containing 
    1. team member names at the top of 
    underneath each name briefly explain their responsibilities and actual contributions.
    2. briefly what the application does ( paste from milestone 1)
    3. everything you were asked to provide at the comment section  
you can add as many pages you wish to make your documentation complete.

C) (attach) source code 
    c1. team#FrontEnd.zip
    c2. team#BackEnd.zip

D) (attach) 2-3 pages of screenshots of your DB ERD and/or your DB tables/rows etc 
    team#DB1ERD.jpg , 
    team#DB2Rows.jpg 
    team#DB3Rows.jpg 

Rubric:
6 points for everything, fully working APIs and pages and API documentation 

Deductions 
few but not limited to 
    (-1-3) Wrong API design and implementation at server side
    (- 1 -2) Wrong CRUD implementation in DB 
    (-1 -2) for no proper API security using tokens as described in server specifications above. 
    (-1) for no API documentation 
    (-1-2) For a buggy frontend client application 
    (-1) For not properly generating http status codes
    (-1) For not storing user string messages separately 
    ( -1 ) for not showing descriptive messages to user
    ( -1) for not displaying API consumption stat
    there will be other deduction for not properly working app 

BONUS 

- [ ] +0.5 (5%) : For the user registration/login you don't need to implement forgot password feature. However if you do so, you will get 0.5 ( 5%) bonus
- [X] +1 (10%): If your term project is AI/ML powered, you will get additional 10% ( you will be marked from 11 instead of 10)
