import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import xssClean from 'xss-clean';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth';
import petRoutes from './routes/pets';
import adoptionRoutes from './routes/adoptions';
import contactRoutes from './routes/contact';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173',
  credentials: true
}));

app.use(helmet())
app.use(xssClean());
if (process.env.NODE_ENV !== 'development') {
  app.use(rateLimit({
    windowMs: 15*60*1000,
    max: 100
  }));
}

//body parser with limit
app.use(express.json({ limit: '10kb'}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/contact', contactRoutes);

//gkobal error handling
app.use((err: any, req: express.Request, res: express.Response, next:
  express.NextFunction) => {
    console.error('Error:',err.stack);

    const errorResponse = {
      status: 'error',
      message: err.message || "internal server error",
      ...(process.env.NODE_ENV === 'development' && {stack: err.stack})
    };
    res.status(err.status|| 500).json(errorResponse);
  });

//unhandled routes
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot find ${req.originalUrl} on this server!`,
  });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection!');
  console.error(err.name, err.message);
  process.exit(1);
});