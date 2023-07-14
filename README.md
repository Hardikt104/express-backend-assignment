# Assignment Description
----------------------

You are tasked with creating a RESTful API server using Express.js and TypeScript. The server should provide authentication using JSON Web Tokens (JWT), integrate with a third-party API for user data, and have a database layer for storing user information. The assignment also requires the implementation of middleware functions for request logging and error handling. Additionally, you need to write unit tests to ensure the functionality of the server.

## Requirements

1.  Implement a user authentication system using JWT. The API should have the following endpoints:
    
    *   `/api/auth/register` - Register a new user with email and password.
    *   `/api/auth/login` - Log in a user and return a JWT token.
    *   `/api/auth/profile` - Retrieve the user's profile information using the JWT token (protected route).
2.  Integrate with a third-party API to fetch user data. Use the [Random User Generator API](https://randomuser.me) to retrieve random user details. The API should have the following endpoint:
    
    *   `/api/users/random` - Fetch a random user's details from the third-party API.
3.  Implement a middleware function for request logging. Log the method, URL, and timestamp of each incoming request.
    
4.  Implement a middleware function for error handling. Handle any uncaught errors and return appropriate error responses to the client.
    
5.  Implement a database layer to store and retrieve user information. You can use any database of your choice (e.g., MongoDB, PostgreSQL, SQLite).
    
6.  Write unit tests for the API routes, middleware functions, and database layer using a testing framework of your choice (e.g., Jest).
    

## Guidelines

*   Use TypeScript for the project.
*   Use the Express.js framework to build the API server.
*   Use JSON Web Tokens (JWT) for authentication.
*   Use the axios library to make HTTP requests to the third-party API.
*   Use a database of your choice for storing and retrieving user information.
*   Implement proper error handling for invalid requests or failures.
*   Ensure the API responses follow RESTful design principles and return appropriate HTTP status codes.
*   Write clear and concise code with proper documentation and comments.
*   Include a `README.md` file with instructions on how to set up and run the project, along with any additional information or notes.

## Evaluation Criteria

*   Correctness and functionality of the implemented features.
*   Proper usage of TypeScript, including type definitions and interfaces.
*   Proper usage of middleware for request logging and error handling.
*   Integration with the third-party API and retrieval of user data.
*   Proper implementation of the database layer for storing and retrieving user information.
*   Unit tests for the API routes, middleware functions, and database layer.
*   Code quality, organization, and documentation.

Please note that this is a general guideline for the assignment, and you can modify it according to your specific requirements or preferences. You can choose any database and ORM/ODM of your choice to implement the database layer.

----------------------
## Docker Compose Instructions
To simplify the setup of the database, you can use Docker Compose. Follow the steps below to start the database container using Docker Compose:

1. Place the provided docker-compose.yml file in a directory (e.g., database).
2. Open a terminal or command prompt and navigate to the directory containing the docker-compose.yml file.
3. Run the following command to start the database container:

```shell
docker-compose up -d
```
The -d flag runs the containers in the background (detached mode).

Your PostgreSQL database container should now be up and running, exposing port 5432 on your localhost. You can connect to the database using your preferred PostgreSQL client or include the necessary configuration in your backend application to establish a connection.

Remember to adjust the database connection configuration in your Express.js backend to match the values you provided in the docker-compose.yml file.
