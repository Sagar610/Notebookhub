import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'https://notebookhub.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/handwrittennotes')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// PDF Model
const pdfSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileSize: { type: Number, required: true },
  isApproved: { type: Boolean, default: false },
  views: { type: Number, default: 0, required: true },
  downloads: { type: Number, default: 0, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const PDF = mongoose.model('PDF', pdfSchema);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Authentication middleware
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token is required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.get('/api/pdfs', async (req, res) => {
  try {
    const pdfs = await PDF.find({ isApproved: true }).sort({ createdAt: -1 });
    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching PDFs' });
  }
});

app.get('/api/pdfs/admin', authenticateToken, async (req, res) => {
  try {
    const pdfs = await PDF.find().sort({ createdAt: -1 });
    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching PDFs' });
  }
});

app.post('/api/pdfs/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newPDF = new PDF({
      title: req.body.title,
      author: req.body.author,
      fileUrl: `/uploads/${req.file.filename}`,
      fileSize: req.file.size,
      isApproved: false,
      views: 0,
      downloads: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newPDF.save();
    res.status(201).json(newPDF);
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).json({ message: 'Error uploading PDF' });
  }
});

app.patch('/api/pdfs/:id/approve', authenticateToken, async (req, res) => {
  try {
    const pdf = await PDF.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    res.json(pdf);
  } catch (error) {
    res.status(500).json({ error: 'Error approving PDF' });
  }
});

app.patch('/api/pdfs/:id', async (req, res) => {
  try {
    const pdf = await PDF.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(pdf);
  } catch (error) {
    res.status(500).json({ error: 'Error updating PDF' });
  }
});

app.delete('/api/pdfs/:id', async (req, res) => {
  try {
    await PDF.findByIdAndDelete(req.params.id);
    res.json({ message: 'PDF deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting PDF' });
  }
});

// Track PDF view
app.post('/api/pdfs/:id/view', async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }
    
    // Increment views and update timestamp
    pdf.views += 1;
    pdf.updatedAt = new Date();
    
    await pdf.save();
    res.json({ views: pdf.views });
  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).json({ message: 'Error tracking view' });
  }
});

// Track PDF download
app.post('/api/pdfs/:id/download', async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }
    
    // Increment downloads and update timestamp
    pdf.downloads += 1;
    pdf.updatedAt = new Date();
    
    await pdf.save();
    res.json({ downloads: pdf.downloads });
  } catch (error) {
    console.error('Error tracking download:', error);
    res.status(500).json({ message: 'Error tracking download' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // In a real application, you would validate against a database
  // For now, we'll use a hardcoded admin user
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Serve static files
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 