import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
  Paper,
} from '@mui/material';
import {
  ArrowBackIos,
  ArrowForwardIos,
} from '@mui/icons-material';

interface HeroCarouselProps {
  images: string[];
  welcomeTitle: string;
  welcomeSubtitle: string;
  onNavigate: (page: string) => void;
}

export function HeroCarousel({ 
  images, 
  welcomeTitle, 
  welcomeSubtitle, 
  onNavigate 
}: HeroCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Auto-slide functionality
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds
    
    return () => clearInterval(interval);
  }, [images.length]);

  // Navigation functions
  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Fallback image if no images are provided
  const defaultImage = 'https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=A63koPKaCyIwQWOTFBRWXj_PwCrR4cEoOw2S9Q7yVl8=';
  const displayImages = images.length > 0 ? images : [defaultImage];
  const currentImage = displayImages[currentImageIndex];

  return (
    <Paper
      sx={{
        position: 'relative',
        backgroundColor: 'grey.800',
        color: '#fff',
        mb: { xs: 4, sm: 6, md: 8 },
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(${currentImage})`,
        minHeight: { xs: '300px', sm: '400px', md: '500px', lg: '600px' },
        display: 'flex',
        alignItems: 'center',
        borderRadius: { xs: 0, sm: 1, md: 2 },
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        mx: { xs: 0, sm: 0, md: 0 },
        transition: 'background-image 0.5s ease-in-out',
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: 'rgba(0,0,0,.5)',
          borderRadius: 2,
        }}
      />
      
      {/* Navigation Arrows */}
      {displayImages.length > 1 && (
        <>
          <IconButton
            onClick={goToPreviousImage}
            sx={{
              position: 'absolute',
              left: { xs: 8, md: 16 },
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              zIndex: 2,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.3)',
              },
            }}
          >
            <ArrowBackIos />
          </IconButton>
          
          <IconButton
            onClick={goToNextImage}
            sx={{
              position: 'absolute',
              right: { xs: 8, md: 16 },
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              zIndex: 2,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.3)',
              },
            }}
          >
            <ArrowForwardIos />
          </IconButton>
        </>
      )}

      {/* Content */}
      <Box 
        sx={{ 
          position: 'relative', 
          zIndex: 1, 
          width: '100%',
          maxWidth: { xs: '100%', md: '1200px' },
          mx: 'auto',
          px: { xs: 1, sm: 3, md: 4, lg: 6 }
        }}
      >
        <Grid container spacing={{ xs: 2, md: 4 }} alignItems="center">
          <Grid size={12}>
            <Typography
              component="h1"
              variant="h2"
              color="inherit"
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
              }}
            >
              {welcomeTitle}
            </Typography>
            <Typography 
              variant="h5" 
              color="inherit" 
              paragraph 
              sx={{ 
                opacity: 0.9,
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
              }}
            >
              {welcomeSubtitle}
            </Typography>
            <Box sx={{ 
              mt: { xs: 2, sm: 3, md: 4 }, 
              display: 'flex', 
              gap: { xs: 1, sm: 1.5, md: 2 }, 
              flexWrap: 'wrap',
              flexDirection: { xs: 'column', sm: 'row' },
              width: '100%',
              maxWidth: { xs: '100%', sm: 'auto' }
            }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => onNavigate('contact')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'grey.300',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Contact Us
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Dots Indicator */}
      {displayImages.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            zIndex: 2,
          }}
        >
          {displayImages.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToImage(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: currentImageIndex === index ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'white',
                  transform: 'scale(1.1)',
                },
              }}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
}