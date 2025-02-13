URL Shortener API

Description:
A simple URL Shortener API with features such as Google OAuth authentication, URL shortening, and analytics for both overall and specific shortened URLs. The API allows users to shorten URLs, view analytics, and manage their links securely.

Features:

    Google OAuth Authentication: Users can log in via Google OAuth.
    URL Shortening: Create short URLs from long URLs.
    Analytics: Track clicks and unique users for each shortened URL, along with overall analytics.
    Topic-based Analytics: Retrieve analytics based on specific topics.
    
API Documentation:

  Authentication
    
        GET /auth/google
        Description: Redirects the user to Google's login page to authenticate via Google OAuth.
        Response: Redirects to Google login (302).
        
        GET /auth/google/callback
        Description: Handles the Google OAuth callback and generates a JWT token.
        Responses:
        200: Login successful, returns a message and a JWT token.
        401: Authentication failed.

        
  URL Shortening
      
      POST /shorten
          Description: Creates a shortened version of a given long URL.
          Security: Requires Bearer token (JWT).
          
          Request Body:
          {
            "longUrl": "https://example.com/very-long-url",
            "customAlias" : "Bitcoin"  - optional field,
            "topic" : "Bitcoin"  - optional field
          }
          
          Responses:
              200: Short URL created. Example response:
              {
                "shortUrl": "http://short.ly/abc123",
                "createdAt" : date
              }
              400: Invalid URL.
              500: Internal Server Error.
              
      GET /shorten/{alias}
          Description: Redirects a short URL alias to its original long URL.
          Parameters: alias: The short URL alias (e.g., abc123).
          
          Responses:
            302: Redirecting to the long URL.
            404: Alias not found.
            500: Internal Server Error.
      
Analytics

      GET /analytics/overall
      Description: Fetches overall analytics, including the total number of URLs, clicks, and unique users.
      Security: Requires Bearer token (JWT).
      Responses:
          200: Overall analytics data:
          {
              "totalUrls": 4,
              "totalClicks": 4,
              "uniqueUsers": 2,
              "clicksByDate": [
                  {
                      "_id": "2025-02-12",
                      "totalClicks": 1
                  },
                  {
                      "_id": "2025-02-11",
                      "totalClicks": 2
                  },
                  {
                      "_id": "2025-02-02",
                      "totalClicks": 1
                  }
              ],
              "osType": [
                  {
                      "osName": "Windows",
                      "uniqueClicks": 4,
                      "uniqueUsers": 2
                  }
              ],
              "deviceType": [
                  {
                      "deviceName": "Desktop",
                      "uniqueClicks": 4,
                      "uniqueUsers": 2
                  }
              ]
          }
          401: Unauthorized access.
          500: Internal Server Error.
      GET /analytics/{alias}
          Description: Fetches analytics for a specific shortened URL.
          Parameters: alias: The alias of the shortened URL.
          Responses:
          200: Analytics data for the short URL:
          {
            "totalClicks": 100,
            "uniqueUsers": 50
          }
          404: No analytics found for the provided alias.
          500: Internal Server Error.
          
    GET /analytics/topic/{topic}
        Description: Fetches analytics for a specific topic.
        Parameters: topic: The topic name (e.g., technology).
        
        Responses:
            200: Analytics data for the topic:
            {
              "topic": "technology",
              "totalClicks": 300,
              "uniqueUsers": 150
            }
            400: No URLs found for this topic.
            500: Internal Server Error.
  
    Security
        The API uses JWT (JSON Web Tokens) for secure access to certain routes like URL shortening and analytics.
        Use the Authorization header with the format:

        Authorization: Bearer <JWT_TOKEN> --(postman)

Prerequisites:
    Node.js
    MongoDB
    Google OAuth credentials (Client ID and Secret)
    Redis
    
Setup
  Clone the repository:
  
      git clone https://github.com/shanmukasagar/URL_Shorten_API
      
  Install dependencies:

    npm install
    
Create a .env file in the root directory and add the following environment variables:

    PORT=5001
    JWT_SECRET=123456789
    MONGO_URI=mongodb+srv://shanmukasagar:sagar%4005@cluster0.3bton.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    REDIS_URI = redis://127.0.0.1:6379
    GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
    SESSION_SECRET = 123456789
    COOKIE_ENC_KEY = wJ5@zN8!dP3&kLmQ9vT$XyR#bF6G*HjK

    
Run the server:

    node app.js
    
Testing the API

    To test the API, follow these steps:
        
          Authenticate via Browser: Open the GET /auth/google endpoint in your browser.
          This will redirect you to Google’s OAuth login page.
          After logging in, Google will redirect back to your application (via the GET /auth/google/callback endpoint), and the application will store the JWT token in a cookie.
    
  Copy the JWT Token:

    Once authenticated, inspect the cookies in your browser (usually under Application → Cookies in Chrome Developer Tools).
    Find the JWT token stored in the cookies.
    
  Use the Token in Postman:
  
    Open Postman and make requests to the protected endpoints like POST /shorten or GET /analytics/overall.
    In the Headers section of Postman, add the following:
    Key: Authorization
    Value: Bearer <your-jwt-token>
    Replace <your-jwt-token> with the token you copied from the browser.
    
  Test the API:

    Now, you can send requests to the protected routes, and the API should respond based on your authentication and the data you provide.

