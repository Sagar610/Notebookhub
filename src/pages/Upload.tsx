import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Container,
  CircularProgress,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { pdfService } from '../services/pdfService';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const Upload: React.FC = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractPDFInfo = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const metadata = await pdf.getMetadata();

      // Get title from metadata or filename
      let pdfTitle = metadata.info?.Title || file.name.replace('.pdf', '');
      // Clean up the title (remove underscores, capitalize words)
      pdfTitle = pdfTitle
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

      // Get author from metadata or leave empty
      const pdfAuthor = metadata.info?.Author || '';

      setTitle(pdfTitle);
      if (pdfAuthor) {
        setAuthor(pdfAuthor);
      }
    } catch (error) {
      console.error('Error extracting PDF info:', error);
      // If extraction fails, just use the filename as title
      const defaultTitle = file.name.replace('.pdf', '')
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      setTitle(defaultTitle);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setMessage({ type: 'error', text: 'Please select a PDF file' });
        return;
      }
      setFile(selectedFile);
      setMessage(null);
      
      // Extract and auto-fill PDF information
      await extractPDFInfo(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !author) {
      setMessage({ type: 'error', text: 'Please fill in all fields and select a file' });
      return;
    }

    setLoading(true);
    try {
      await pdfService.uploadPDF(file, title, author);
      setMessage({ type: 'success', text: 'PDF uploaded successfully! Waiting for approval.' });
      setTitle('');
      setAuthor('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error uploading PDF. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Upload New Notes
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Share your handwritten study materials with others
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {message && (
          <Alert severity={message.type} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
            disabled={loading}
          />
          
          <TextField
            fullWidth
            label="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            margin="normal"
            required
            disabled={loading}
          />
          
          <Box
            sx={{
              mt: 3,
              p: 3,
              border: '2px dashed',
              borderColor: 'primary.main',
              borderRadius: 1,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              hidden
              accept=".pdf"
              onChange={handleFileChange}
              ref={fileInputRef}
              disabled={loading}
            />
            <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="body1" gutterBottom>
              {file ? file.name : 'Click to select a PDF file'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Maximum file size: 10MB
            </Typography>
          </Box>
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Upload PDF'
            )}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}; 