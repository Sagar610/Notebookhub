import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Container,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent,
  Paper,
  TextField,
  InputAdornment,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import PDFCard from '../components/PDFCard';
import { pdfService } from '../services/pdfService';
import { PDF } from '../types/pdf';

interface SortOption {
  value: string;
  label: string;
}

const Home: React.FC = () => {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('titleAsc');
  const [isAdmin, setIsAdmin] = useState(false);
  const [previewPdf, setPreviewPdf] = useState<PDF | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const sortOptions: SortOption[] = [
    { value: 'titleAsc', label: 'Title (A-Z)' },
    { value: 'titleDesc', label: 'Title (Z-A)' },
    { value: 'sizeSmall', label: 'Size (Small to Large)' },
    { value: 'sizeLarge', label: 'Size (Large to Small)' },
    { value: 'dateNewest', label: 'Date (Newest)' },
    { value: 'dateOldest', label: 'Date (Oldest)' }
  ];

  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        setLoading(true);
        setError(null);
        const approvedPDFs = await pdfService.getPDFs();
        setPdfs(approvedPDFs);
      } catch (error) {
        console.error('Error fetching PDFs:', error);
        setError(error instanceof Error ? error.message : 'Failed to load PDFs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPDFs();
  }, []);

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  const handleDownload = (pdf: PDF) => {
    window.open(pdf.fileUrl, '_blank');
  };

  const handlePreview = (pdf: PDF) => {
    setPreviewPdf(pdf);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filterPDFs = (pdfs: PDF[]) => {
    if (!searchQuery) return pdfs;
    
    return pdfs.filter(pdf => 
      pdf.title.toLowerCase().includes(searchQuery) ||
      pdf.author.toLowerCase().includes(searchQuery) ||
      pdf.fileSize.toString().includes(searchQuery)
    );
  };

  const filteredPDFs = filterPDFs(pdfs);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  const sortedPdfs = [...filteredPDFs].sort((a, b) => {
    switch (sortBy) {
      case 'titleAsc':
        return a.title.localeCompare(b.title);
      case 'titleDesc':
        return b.title.localeCompare(a.title);
      case 'sizeSmall':
        return a.fileSize - b.fileSize;
      case 'sizeLarge':
        return b.fileSize - a.fileSize;
      case 'dateNewest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'dateOldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      default:
        return 0;
    }
  });

  return (
    <Box>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: { xs: 2, sm: 1 },
          px: { xs: 1, sm: 2 }
        }}>
          <Typography 
            variant="h6" 
            component="div"
            sx={{ 
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              whiteSpace: 'nowrap'
            }}
          >
            {sortedPdfs.length} - Handwritten Notes
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 2 }, 
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                width: { xs: '100%', sm: 200 },
                maxWidth: { xs: '100%', sm: 200 },
                '& .MuiInputBase-root': {
                  height: { xs: 40, sm: 36 }
                }
              }}
            />
            <FormControl 
              size="small" 
              sx={{ 
                minWidth: { xs: '100%', sm: 150 },
                maxWidth: { xs: '100%', sm: 150 },
                '& .MuiInputBase-root': {
                  height: { xs: 40, sm: 36 }
                }
              }}
            >
              <InputLabel id="sort-label">Sort By</InputLabel>
              <Select
                labelId="sort-label"
                value={sortBy}
                label="Sort By"
                onChange={handleSortChange}
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Toolbar>
      </AppBar>

      <Container 
        maxWidth="lg" 
        sx={{ 
          py: { xs: 2, sm: 4 },
          px: { xs: 1, sm: 2 }
        }}
      >
        {sortedPdfs.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" color="text.secondary">
              {searchQuery ? 'No matching PDFs found' : 'No PDFs available'}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: '1fr 1fr', 
              md: '1fr 1fr 1fr', 
              lg: '1fr 1fr 1fr 1fr 1fr' 
            }, 
            gap: { xs: 2, sm: 3 },
            px: { xs: 0, sm: 0 }
          }}>
            {sortedPdfs.map((pdf) => (
              <Box key={pdf._id} sx={{ width: '100%' }}>
                <PDFCard
                  pdf={pdf}
                  isAdmin={isAdmin}
                />
              </Box>
            ))}
          </Box>
        )}
      </Container>

      <Dialog
        open={!!previewPdf}
        onClose={() => setPreviewPdf(null)}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            width: '100%',
            maxWidth: { xs: '100%', sm: 'md' },
            margin: { xs: 0, sm: 4 },
            height: { xs: '100%', sm: 'auto' },
            maxHeight: { xs: '100%', sm: '90vh' }
          }
        }}
      >
        <DialogTitle>PDF Preview</DialogTitle>
        <DialogContent sx={{ p: { xs: 0, sm: 2 } }}>
          {previewPdf && (
            <iframe
              src={previewPdf.fileUrl}
              width="100%"
              height="100%"
              title="PDF Preview"
              style={{ 
                border: 'none',
                minHeight: 'calc(100vh - 120px)'
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: { xs: 1, sm: 2 } }}>
          <Button onClick={() => setPreviewPdf(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home; 