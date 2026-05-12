import {Router, Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import {success, z} from 'zod';

const router = Router();

router.post('/register', async(req, res)=>{
    try{
        const {email, password, name} = req.body;
        if(!email || !password ) return res.status(400).json({error: 'Email & password both required'});

        // check if existing user
        const existing = await prisma.user.findUnique({where: {email}});
        if(existing) return res.status(409).json({error: 'Email already in use'});

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: {email, hashedPassword, name},
        });

        const token = jwt.sign({sub: user.id}, process.env.JWT_SECRET!, {expiresIn: '7d'});
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 3600 * 1000,
        });
        return res.status(201).json({ user: {id: user.id, email: user.email, name: user.name} });
    
    } catch (err){
        console.error(err);
        return res.status(500).json({error: 'Internal server error'});
    }
});


// HANDLLING LOGIN SESSION
router.post('/login', async(req, res)=>{
    try{
        const {email, password} = req.body;
        const user = await prisma.user.findUnique({where: {email}});
        if(!user) return res.status(401).json({error: 'Invalid email'});

        const valid = await bcrypt.compare(password, user.hashedPassword);
        if(!valid) return res.status(401).json({error: 'Enter correct password'});

        const token = jwt.sign({sub: user.id}, process.env.JWT_SECRET!, {expiresIn: '7d'});
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 3600 * 1000,
        });
        return res.json({user: {id: user.id, email: user.email, name: user.name}});
    
    } catch(err){
        console.error(err);
        return res.status(500).json({error: 'Internal server error'});
    }
});


// HANDLING LOGIN SESSION
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({success: true});
});


// The '/me' route will be protected via middleware later - for now we'll read the cookie manually
router.get('/me', async(req, res)=> {
    try{
        const token = req.cookies.token;
        if(!token) return res.status(401).json({error: 'Unauthorized'});
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {sub: string};
        const user = await prisma.user.findUnique({
            where: {id: decoded.sub},
            select: {id: true, email: true, name: true},
        });
        if(!user) return res.status(401).json({error: 'User not found'});
        
        return res.json(user);

    } catch(err){
        return res.status(401).json({error: 'Invalid token'});
    }
});

export default router;