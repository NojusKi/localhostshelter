import express from 'express';
import pool from '../config/database';
import { z } from 'zod';
import { authenticateToken } from './auth';
import { checkRole } from '../middleware/checkRole';

const router = express.Router();

// Pet validation schema
const petSchema = z.object({
    name: z.string().min(1, "Pet name is required"),
    type: z.string().min(1, "Pet type is required"),
    breed: z.string().optional(),
    age: z.number().min(0, "Age needs to be a positive number"),
    gender: z.string().optional(),
    size: z.string().optional(),
    description: z.string().optional(),
    image_url: z.string().optional() 
});

// Get all pets
router.get('/', async (req, res) => {
    try {
        const [pets] = await pool.execute(
            `SELECT p.*, 
            COALESCE(
              (SELECT COUNT(*) 
               FROM adoption_requests ar 
               WHERE ar.pet_id = p.id AND ar.status = 'pending'), 
              0
            ) as pending_requests
           FROM pets p 
           ORDER BY p.created_at DESC`  
        ) as any;

        res.json({
            success: true,
            data: pets
        });
    } catch(error) {
        console.error('Error fetching pets:', error);
        res.status(500).json({
            success: false,
            error: 'Error fetching pets'
        });
    }
});

// Add new pet (admin only permission)
router.post('/', authenticateToken, checkRole(['admin']), async (req, res) => {
    try {
        console.log('Received pet data:', req.body); // Debug log
        const petData = petSchema.parse(req.body);
        console.log('Validated pet data:', petData); // Debug log

        const [result] = await pool.execute(
            `INSERT INTO pets (
                name, type, breed, age, gender, size, description, image_url, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'available')`,
            [
                petData.name,
                petData.type,
                petData.breed || null,
                petData.age || null,
                petData.gender || null,
                petData.size || null,
                petData.description || null,
                petData.image_url || null 
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Pet added successfully'
        });
    } catch(error) {
        console.error('Error adding pet:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                error: error.errors
            });
        }
        res.status(500).json({
            success: false,
            error: 'Error adding pet'
        });
    }
});

// Get specific pet 
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [pets] = await pool.execute(
            'SELECT * FROM pets WHERE id = ?',
            [id]
        ) as any;

        if (!pets.length) {
            return res.status(404).json({
                success: false,
                error: 'Pet not found'
            });
        }

        res.json({
            success: true,
            data: pets[0]
        });
    } catch(error) {
        console.error('Error fetching pet:', error);
        res.status(500).json({
            success: false,
            error: 'Error fetching pet'
        });
    }
});

// Update pet (admin only)
router.put('/:id', authenticateToken, checkRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const petData = petSchema.parse(req.body);
        
        await pool.execute(
            `UPDATE pets SET
            name = ?, type = ?, breed = ?, age = ?, gender = ?,
            size = ?, description = ?, image_url = ?
            WHERE id = ?`,
            [
                petData.name,
                petData.type,
                petData.breed || null,
                petData.age || null,
                petData.gender || null,
                petData.size || null,
                petData.description || null,
                petData.image_url || null, 
                id
            ]
        );
        
        res.json({
            success: true,
            message: 'Pet updated successfully'
        });
    } catch(error) {
        console.error('Error updating pet:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                error: error.errors
            });
        }
        res.status(500).json({
            success: false,
            error: 'Error updating pet'
        });
    }
});

// Delete pet (admin only)
router.delete('/:id', authenticateToken, checkRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        await pool.execute(
            'DELETE FROM pets WHERE id = ?',
            [id]
        );
        
        res.json({
            success: true,
            message: 'Pet deleted successfully'
        });
    } catch(error) {
        console.error('Error deleting pet:', error);
        res.status(500).json({
            success: false,
            error: 'Error deleting pet'
        });
    }
});

export default router;