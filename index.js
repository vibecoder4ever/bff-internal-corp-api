const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const sqlite3 = require('sqlite3').verbose();
const { execSync } = require('child_process');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());

// --- Database Initialization ---
const dbFile = './corp_data.db';
if (!fs.existsSync(dbFile)) {
    console.log('Database file not found. Running setup script...');
    try {
        execSync('node setup-database.js', { stdio: 'inherit' });
        console.log('Database setup complete.');
    } catch (error) {
        console.error('Failed to run setup script:', error);
        process.exit(1);
    }
}

// Connect to SQLite database
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// --- API Key Authentication ---
const API_KEY = process.env.BFF_INTERNAL_CORP_API_KEY;
if (!API_KEY) {
    console.error("BFF_INTERNAL_CORP_API_KEY is not set in the .env file. Please create a .env file and set the BFF_INTERNAL_CORP_API_KEY.");
    process.exit(1);
}

// --- Authentication Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }

  if (token === API_KEY) {
    req.user = { name: 'AuthenticatedUser' }; // Attach user info to the request
    next();
  } else {
    return res.sendStatus(403); // Forbidden
  }
};

// --- Swagger Definition ---
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'BFF Internal Corp API',
      version: '1.0.0',
      description: 'API for internal corporate services, with both public and private endpoints.',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./index.js', './api.js', './management-api.js'], // Scan all files with routes
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- Public API Router ---
const publicRouter = express.Router();

/**
 * @swagger
 * /api/v1/bff-internal-corp-api/health:
 *   get:
 *     summary: Get API health status
 *     description: Returns the health status of the API. This is a public endpoint.
 *     responses:
 *       200:
 *         description: API is healthy
 */
publicRouter.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

/**
 * @swagger
 * /api/v1/bff-internal-corp-api/uptime:
 *   get:
 *     summary: Get API uptime
 *     description: Returns the uptime of the API in seconds. This is a public endpoint.
 *     responses:
 *       200:
 *         description: A successful response
 */
publicRouter.get('/uptime', (req, res) => {
  res.json({ uptime: process.uptime() });
});

// Mounting the public router without authentication
app.use('/api/v1/bff-internal-corp-api', publicRouter);


// --- Authenticated API Routers ---
const apiRouter = require('./api.js');
const managementRouter = require('./management-api.js');

app.use('/api/v1/bff-internal-corp-api', authenticateToken, apiRouter);
app.use('/api/v1/bff-internal-corp-api', authenticateToken, managementRouter);

// --- Custom 404 Handler for API routes ---
app.use('/api', (req, res, next) => {
    res.status(404).json({ error: `route ${req.originalUrl} is not valid` });
});



// --- Server Start ---
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api/swagger`);
});