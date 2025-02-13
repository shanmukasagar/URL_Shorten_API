const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('./config/passport');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const shortUrlRoutes = require("./routes/shortenRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, 
  }));
app.use(express.json());
app.use(cookieParser());

// Session setup
app.use(session({ secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false, 
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }
}));
  
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use("/api", shortUrlRoutes);
app.use('/api/analytics', analyticsRoutes);

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication API',
      description: 'API for Google OAuth authentication and token management.',
      version: '1.0.0',
    },
  },
  apis: [path.join(__dirname, 'swagger.yml')], // Point to the path where your swagger.yml file is located
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (req, res) => {
  res.status(200).json("Hello, Application is ready to use");
})

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;

