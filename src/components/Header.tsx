import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  InputBase,
  alpha,
  styled,
  Container,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  CloudUpload,
  AdminPanelSettings,
  Logout,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UploadModal from './UploadModal';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(1),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(2),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(0, 2),
  minWidth: 120,
  '& .MuiInputBase-root': {
    color: 'inherit',
    fontSize: '0.875rem',
    '& .MuiSelect-select': {
      paddingTop: 8,
      paddingBottom: 8,
    },
  },
  '& .MuiInputLabel-root': {
    color: alpha(theme.palette.common.white, 0.7),
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: alpha(theme.palette.common.white, 0.23),
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: alpha(theme.palette.common.white, 0.4),
  },
}));

interface HeaderProps {
  onSearch: (query: string) => void;
  onSort?: (sortOption: string) => void;
  sortOptions?: Array<{ value: string; label: string }>;
  currentSort?: string;
  isAdmin?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onSearch, 
  onSort,
  sortOptions = [],
  currentSort = '',
  isAdmin = false
}) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleSort = (event: SelectChangeEvent) => {
    if (onSort) {
      onSort(event.target.value);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#1976d2' }}>
      <Container maxWidth={false}>
        <Toolbar sx={{ 
          justifyContent: 'space-between', 
          px: { xs: 1, sm: 2 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 },
          py: { xs: 1, sm: 0 }
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            width: { xs: '100%', sm: 'auto' }
          }}>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 700,
                letterSpacing: 0.5,
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              Handwritten Notes Hub
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flex: { xs: '1 1 auto', sm: '0 1 auto' },
            width: { xs: '100%', sm: 'auto' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 2 }
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              width: { xs: '100%', sm: 'auto' },
              gap: 1
            }}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={handleSearch}
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Search>

              {sortOptions.length > 0 && onSort && (
                <StyledFormControl size="small" sx={{ minWidth: { xs: 110, sm: 120 } }}>
                  <Select
                    value={currentSort}
                    onChange={handleSort}
                    displayEmpty
                    sx={{
                      color: 'white',
                      '& .MuiSelect-icon': { color: 'white' },
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}
                  >
                    {sortOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              )}
            </Box>

            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 1, sm: 2 },
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'center', sm: 'flex-start' }
            }}>
              <Button
                color="inherit"
                component={Link}
                to="/upload"
                startIcon={<CloudUpload />}
                sx={{ 
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  minWidth: { xs: '90px', sm: '100px' }
                }}
              >
                Upload
              </Button>
              {isAuthenticated ? (
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  startIcon={<Logout />}
                  sx={{ 
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    minWidth: { xs: '90px', sm: '100px' }
                  }}
                >
                  O
                </Button>
              ) : (
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  startIcon={<AdminPanelSettings />}
                  sx={{ 
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    minWidth: { xs: '90px', sm: '100px' }
                  }}
                >
                  O
                </Button>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 
