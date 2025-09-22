// server.js
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

// Load environment variables
dotenv.config();

// Import your helper functions
import { initializeDatabase } from "./database.js";
import {
  cleanUser,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "./helpers.js";
import { createListing, getListingById, getListings } from "./listings.js";
import { getLocationById } from "./locations.js";
import { getReviewsByListingId } from "./reviews.js";
import { getUser, getUserById } from "./users.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database with seed data
initializeDatabase();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Your React app URL
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Auth middleware
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const payload = await verifyToken(token, { returnPayload: true });
    if (!payload) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    req.user = payload;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Unauthorized" });
  }
};

// Routes

// Get single listing
app.get("/api/listings/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const listing = getListingById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const location = getLocationById(listing.locationId);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.json({ ...listing, location });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all listings
app.get("/api/listings", authMiddleware, async (req, res) => {
  try {
    const listings = getListings(req.query);

    const domainListings = listings.map((listing) => {
      const location = getLocationById(listing.locationId);
      return { ...listing, location };
    });

    res.json(domainListings);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create listing
app.post("/api/listings", authMiddleware, async (req, res) => {
  try {
    const listing = createListing(req.body);
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get reviews for a listing
app.get("/api/reviews", authMiddleware, async (req, res) => {
  try {
    const reviews = getReviewsByListingId(req.query.listingId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get current user
app.get("/api/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({ message: "Access token required" });
    }

    const accessTokenPayload = await verifyToken(accessToken, {
      returnPayload: true,
    });

    if (!accessTokenPayload) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const user = getUserById(accessTokenPayload.userId);

    if (!user) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json({
      accessToken: process.env.USE_AUTH === "true" ? accessToken : null,
      user: process.env.USE_AUTH === "true" ? cleanUser(user) : null,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Sign in
app.post("/api/signin", async (req, res) => {
  try {
    const user = getUser(req.body);

    if (user) {
      const refreshToken = await generateRefreshToken(user.id);

      // Set HTTP-only cookie for security
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      const accessToken = await generateAccessToken(user.id);

      res.json({
        accessToken: process.env.USE_AUTH === "true" ? accessToken : null,
        user: process.env.USE_AUTH === "true" ? cleanUser(user) : null,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Refresh token
app.get("/api/refreshToken", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const refreshTokenPayload = await verifyToken(refreshToken, {
      returnPayload: true,
    });

    if (!refreshTokenPayload) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const user = getUserById(refreshTokenPayload.userId);

    if (!user) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const accessToken = await generateAccessToken(user.id);

    res.json({
      accessToken: process.env.USE_AUTH === "true" ? accessToken : null,
      user: process.env.USE_AUTH === "true" ? cleanUser(user) : null,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Sign out
app.post("/api/signout", authMiddleware, (req, res) => {
  try {
    res.clearCookie("refreshToken");
    res.json({ message: "Signed out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Basic health-check route used for local status checks
app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
