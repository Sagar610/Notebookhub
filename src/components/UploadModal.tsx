import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { pdfService } from '../services/pdfService';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({
  open,
  onClose,
  onUploadSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      
      // Log file details for debugging
      console.log('Selected file details:', {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        lastModified: new Date(selectedFile.lastModified).toISOString()
      });
      
      // Check file type more thoroughly
      if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
        setError('Please select a valid PDF file');
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Check file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (selectedFile.size > maxSize) {
        setError('File size should be less than 10MB');
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Check if file is empty
      if (selectedFile.size === 0) {
        setError('The selected file is empty');
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    // Reset error state
    setError(null);

    // Validate all required fields
    if (!file || !title || !author) {
      setError('Please fill in all fields and select a file');
      return;
    }

    // Validate title and author
    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();

    if (trimmedTitle.length < 3) {
      setError('Title should be at least 3 characters long');
      return;
    }

    if (trimmedAuthor.length < 3) {
      setError('Author name should be at least 3 characters long');
      return;
    }

    try {
      setLoading(true);
      
      // Attempt upload
      await pdfService.uploadPDF(file, trimmedTitle, trimmedAuthor);
      
      // Show success message
      alert('PDF uploaded successfully! It will be visible after admin approval.');
      onUploadSuccess();
      handleClose();
    } catch (error) {
      console.error('Upload failed:', error);
      setError(
        error instanceof Error 
          ? error.message 
          : 'Failed to upload PDF. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setAuthor('');
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload PDF</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            variant="outlined"
            required
          />
          <TextField
            label="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            fullWidth
            variant="outlined"
            required
          />
          <Button
            variant="outlined"
            component="label"
            sx={{ mt: 2 }}
          >
            Select PDF File
            <input
              type="file"
              hidden
              accept=".pdf"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </Button>
          {file && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Selected file: {file.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
              </Typography>
            </Box>
          )}
          {error && (
            <Typography 
              color="error" 
              variant="body2"
              sx={{ 
                backgroundColor: 'error.light',
                color: 'error.contrastText',
                p: 1,
                borderRadius: 1
              }}
            >
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          color="primary"
          disabled={loading || !file || !title || !author}
        >
          {loading ? <CircularProgress size={24} /> : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadModal; 