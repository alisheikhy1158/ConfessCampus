import express from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import {errorHandler, notFoundMiddleware }  from './middlewares/errorMiddleware.js';
import commentRoutes from "./routes/commentRoute.js";
import userRoutes from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";

dotenv.config({});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/posts", postRoute);

app.get('/', (req, res) => {
    res.send('ConfessCampus API running');
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
});

