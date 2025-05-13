import express from 'express';
import { z } from 'zod';

// contact form validation schma
const contactSchema = z.object({
    name: z.string().min(2, "Name must be atleast 2 characters"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(2, "Subject must be atleast 2 characters"),
    message: z.string().min(10, "Message must be atleast 10 characters")
})

const router = express.Router();

router.post('/', async (req, res) =>{
    try{
        // incoming data validation
        const contactData = contactSchema.parse(req.body);

        // email is just returned without sending 
        res.status(200).json({
            success: true,
            message: 'Message sent successfully'
        });
    }catch (error){
        if (error instanceof z.ZodError){
            return res.status(400).json({
                success: false,
                error: error.errors
            });
        }
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            error: 'An error occurred while sending the message'
        });
    }
});

export default router;
