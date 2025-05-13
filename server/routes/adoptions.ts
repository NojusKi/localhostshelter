import express from 'express';
import pool from '../config/database';
import { z } from 'zod';
import { authenticateToken } from './auth';

const router = express.Router();

// Validation schema for adoption requests
const adoptionSchema = z.object({
  petId: z.number(),
  userId: z.number(),
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  address: z.string().min(5, "Address is required"),
  experience: z.string().optional(),
  reason: z.string().min(10, "Please provide a detailed reason for adoption")
});

// Submit adoption request
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const adoptionData = adoptionSchema.parse(req.body);
    
    // Verify user is requesting for themselves
    if (req.user.userId !== adoptionData.userId) {
      return res.status(403).json({ 
        success: false,
        error: 'Unauthorized to submit adoption request for another user' 
      });
    }

    // Check if pet is still available
    const [pets] = await pool.execute(
      'SELECT status FROM pets WHERE id = ?',
      [adoptionData.petId]
    ) as any;

    if (!pets.length || pets[0].status !== 'available') {
      return res.status(400).json({ 
        success: false,
        error: 'Pet is no longer available for adoption' 
      });
    }

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Create adoption request
      await connection.execute(
        'INSERT INTO adoption_requests (pet_id, user_id, message, status) VALUES (?, ?, ?, "pending")',
        [adoptionData.petId, adoptionData.userId, adoptionData.reason]
      );
      
      // Update pet status
      await connection.execute(
        'UPDATE pets SET status = "pending" WHERE id = ?',
        [adoptionData.petId]
      );

      await connection.commit();
      
      res.status(201).json({ 
        success: true,
        message: 'Adoption request submitted successfully' 
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false,
        error: error.errors 
      });
    }
    console.error('Error submitting adoption request:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error submitting adoption request' 
    });
  }
});

// Get user's adoption requests
router.get('/user/:userId', authenticateToken, async (req: any, res) => {
  try {
    // Verify user is requesting their own adoptions
    if (req.user.userId !== parseInt(req.params.userId)) {
      return res.status(403).json({ 
        success: false,
        error: 'Unauthorized to view another user\'s adoption requests' 
      });
    }
    //fetching the adoption requests from the database
    const [requests] = await pool.execute(
      `SELECT ar.*, p.name as pet_name, p.image_url, p.breed, p.age, p.type 
       FROM adoption_requests ar 
       JOIN pets p ON ar.pet_id = p.id 
       WHERE ar.user_id = ?
       ORDER BY ar.created_at DESC`,
      [req.params.userId]
    ) as any;
    
    res.json({ 
      success: true,
      data: requests 
    });
  } catch (error) {
    console.error('Error fetching adoption requests:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error fetching adoption requests' 
    });
  }
});

export default router;