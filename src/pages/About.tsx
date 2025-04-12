import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Link,
  Grid,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

const About: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              margin: '0 auto',
              mb: 2,
              backgroundColor: 'primary.main',
            }}
          >
            SG
          </Avatar>
          <Typography variant="h4" component="h1" gutterBottom>
            Sagar Gondaliya
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Full Stack Developer
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            About Me
          </Typography>
          <Typography paragraph>
            Hello! I'm Sagar Gondaliya, a passionate Full Stack Developer with expertise in building modern web applications.
            I specialize in React, Node.js, and various other technologies to create efficient and user-friendly solutions.
          </Typography>
          <Typography paragraph>
            This Handwritten Notes application is one of my projects that demonstrates my skills in full-stack development,
            focusing on creating a seamless user experience for managing and sharing PDF documents.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Skills
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                • Frontend: React, TypeScript, Material-UI
              </Typography>
              <Typography variant="body1">
                • Backend: Node.js, Express, MongoDB
              </Typography>
              <Typography variant="body1">
                • Tools: Git, VSCode, Postman
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                • Cloud: AWS, Vercel, Render
              </Typography>
              <Typography variant="body1">
                • Testing: Jest, React Testing Library
              </Typography>
              <Typography variant="body1">
                • CI/CD: GitHub Actions
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>
            Connect With Me
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Link
              href="https://github.com/your-github-username"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'text.primary',
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
              }}
            >
              <GitHubIcon />
              <Typography>GitHub</Typography>
            </Link>
            <Link
              href="https://linkedin.com/in/your-linkedin"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'text.primary',
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
              }}
            >
              <LinkedInIcon />
              <Typography>LinkedIn</Typography>
            </Link>
            <Link
              href="mailto:your.email@example.com"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'text.primary',
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
              }}
            >
              <EmailIcon />
              <Typography>Email</Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default About; 