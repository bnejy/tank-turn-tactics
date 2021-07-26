# Tank Turn Tactics

An attempt to recreate the game described in this [video](https://www.youtube.com/watch?v=aOYbR-Q_4Hs).

*Note: This project is still in a very early stage of development!*


## Setup
1. Copy the `sample.env` file and rename it to `.env` to set up environment variables
2. Run `npm install` to install dependencies
3. Run `npm run start` to start server

## Project Structure
```
root
├── config      # setup for libraries
├── controllers # db controllers
├── libs        # utility modules
├── models      # db schema
├── middlewares # routes middlewares
├── public      # static resources
│   ├── css
│   └── js
├── routes      # routes
├── tests       # unit tests
└── views       # ejs and html
```

## Libraries

| Dependency | Description 
|------------|-------------
| express | Framework 
| ejs | Templating engine
| passport | Authentication middleware
| passport-local | Using local authentication
| bcryptjs | Password encryption
| mongoose | Database controller
| express-session | Authenticated session

| Testing | Description
|------------|-------------
| jest | Framework
| @jest-mock/express | Express mocking
| mongodb-memory-server| Database testing


## Game Design

### Design Points

