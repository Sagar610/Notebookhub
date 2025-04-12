import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Box,
  Dialog,
  IconButton,
  Paper,
  Tooltip,
  Chip,
  Badge,
} from '@mui/material';
import { Download, Close, Edit, Delete, CheckCircle } from '@mui/icons-material';
import EditModal from './EditModal';
import { getFullUrl } from '../config/api';
import { PDF } from '../types/pdf';
import { pdfService } from '../services/pdfService';

interface PDFCardProps {
  pdf: PDF | null;
  isAdmin?: boolean;
  onEdit?: (pdf: PDF) => void;
  onDelete?: (id: string) => void;
  onApprove?: (id: string) => void;
}

const PDFCard: React.FC<PDFCardProps> = ({
  pdf,
  isAdmin = false,
  onEdit,
  onDelete,
  onApprove,
}) => {
  if (!pdf) {
    return null;
  }

  const [previewOpen, setPreviewOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [views, setViews] = useState(pdf.views || 0);
  const [downloads, setDownloads] = useState(pdf.downloads || 0);

  // Fetch latest counts when component mounts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await pdfService.getPDFs();
        const updatedPDF = response.find(p => p._id === pdf._id);
        if (updatedPDF) {
          setViews(updatedPDF.views || 0);
          setDownloads(updatedPDF.downloads || 0);
        }
      } catch (error) {
        console.error('Error fetching PDF counts:', error);
      }
    };

    fetchCounts();
  }, [pdf._id]);

  const handlePreview = async () => {
    try {
      const updatedViews = await pdfService.trackView(pdf._id);
      if (updatedViews !== undefined) {
        setViews(updatedViews);
      }
      setPreviewOpen(true);
    } catch (error) {
      console.error('Error tracking view:', error);
      // Increment locally if server update fails
      setViews(prev => prev + 1);
      setPreviewOpen(true);
    }
  };

  const handleDownload = async () => {
    try {
      const updatedDownloads = await pdfService.trackDownload(pdf._id);
      if (updatedDownloads !== undefined) {
        setDownloads(updatedDownloads);
      }
      const link = document.createElement('a');
      link.href = getFullUrl(pdf.fileUrl);
      link.download = pdf.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error tracking download:', error);
      // Increment locally if server update fails
      setDownloads(prev => prev + 1);
      const link = document.createElement('a');
      link.href = getFullUrl(pdf.fileUrl);
      link.download = pdf.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const iframeStyle = {
    width: '100%',
    height: '100%',
    border: 'none',
  };

  const embedStyle = `
    <style>
      #toolbar { display: none !important; }
      #toolbarContainer { display: none !important; }
      .toolbar { display: none !important; }
      header { display: none !important; }
      #download { display: none !important; }
      #print { display: none !important; }
      #secondaryToolbar { display: none !important; }
    </style>
  `;

  return (
    <>
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          cursor: 'pointer',
          '&:hover': {
            boxShadow: 6,
          },
        }}
        onClick={handlePreview}
      >
        {/* PDF Thumbnail Preview */}
        <Paper
          elevation={0}
          sx={{
            height: { xs: 200, sm: 250, md: 280 },
            width: '100%',
            bgcolor: 'grey.100',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            position: 'relative',
            '&:hover': {
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.1)',
              }
            }
          }}
        >
          <iframe
            src={`${getFullUrl(pdf.fileUrl)}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              pointerEvents: 'none', // Disable interaction with the iframe
            }}
            title={`${pdf.title} Preview`}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '30px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'white',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              Click to view full PDF
            </Typography>
          </Box>
        </Paper>

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div" gutterBottom>
            {pdf.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Author: {pdf.author}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Size: {(pdf.fileSize / (1024 * 1024)).toFixed(2)} MB
          </Typography>
          {!pdf.isApproved && isAdmin && (
            <Chip
              label="Pending Approval"
              color="warning"
              size="small"
              sx={{ mt: 1 }}
            />
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {views} previews
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Download">
              <Badge badgeContent={downloads} color="primary">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                  }}
                  color="primary"
                >
                  <Download fontSize="small" />
                </IconButton>
              </Badge>
            </Tooltip>
            {isAdmin && (
              <>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(pdf);
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(pdf._id);
                    }}
                    color="error"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
                {!pdf.isApproved && (
                  <Tooltip title="Approve">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onApprove?.(pdf._id);
                      }}
                      color="success"
                    >
                      <CheckCircle fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            )}
          </Box>
        </CardActions>
      </Card>

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        <Box sx={{ position: 'relative', height: '100%' }}>
          <IconButton
            onClick={() => setPreviewOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
          >
            <Close />
          </IconButton>
          <iframe
            src={`${getFullUrl(pdf.fileUrl)}#toolbar=0&navpanes=0`}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            title={pdf.title}
          />
        </Box>
      </Dialog>

      {isAdmin && (
        <EditModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(title, author) => onEdit?.({ ...pdf, title, author })}
          initialTitle={pdf.title}
          initialAuthor={pdf.author}
        />
      )}
    </>
  );
};

export default PDFCard; 