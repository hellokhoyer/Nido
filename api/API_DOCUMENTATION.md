# Nido API Documentation

A RESTful Mock API for a property rental platform similar to Airbnb. This API provides authentication, property listings management, location services, and reviews functionality.

## Base URL

```
http://localhost:3001/api
```

## Authentication

This API uses JWT (JSON Web Token) authentication with access tokens and refresh tokens.

### Authentication Headers

```
Authorization: Bearer <access_token>
```

### Environment Variables

Make sure to set these environment variables in your `.env` file:

- `USE_AUTH=true` - Enable authentication (set to false for development without auth)
- `JWT_SECRET=your-super-secret-jwt-key-change-this-in-production`
- `NODE_ENV=development`
- `PORT=3001`

## Endpoints

### 1. Authentication Endpoints

#### Sign In

**POST** `/api/signin`

Authenticate a user and receive access and refresh tokens.

**Request Body:**

```json
{
  "email": "hello@abulkhoyer.com",
  "password": "hellokhoyer"
}
```

**Response (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "avatarUrl": "https://i.pravatar.cc/150?img=1",
    "bio": "Hello, I am User One, your friendly host...",
    "email": "hello@abulkhoyer.com",
    "firstName": "Abul",
    "lastName": "Khoyer",
    "initials": "AK",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "modifiedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

**Error Response (401 Unauthorized):**

```json
{
  "message": "Invalid credentials"
}
```

#### Get Current User

**GET** `/api/me`

Get the current authenticated user's information.

**Headers:** `Authorization: Bearer <access_token>`

**Response (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "avatarUrl": "https://i.pravatar.cc/150?img=1",
    "bio": "Hello, I am User One, your friendly host...",
    "email": "hello@abulkhoyer.com",
    "firstName": "Abul",
    "lastName": "Khoyer",
    "initials": "AK",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "modifiedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Refresh Token

**GET** `/api/refreshToken`

Get a new access token using the refresh token stored in HTTP-only cookies.

**Response (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "firstName": "Abul",
    "lastName": "Khoyer",
    "email": "hello@abulkhoyer.com"
  }
}
```

#### Sign Out

**POST** `/api/signout`

Sign out the current user and clear the refresh token.

**Headers:** `Authorization: Bearer <access_token>`

**Response (200 OK):**

```json
{
  "message": "Signed out successfully"
}
```

### 2. Listings Endpoints

#### Get All Listings

**GET** `/api/listings`

Retrieve all property listings with optional filtering.

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**

- `search` (string, optional) - Search listings by name
- `guests` (number, optional) - Filter by maximum guest capacity
- `dates` (object, optional) - Filter by availability dates
  - `from` (ISO date string) - Check-in date
  - `to` (ISO date string) - Check-out date

**Example Request:**

```
GET /api/listings?search=london&guests=4
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "name": "Cozy Apartment in London",
    "description": "This beautiful and spacious apartment is located in the heart of London...",
    "images": ["listing1-1.jpg", "listing1-2.jpg", "listing1-3.jpg"],
    "rating": 4.5,
    "price": 100,
    "maxGuests": 4,
    "availability": {
      "from": "2023-01-01T00:00:00.000Z",
      "to": "2023-01-08T00:00:00.000Z"
    },
    "userId": 1,
    "locationId": 1,
    "location": {
      "id": 1,
      "name": "London",
      "country": "United Kingdom",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "modifiedAt": "2023-01-01T00:00:00.000Z"
    },
    "createdAt": "2023-01-01T00:00:00.000Z",
    "modifiedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Get Single Listing

**GET** `/api/listings/:id`

Retrieve a specific listing by ID.

**Headers:** `Authorization: Bearer <access_token>`

**Path Parameters:**

- `id` (number) - The listing ID

**Example Request:**

```
GET /api/listings/1
```

**Response (200 OK):**

```json
{
  "id": 1,
  "name": "Cozy Apartment in London",
  "description": "This beautiful and spacious apartment is located in the heart of London...",
  "images": ["listing1-1.jpg", "listing1-2.jpg", "listing1-3.jpg"],
  "rating": 4.5,
  "price": 100,
  "maxGuests": 4,
  "availability": {
    "from": "2023-01-01T00:00:00.000Z",
    "to": "2023-01-08T00:00:00.000Z"
  },
  "userId": 1,
  "locationId": 1,
  "location": {
    "id": 1,
    "name": "London",
    "country": "United Kingdom",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "modifiedAt": "2023-01-01T00:00:00.000Z"
  },
  "createdAt": "2023-01-01T00:00:00.000Z",
  "modifiedAt": "2023-01-01T00:00:00.000Z"
}
```

**Error Response (404 Not Found):**

```json
{
  "message": "Listing not found"
}
```

#### Create New Listing

**POST** `/api/listings`

Create a new property listing.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**

```json
{
  "name": "Beautiful Villa in Paris",
  "description": "A stunning villa with amazing views...",
  "locationId": 2,
  "images": ["villa1.jpg", "villa2.jpg"],
  "price": 250,
  "maxGuests": 8,
  "availability": {
    "from": "2023-02-01T00:00:00.000Z",
    "to": "2023-02-28T00:00:00.000Z"
  }
}
```

**Response (200 OK):**

```json
{
  "id": 13,
  "name": "Beautiful Villa in Paris",
  "description": "A stunning villa with amazing views...",
  "locationId": 2,
  "images": ["villa1.jpg", "villa2.jpg"],
  "price": 250,
  "maxGuests": 8,
  "availability": {
    "from": "2023-02-01T00:00:00.000Z",
    "to": "2023-02-28T00:00:00.000Z"
  },
  "userId": 1,
  "createdAt": "2023-01-15T10:30:00.000Z",
  "modifiedAt": "2023-01-15T10:30:00.000Z"
}
```

### 3. Reviews Endpoints

#### Get Reviews for a Listing

**GET** `/api/reviews`

Get all reviews for a specific listing.

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**

- `listingId` (number, required) - The listing ID

**Example Request:**

```
GET /api/reviews?listingId=1
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "userId": 1,
    "listingId": 1,
    "rating": 5,
    "comment": "Absolutely fantastic stay! The apartment was spotless, cozy, and had everything we needed...",
    "createdAt": "2023-01-10T00:00:00.000Z",
    "modifiedAt": "2023-01-10T00:00:00.000Z"
  },
  {
    "id": 5,
    "userId": 1,
    "listingId": 1,
    "rating": 5,
    "comment": "We loved our stay at this modern apartment in London...",
    "createdAt": "2023-01-05T00:00:00.000Z",
    "modifiedAt": "2023-01-05T00:00:00.000Z"
  }
]
```

## Error Responses

All endpoints can return the following error responses:

### 401 Unauthorized

```json
{
  "message": "Access token required"
}
```

### 403 Forbidden

```json
{
  "message": "Invalid token"
}
```

### 404 Not Found

```json
{
  "message": "Route not found"
}
```

### 500 Internal Server Error

```json
{
  "message": "Internal server error"
}
```

## Data Models

### User Model

```typescript
interface User {
  id: number;
  avatarUrl: string;
  bio: string;
  email: string;
  firstName: string;
  lastName: string;
  initials: string;
  password: string; // Not returned in API responses
  createdAt: Date;
  modifiedAt: Date;
}
```

### Listing Model

```typescript
interface Listing {
  id: number;
  name: string;
  description: string;
  locationId: number;
  images: string[];
  rating: number;
  price: number;
  maxGuests: number;
  availability: {
    from: Date;
    to: Date;
  };
  userId: number;
  location?: Location; // Populated in API responses
  createdAt: Date;
  modifiedAt: Date;
}
```

### Location Model

```typescript
interface Location {
  id: number;
  name: string;
  country: string;
  createdAt: Date;
  modifiedAt: Date;
}
```

### Review Model

```typescript
interface Review {
  id: number;
  userId: number;
  listingId: number;
  rating: number;
  comment: string;
  createdAt: Date;
  modifiedAt: Date;
}
```

## Frontend Integration Examples

### JavaScript/Fetch API

```javascript
// Sign in
const signIn = async (email, password) => {
  const response = await fetch("http://localhost:3001/api/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Important for cookies
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Sign in failed");
  }

  return response.json();
};

// Get listings with authorization
const getListings = async (accessToken, filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`http://localhost:3001/api/listings?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch listings");
  }

  return response.json();
};
```

### React Example

```jsx
import { useState, useEffect } from "react";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const signIn = async (email, password) => {
    const response = await fetch("http://localhost:3001/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    setUser(data.user);
    setAccessToken(data.accessToken);
  };

  return { user, accessToken, signIn };
};

const ListingsComponent = ({ accessToken }) => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      const response = await fetch("http://localhost:3001/api/listings", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      setListings(data);
    };

    if (accessToken) {
      fetchListings();
    }
  }, [accessToken]);

  return (
    <div>
      {listings.map((listing) => (
        <div key={listing.id}>
          <h3>{listing.name}</h3>
          <p>{listing.description}</p>
          <p>Price: ${listing.price}/night</p>
          <p>
            Location: {listing.location.name}, {listing.location.country}
          </p>
        </div>
      ))}
    </div>
  );
};
```

### Axios Example

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true, // For cookies
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API methods
const authAPI = {
  signIn: (email, password) => api.post("/signin", { email, password }),

  getCurrentUser: () => api.get("/me"),

  signOut: () => api.post("/signout"),
};

const listingsAPI = {
  getAll: (params = {}) => api.get("/listings", { params }),

  getById: (id) => api.get(`/listings/${id}`),

  create: (listing) => api.post("/listings", listing),
};

const reviewsAPI = {
  getByListingId: (listingId) => api.get("/reviews", { params: { listingId } }),
};
```

## Setup Instructions

1. **Clone and Install Dependencies:**

   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env` file with the required variables (see Authentication section above).

3. **Start the Server:**

   ```bash
   npm start
   # Server will run on http://localhost:3001
   ```

4. **Development Mode:**
   ```bash
   npm run dev
   # Uses nodemon for auto-restart
   ```

## CORS Configuration

The API is configured to accept requests from `http://localhost:5173` (Vite default) with credentials enabled. To modify this for your frontend:

1. Update the CORS configuration in `server.js`:

   ```javascript
   app.use(
     cors({
       origin: "http://your-frontend-url:port",
       credentials: true,
     })
   );
   ```

2. Or use environment variables in `.env`:
   ```
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
   ```

## Demo Credentials

Use these credentials to test the API:

- **Email:** `hello@abulkhoyer.com`
- **Password:** `hellokhoyer`

The API includes sample data with 12 listings across London and Paris, complete with reviews and user information.
