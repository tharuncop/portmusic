import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import {authMiddleware} from './middleware/auth';

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Public routes here
app.use('/api/auth', authRoutes);

// Protected test Route
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({message: 'You are authenticated', userId: req.userId});
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{
    console.log(`API running on http://localhost:${PORT}`);
});