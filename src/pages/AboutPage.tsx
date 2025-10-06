import React from 'react';
import { Container, Typography, Box } from '@mui/material';

export function AboutPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          About Our School
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 3 }}>
          Learn more about our educational institution, our mission, and our commitment to excellence in education.
        </Typography>
      </Box>
    </Container>
  );
}
