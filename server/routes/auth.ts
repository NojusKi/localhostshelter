import express from 'express';
import bcrypt from  'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { z } from 'zod';

const router = express.Router();

const registerSchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['user', 'admin']).default('user'),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

const profileUpdateSchema = z.object({
    fullName: z.string().min(2).optional(),
    email: z.string().email().optional(),
    currentPassword: z.string(),
    newPassword: z.string().min(6).optional(),
    preferences: z.object({
        notifications: z.boolean(),
        newsletter: z.boolean()
    }).optional()
});

// verify JWT token (middleware)
export const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token){
        return res.status(401).json({error: 'Authentication required'});
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err: any, user: any) => {
        if (err){
            return res.status(403).json({ error: 'Invalid token'});     
        }
        req.user = user;
        next();
    });
};

router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password, role } = registerSchema.parse(req.body);
        
        // Check if email already exists
        const [existingUsers] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        ) as any;

        if (existingUsers.length > 0) {
            return res.status(400).json({ error: "Email already registered" });
        }

            const hashedPassword = await bcrypt.hash(password, 10);

            await pool.execute(
                'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
            [fullName, email, hashedPassword, role || 'user']
            );

        res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
            }
            console.error('Registration error:', error);
        res.status(500).json({ error: "Error registering user" });
    }
});


//login user 
router.post('/login', async (req, res) =>{
    try{
        const {email, password }= loginSchema.parse(req.body);

        const [users] = await pool.execute(
            'SELECT id, email, full_name, password, role FROM users WHERE email = ?',
            [email]
        ) as any;
        
        if (!users.length){
            return res.status(401).json({error: 'Invalid credentials'});
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword){
            return res.status(401).json({error: 'Invalid credentials'});
    }

    const token = jwt.sign(
        {userId: user.id, role: user.role},
        process.env.JWT_SECRET || 'your-secret-key',
        {expiresIn: '48h'}
    );

    res.json({
        token,
        user: {
            id: user.id,
            email: user.email,
            fullName: user.full_name,
                role: user.role
        }
    });
} catch (error){
    if (error instanceof z.ZodError){
        return res.status(400).json({error: error.errors});
    }
    console.error('Login error:', error);
    res.status(500).json({error: 'Error logging in'});
}
  });

//getting user profile
router.get('/profile', authenticateToken, async (req: any, res) =>{
    try{
        const [users] = await pool.execute(
            'SELECT id, full_name, email, role, created_at FROM users WHERE id = ?',
            [req.user.userId]
        ) as any;

        if (!users.length){
            return res.status(404).json({error:'User not found'}); 
    }
    
    res.json({
        success: true,
        data: users[0]
    });
    } catch (error){
        console.error('Profile error:', error);
        res.status(500).json({error: 'Error fetching profile'});
    }
    });

// user profile update
router.put('/profile', authenticateToken, async (req: any, res) =>{
    try{
        const {fullName, email, currentPassword, newPassword, preferences } =
        profileUpdateSchema.parse(req.body);
        //verifying the current password
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE id = ?',
            [req.user.userId]
        ) as any;
        
        if (!users.length){
            return res.status(404).json({error: 'User not found'});
        }

        const validPassword = await bcrypt.compare(currentPassword, users[0].password);
        if (!validPassword){
            return res.status(401).json({error: 'Incorrect current password'});
        }

        //update users information
        const updates: any = {};
        if (fullName) updates.full_name = fullName;
        if (email) updates.email = email;
        if (newPassword) updates.password = await bcrypt.hash(newPassword, 10);
        if (preferences) updates.preferences = JSON.stringify(preferences);

        if (Object.keys(updates).length > 0){
            const setClauses = Object.keys(updates).map(key => `${key} = ?`).join(', ');
            const values = [...Object.values(updates), req.user.userId];

            await pool.execute(
                `UPDATE users SET ${setClauses} WHERE id = ?`,
                values
            );
        }
        res.json({
            success: true,
            message: 'Profile updated successfully'
        });
    }catch (error){
        if (error instanceof z.ZodError){
            return res.status(400).json({error: error.errors});
        }
        console.error('Profile update error:', error);
        res.status(500).json({error: 'Error updating profile'});
    }
});
export default router;
