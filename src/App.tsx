import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Home from './pages/Home';
import { Upload } from './pages/Upload';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { CloudUpload, Home as HomeIcon, AdminPanelSettings, Logout } from '@mui/icons-material';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Header from './components/Header';
import About from './pages/About';
import Footer from './components/Footer';
import SEO from './components/SEO';
import { HelmetProvider } from 'react-helmet-async';
import { authService } from './services/authService';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5'
    }
  },
  typography: {
    h4: {
      fontWeight: 600,
      marginBottom: '1rem'
    }
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (min-width: 1200px)': {
            maxWidth: '100%',
            paddingLeft: '24px',
            paddingRight: '24px',
          },
        },
      },
    },
  },
});

const NavigationBar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <AppBar position="static" elevation={2}>
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Toolbar disableGutters>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit',
              fontWeight: 'bold',
              '&:hover': {
                color: 'rgba(255, 255, 255, 0.9)'
              }
            }}
          >
            Handwritten Notes Hub
          </Typography>
          <Button 
            color="inherit" 
            component={Link} 
            to="/" 
            startIcon={<HomeIcon />}
            sx={{ mx: 1 }}
          >
            Home
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/upload" 
            startIcon={<CloudUpload />}
            sx={{ mx: 1 }}
          >
            Upload
          </Button>
          {isAuthenticated ? (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/admin" 
                startIcon={<AdminPanelSettings />}
                sx={{ mx: 1 }}
              >
                Admin
              </Button>
              <Button 
                color="inherit"
                onClick={logout}
                startIcon={<Logout />}
                sx={{ mx: 1 }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button 
              color="inherit" 
              component={Link} 
              to="/login" 
              startIcon={<AdminPanelSettings />}
              sx={{ mx: 1 }}
            >
              Admin Login
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return authService.isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <SEO />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <NavigationBar />

              <Box 
                component="main" 
                sx={{ 
                  flexGrow: 1,
                  width: '100%',
                  p: 0
                }}
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/admin"
                    element={
                      <PrivateRoute>
                        <Admin />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/about" element={<About />} />
                </Routes>
              </Box>

              <Footer />
            </Box>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
