import dotenv from 'dotenv';

// Load env vars first, before any other imports
dotenv.config({});

import express from 'express';
import session from 'express-session';
import cors from 'cors';
import connectDB from './utils/db.js';
import { errorHandler } from './middlewares/errorMiddleware.js';
import { authMiddleware } from './middlewares/authMiddleware.js';
import passport, { initializeGoogleStrategy } from './config/passport.js';
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";
import messageRoute from "./routes/messageRoute.js";
import commentRoute from "./routes/commentRoute.js";
import reportRoute from "./routes/reportRoute.js";

// Initialize Google OAuth strategy after env vars are loaded
initializeGoogleStrategy();

const app = express();

// CORS configuration
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware for OAuth
app.use(session({
    secret: process.env.ACCESS_TOKEN_SECRET || 'session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Public routes
app.use("/api/auth", authRoute);

// Protected routes
app.use("/api/users", authMiddleware, userRoute);
app.use("/api/posts", authMiddleware, postRoute);
app.use("/api/comments", commentRoute); // Public route with protected endpoints
app.use("/api/reports", reportRoute); // Public route with protected endpoints
app.use("/api/messages", authMiddleware, messageRoute);

app.get('/', (req, res) => {
    res.send('Whisper Campus API running');
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
});

