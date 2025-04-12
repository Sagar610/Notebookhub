import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Box,
  Container,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Alert,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import PDFCard from '../components/PDFCard';
import { pdfService } from '../services/pdfService';
import { PDF } from '../types/pdf';

const Admin: React.FC = () => {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    try {
      const data = await pdfService.getAllPDFs();
      setPdfs(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch PDFs');
      console.error('Error fetching PDFs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (pdf: PDF) => {
    try {
      await pdfService.updatePDF(pdf._id, {
        title: pdf.title,
        author: pdf.author
      });
      await fetchPDFs();
    } catch (err) {
      setError('Failed to update PDF');
      console.error('Error updating PDF:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await pdfService.deletePDF(id);
      await fetchPDFs();
    } catch (err) {
      setError('Failed to delete PDF');
      console.error('Error deleting PDF:', err);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await pdfService.approvePDF(id);
      await fetchPDFs();
    } catch (err) {
      setError('Failed to approve PDF');
      console.error('Error approving PDF:', err);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filterPDFs = (pdfs: PDF[]) => {
    if (!searchQuery) return pdfs;
    
    return pdfs.filter(pdf => 
      pdf.title.toLowerCase().includes(searchQuery) ||
      pdf.author.toLowerCase().includes(searchQuery) ||
      pdf.fileSize.toString().includes(searchQuery) ||
      pdf.status.toLowerCase().includes(searchQuery)
    );
  };

  const pendingPDFs = filterPDFs(pdfs.filter(pdf => !pdf.isApproved));
  const approvedPDFs = filterPDFs(pdfs.filter(pdf => pdf.isApproved));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Manage and approve submitted PDFs
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by title, author, size, or status..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <Paper sx={{ mt: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            label={`Pending (${pendingPDFs.length})`} 
            sx={{ fontWeight: 'medium' }}
          />
          <Tab 
            label={`Approved (${approvedPDFs.length})`}
            sx={{ fontWeight: 'medium' }}
          />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 ? (
            pendingPDFs.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  {searchQuery ? 'No matching pending PDFs found' : 'No pending PDFs for approval'}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                {pendingPDFs.map((pdf) => (
                  <Box key={pdf._id}>
                    <PDFCard
                      pdf={pdf}
                      isAdmin
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onApprove={handleApprove}
                    />
                  </Box>
                ))}
              </Box>
            )
          ) : (
            approvedPDFs.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  {searchQuery ? 'No matching approved PDFs found' : 'No approved PDFs yet'}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                {approvedPDFs.map((pdf) => (
                  <Box key={pdf._id}>
                    <PDFCard
                      pdf={pdf}
                      isAdmin
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </Box>
                ))}
              </Box>
            )
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Admin; 