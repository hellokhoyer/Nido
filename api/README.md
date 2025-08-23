# Nido API

A RESTful Mock API server built with Express.js for a property rental platform similar to Airbnb. I will implement the frontend of the project later.

## Features

- JWT-based authentication with access/refresh tokens
- Property listings management (CRUD operations)
- Location services
- Reviews and ratings system
- File-based database for development
- Secure HTTP-only cookies for refresh tokens
- CORS support for frontend integration

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the server:**

   ```bash
   npm start
   ```

   The API will be available at `http://localhost:3001`

3. **For development (auto-restart):**
   ```bash
   npm run dev
   ```

## Demo Access

Test the API with these credentials:

- **Email:** `hello@abulkhoyer.com`
- **Password:** `hellokhoyer`

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for comprehensive documentation including:

- All available endpoints
- Authentication flow
- Request/response examples
- Frontend integration guides (React, Vanilla JS, Axios)
- TypeScript interfaces
- Error handling

## Environment Configuration

Create a `.env` file in the project root:

```env
# Server
NODE_ENV=development
PORT=3001

# Authentication
USE_AUTH=true
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=30d

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Project Structure

```
api/
├── server.js              # Main Express server
├── helpers.js             # JWT utilities & database helpers
├── database.js            # Database initialization
├── listings.js            # Listings endpoints logic
├── users.js               # User management
├── locations.js           # Location services
├── reviews.js             # Reviews functionality
├── data/                  # Sample data
│   ├── listings.js
│   ├── users.js
│   ├── locations.js
│   └── reviews.js
├── package.json
├── .env                   # Environment variables
└── database.json          # Generated database file
```

## Key Endpoints

- `POST /api/signin` - Authenticate user
- `GET /api/me` - Get current user
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create new listing
- `GET /api/reviews?listingId=1` - Get reviews for listing

## Sample Data

The API includes:

- 12 property listings (London & Paris)
- 12+ reviews across different properties
- 1 demo user account
- 2 locations (London, Paris)

## Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JOSE** - JWT handling
- **date-fns** - Date utilities
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **cookie-parser** - Cookie handling

## Frontend Integration

This API works with any frontend framework or vanilla JavaScript. See the documentation for examples with:

- React
- Vue.js
- Vanilla JavaScript (Fetch API)
- Axios

## Database

The API uses a simple file-based database (`database.json`) for development. Data is automatically seeded on first run and persisted between restarts.

For production, you would typically integrate with a proper database like PostgreSQL, MongoDB, or MySQL.

## Security Features

- JWT access tokens (15-minute expiry)
- Secure refresh tokens (30-day expiry, HTTP-only cookies)
- CORS protection
- Request validation
- Password excluded from API responses

## Development

The API is set up with ES6 modules and includes:

- Auto-restart with nodemon
- Environment-based configuration
- Comprehensive error handling
- Consistent API responses

## License

MIT License - feel free to use this for learning or as a starting point for your own projects!
