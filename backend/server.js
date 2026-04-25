import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/auth.js'
import todoRoutes from './routes/todoRoutes.js'
import { connectDB } from './config/db.js';
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use("/api/users", authRoutes);

app.use("/api/todos", todoRoutes);

connectDB();

app.listen(PORT, () => {
    console.log(`Server Started at port ${PORT}`);
});


