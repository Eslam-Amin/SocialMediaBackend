

# Social Network Backend Server

Welcome to the Social Network Backend Server repository. This server provides the backend functionality for a social network platform similar to Facebook. Below you'll find documentation on the API endpoints, setup instructions, technologies used, and future enhancements.

## Features

- User authentication and authorization using JWT.
- CRUD operations for users and posts.
- Follow/unfollow functionality.
- View posts on your timeline based on who you are following.

## Technologies Used

- Node.js
- Express.js
- MongoDB (Atlas)
- JSON Web Tokens (JWT)

## API Endpoints

### User Endpoints

- **Create User**
  - `POST /users`
  - Registers a new user.
  
- **Read User**
  - `GET /users/:id`
  - Retrieves a user's details.
  
- **Update User**
  - `PUT /users/:id`
  - Updates a user's information.
  
- **Delete User**
  - `DELETE /users/:id`
  - Deletes a user's account.
  
- **Follow User**
  - `POST /users/:id/follow`
  - Follows another user.
  
- **Unfollow User**
  - `POST /users/:id/unfollow`
  - Unfollows another user.

### Post Endpoints

- **Create Post**
  - `POST /posts`
  - Creates a new post.
  
- **Read Post**
  - `GET /posts/:id`
  - Retrieves a post's details.
  
- **Update Post**
  - `PUT /posts/:id`
  - Updates a post.
  
- **Delete Post**
  - `DELETE /posts/:id`
  - Deletes a post.
  
- **Timeline Posts**
  - `GET /posts/timeline`
  - Retrieves posts for the user's timeline based on who they are following.

- **Uploading Pictures:**
  - Implement functionality to allow users to upload pictures with their posts.

## Authentication

- **Login**
  - `POST /auth/login`
  - Authenticates a user and returns a JWT.

### Middleware

1. **jsonwebtoken (JWT):**
   - Provides security to ensure routes are only accessible to authenticated and authorized users.
   
2. **mongoSanitize():**
   - Protects against attacks tampering with database queries.
   - Cleans user input to prevent MongoDB database from malicious code.

3. **xss():**
   - Guards against XSS attacks.
   - Cleans user input to prevent harmful scripts from running in web pages.

4. **hpp():**
   - Prevents parameter pollution attacks.
   - Limits the number of query parameters a client can send, allowing only specified safe parameters.

5. **Global Error Handling Middleware:**
   - Handles errors globally, providing a consistent error response structure and managing operational errors.

## Prerequisites

To run the server, ensure you have the following:

- Node.js installed
- MongoDB Atlas connection string in your `.env` file

## Setup Instructions

1. Clone the repository.
   ```bash
   git clone https://github.com/yourusername/social-network-backend.git
   ```

2. Install dependencies.
   ```bash
   cd social-network-backend
   npm install
   ```

3. Set up environment variables.
   - Create a `.env` file in the root directory.
   - Add your MongoDB Atlas connection string and any other required environment variables.
   
4. Start the server.
   ```bash
   node server.js
   ```

## Deployment

This server has been deployed to Render.com. You can access it through this repository.

## Future Work

To enhance the project further, consider the following:
  
- **Real-time Chatting:**
  - Integrate real-time chat functionality using Socket.io.
