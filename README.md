# URL Shortener API

## Description:
A simple URL Shortener API with features such as Google OAuth authentication, URL shortening, and analytics for both overall and specific shortened URLs. The API allows users to shorten URLs, view analytics, and manage their links securely.

## Deployed URL:
[URL Shortener API](https://url-shorten-api-1d0g.onrender.com)

## Features:

- **Google OAuth Authentication**: Users can log in via Google OAuth.
- **URL Shortening**: Create short URLs from long URLs.
- **Analytics**: Track clicks and unique users for each shortened URL, along with overall analytics.
- **Topic-based Analytics**: Retrieve analytics based on specific topics.

## API Documentation:

### Authentication

#### GET /auth/google
- **Description**: Redirects the user to Google's login page to authenticate via Google OAuth.
- **Response**: Redirects to Google login (302).

#### GET /auth/google/callback
- **Description**: Handles the Google OAuth callback and generates a JWT token.
- **Responses**:
  - `200`: Login successful, returns a message and a JWT token.
  - `401`: Authentication failed.

### URL Shortening

#### POST /api/shorten
- **Description**: Creates a shortened version of a given long URL.
- **Security**: Requires Bearer token (JWT).
- **Request Body**:
  ```json
  {
    "longUrl": "https://example.com/very-long-url",
    "customAlias": "Bitcoin",  // Optional field
    "topic": "Bitcoin"  // Optional field
  }
  ```
- **Responses**:
  - `200`: Short URL created. Example response:
    ```json
    {
      "shortUrl": "http://short.ly/abc123",
      "createdAt": "date"
    }
    ```
  - `400`: Invalid URL.
  - `500`: Internal Server Error.

#### GET /api/shorten/{alias}
- **Description**: Redirects a short URL alias to its original long URL.
- **Parameters**: `alias`: The short URL alias (e.g., abc123).
- **Responses**:
  - `302`: Redirecting to the long URL.
  - `404`: Alias not found.
  - `500`: Internal Server Error.

## Analytics

### GET /api/analytics/overall
- **Description**: Fetches overall analytics, including the total number of URLs, clicks, and unique users.
- **Security**: Requires Bearer token (JWT).
- **Responses**:
  - `200`: Overall analytics data.
  - `401`: Unauthorized access.
  - `500`: Internal Server Error.

### GET /api/analytics/{alias}
- **Description**: Fetches analytics for a specific shortened URL.
- **Parameters**: `alias`: The alias of the shortened URL.
- **Responses**:
  - `200`: Analytics data for the short URL.
  - `404`: No analytics found for the provided alias.
  - `500`: Internal Server Error.

### GET /api/analytics/topic/{topic}
- **Description**: Fetches analytics for a specific topic.
- **Parameters**: `topic`: The topic name (e.g., technology).
- **Responses**:
  - `200`: Analytics data for the topic.
  - `400`: No URLs found for this topic.
  - `500`: Internal Server Error.

## Security
The API uses JWT (JSON Web Tokens) for secure access to certain routes like URL shortening and analytics.
Use the Authorization header with the format:
```
Authorization: Bearer <JWT_TOKEN>
```

## Prerequisites:
- Node.js
- MongoDB
- Google OAuth credentials (Client ID and Secret)
- Redis

## Setup
### Clone the repository:
```
git clone https://github.com/shanmukasagar/URL_Shorten_API
```

### Install dependencies:
```
npm install
```

### Create a `.env` file and add the following variables:
```
PORT=5001
JWT_SECRET=123456789
MONGO_URI=mongodb+srv://shanmukasagar:sagar%4005@cluster0.3bton.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
REDIS_URI=rediss://default:ATkUAAIncDE2MTZiOWQwMTEyMzA0YmVhOTljYjU1M2E4NDIwMTI4ZXAxMTQ2MTI@capable-krill-14612.upstash.io:6379
SESSION_SECRET=123456789
COOKIE_ENC_KEY=wJ5@zN8!dP3&kLmQ9vT$XyR#bF6G*HjK
```

### Run the server:
```
node app.js
```

## Testing the API

### Authenticate via Browser:
- Open the [GET /auth/google](https://url-shorten-api-1d0g.onrender.com/auth/google) endpoint in your browser.
- This will redirect you to Google’s OAuth login page.
- After logging in, Google will redirect back to your application (via the GET /auth/google/callback endpoint), and the application will store the JWT token in a cookie.

### Copy the JWT Token:
- Once authenticated, inspect the cookies in your browser (Application → Cookies in Chrome Developer Tools).
- Find the JWT token stored in the cookies.

### Use the Token in Postman:
- Open Postman and make requests to the protected endpoints like `POST /shorten` or `GET /analytics/overall`.
- In the Headers section of Postman, add:
  ```
  Key: Authorization
  Value: Bearer <your-jwt-token>
  ```
  Replace `<your-jwt-token>` with the token copied from the browser.

### Test the API:
Now, you can send requests to the protected routes, and the API should respond based on your authentication and provided data.

