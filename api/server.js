import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

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
    origin: "http://localhost:5173", // Your React app URL
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
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = payload;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token verification failed" });
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
app.get("/api/me", authMiddleware, async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];

    const accessTokenPayload = await verifyToken(accessToken, {
      returnPayload: true,
    });

    if (!accessTokenPayload) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const refreshTokenPayload = await verifyToken(accessTokenPayload.data, {
      returnPayload: true,
    });

    if (!refreshTokenPayload) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const user = getUserById(refreshTokenPayload.data);

    res.json({
      accessToken: process.env.USE_AUTH ? accessToken : null,
      user: process.env.USE_AUTH ? cleanUser(user) : null,
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

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      const accessToken = await generateAccessToken(refreshToken);

      res.json({
        accessToken: process.env.USE_AUTH ? accessToken : null,
        user: process.env.USE_AUTH ? cleanUser(user) : null,
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

    const refreshTokenPayload = refreshToken
      ? await verifyToken(refreshToken, { returnPayload: true })
      : false;

    if (process.env.USE_AUTH && !refreshTokenPayload) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const user = getUserById(refreshTokenPayload.data);
    const accessToken = await generateAccessToken(refreshToken);

    res.json(
      process.env.USE_AUTH ? { accessToken, user: cleanUser(user) } : null
    );
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
