import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Tabs,
  Tab,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Avatar,
  Paper,
} from '@mui/material';
import {
  PhotoCamera,
  Event,
  School,
  EmojiEvents,
  Palette,
  LocationCity,
  Close,
  PlayArrow,
  ArrowBackIos,
  ArrowForwardIos,
} from '@mui/icons-material';
import { useSchool } from '../contexts/SchoolContext';

interface GalleryItem {
  title: string;
  description: string;
  type: 'photo' | 'video';
  category: string;
  date: string;
  images: string[];
  videoUrl?: string[];
}

export function GalleryPage() {
  const { schoolData } = useSchool();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentMediaType, setCurrentMediaType] = useState<'image' | 'video'>('image');

  // Ensure no horizontal scroll on any screen size
  React.useEffect(() => {
    document.body.style.overflowX = 'hidden';
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    return () => {
      document.body.style.overflowX = 'auto';
    };
  }, []);

  // Get gallery items from database
  const getGalleryItems = (): GalleryItem[] => {
    if (!schoolData?.pages?.galleryPage) return [];
    return Object.values(schoolData.pages.galleryPage);
  };

  // Get unique categories from the data
  const getCategories = (): Array<{ id: string; label: string; icon: any }> => {
    const galleryItems = getGalleryItems();
    const uniqueCategories = Array.from(new Set(galleryItems.map(item => item.category)));
    
    const categoryIcons: { [key: string]: any } = {
      events: Event,
      academic: School,
      sports: EmojiEvents,
      arts: Palette,
      campus: LocationCity
    };

    const dynamicCategories = uniqueCategories.map(category => ({
      id: category,
      label: category.charAt(0).toUpperCase() + category.slice(1),
      icon: categoryIcons[category] || PhotoCamera
    }));

    return [
      { id: 'all', label: 'All Media', icon: PhotoCamera },
      ...dynamicCategories
    ];
  };

  const galleryItems = getGalleryItems();
  const categories = getCategories();



  const handleNextMedia = React.useCallback(() => {
    if (!selectedItem) return;
    
    const imageCount = selectedItem.images?.length || 0;
    const videoCount = selectedItem.videoUrl?.length || 0;
    
    if (currentMediaType === 'image' && selectedItem.images) {
      if (currentMediaIndex < imageCount - 1) {
        setCurrentMediaIndex(currentMediaIndex + 1);
      } else if (videoCount > 0) {
        // Switch to videos
        setCurrentMediaType('video');
        setCurrentMediaIndex(0);
      }
    } else if (currentMediaType === 'video' && selectedItem.videoUrl) {
      if (currentMediaIndex < videoCount - 1) {
        setCurrentMediaIndex(currentMediaIndex + 1);
      }
    }
  }, [selectedItem, currentMediaIndex, currentMediaType]);

  const handlePreviousMedia = React.useCallback(() => {
    if (!selectedItem) return;
    
    const imageCount = selectedItem.images?.length || 0;
    
    if (currentMediaType === 'video') {
      if (currentMediaIndex > 0) {
        setCurrentMediaIndex(currentMediaIndex - 1);
      } else if (imageCount > 0) {
        // Switch to images
        setCurrentMediaType('image');
        setCurrentMediaIndex(imageCount - 1);
      }
    } else if (currentMediaType === 'image') {
      if (currentMediaIndex > 0) {
        setCurrentMediaIndex(currentMediaIndex - 1);
      }
    }
  }, [selectedItem, currentMediaIndex, currentMediaType]);

  // Handle keyboard navigation in dialog
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedItem) return;
      
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePreviousMedia();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNextMedia();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        handleCloseDialog();
      }
    };

    if (selectedItem) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedItem, handleNextMedia, handlePreviousMedia]);

  // If no gallery data, don't render the component
  if (!schoolData?.pages?.galleryPage || galleryItems.length === 0) {
    return null;
  }

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  // Helper functions for media management
  const getTotalMediaCount = (item: GalleryItem): number => {
    const imageCount = item.images?.length || 0;
    const videoCount = item.videoUrl?.length || 0;
    return imageCount + videoCount;
  };

  const getImageCount = (item: GalleryItem): number => {
    return item.images?.length || 0;
  };

  const getVideoCount = (item: GalleryItem): number => {
    return item.videoUrl?.length || 0;
  };

  const handleItemClick = (item: GalleryItem) => {
    setSelectedItem(item);
    setCurrentMediaIndex(0);
    // Start with images if available, otherwise videos
    setCurrentMediaType(item.images && item.images.length > 0 ? 'image' : 'video');
  };

  const handleCloseDialog = () => {
    setSelectedItem(null);
    setCurrentMediaIndex(0);
    setCurrentMediaType('image');
  };

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden',
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      '@media (max-width: 600px)': {
        '& .MuiContainer-root': {
          paddingLeft: '4px !important',
          paddingRight: '4px !important'
        },
        '& .MuiGrid-container': {
          margin: '0 !important',
          width: '100% !important'
        }
      }
    }}>    
      <Container 
        maxWidth="lg" 
        disableGutters={true}
        sx={{ 
          overflowX: 'hidden',
          px: { xs: 0.5, sm: 1, md: 2, lg: 3 },
          width: '100%',
          maxWidth: '100%'
        }}
      >
        <Box sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 5, md: 6 }, px: { xs: 1, sm: 0 } }}>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: '800px', 
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.25rem' },
              px: { xs: 1, md: 0 }
            }}
          >
            Explore memorable moments, achievements, and daily life at EduConnect through our photo and video gallery. 
            From academic achievements to cultural celebrations, sports victories to artistic expressions.
          </Typography>
        </Box>
        {/* Category Tabs */}
        <Paper sx={{ mb: { xs: 3, md: 4 }, px: { xs: 1, md: 2 } }}>
          <Tabs
            value={selectedCategory}
            onChange={(_, newValue) => setSelectedCategory(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Tab
                  key={category.id}
                  value={category.id}
                  label={category.label}
                  icon={<IconComponent />}
                  iconPosition="start"
                />
              );
            })}
          </Tabs>
        </Paper>

        {/* Gallery Grid */}
        {filteredItems.length > 0 ? (
          <Grid 
            container 
            spacing={{ xs: 2, sm: 3, md: 4 }} 
            sx={{ mb: { xs: 5, md: 6 }, mx: 0, width: '100%' }}
          >
            {filteredItems.map((item, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: { xs: 'none', md: 'translateY(-4px)' },
                      boxShadow: { xs: 2, md: 3 },
                    },
                  }}
                  onClick={() => handleItemClick(item)}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height={200}
                      sx={{ height: { xs: 160, sm: 180, md: 200 }, objectFit: 'cover' }}
                      image={item.images?.[0] || ''}
                      alt={item.title}
                    />
                    {item.type === 'video' && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0,0,0,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.9)', color: 'primary.main', width: { xs: 48, md: 56 }, height: { xs: 48, md: 56 } }}>
                          <PlayArrow sx={{ fontSize: { xs: 28, md: 32 } }} />
                        </Avatar>
                      </Box>
                    )}
                  </Box>
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Typography 
                      gutterBottom 
                      variant="h6" 
                      component="h3" 
                      noWrap
                      sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mb: { xs: 1.5, md: 2 },
                        fontSize: { xs: '0.75rem', md: '0.85rem' }
                      }}
                    >
                      {item.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.6rem', md: '0.65rem' } }}
                      >
                        {new Date(item.date).toLocaleDateString()}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        <Chip 
                          label={item.category} 
                          size="small" 
                          variant="outlined"
                          color="primary"
                          sx={{ fontSize: { xs: '0.55rem', md: '0.6rem' }, height: 'auto', py: 0 }}
                        />
                        {getImageCount(item) > 0 && (
                          <Chip
                            label={`${getImageCount(item)} image${getImageCount(item) > 1 ? 's' : ''}`}
                            size="small"
                            variant="outlined"
                            color="info"
                            sx={{ fontSize: { xs: '0.55rem', md: '0.6rem' }, height: 'auto', py: 0 }}
                          />
                        )}
                        {getVideoCount(item) > 0 && (
                          <Chip
                            label={`${getVideoCount(item)} video${getVideoCount(item) > 1 ? 's' : ''}`}
                            size="small"
                            variant="outlined"
                            color="secondary"
                            sx={{ fontSize: { xs: '0.55rem', md: '0.6rem' }, height: 'auto', py: 0 }}
                          />
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: { xs: 4, md: 6 }, textAlign: 'center', mb: { xs: 5, md: 6 } }}>
            <PhotoCamera sx={{ fontSize: { xs: 48, md: 64 }, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', md: '1.15rem' } }}>
              No media found in this category.
            </Typography>
          </Paper>
        )}

        {/* Dialog for viewing selected item */}
        <Dialog
          open={Boolean(selectedItem)}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          fullScreen={false}
          sx={{
            '& .MuiDialog-paper': {
              maxHeight: '90vh',
              margin: { xs: 1, md: 2 },
            },
          }}
        >
          {selectedItem && (
            <>
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {selectedItem.title}
                <IconButton onClick={handleCloseDialog}>
                  <Close />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ position: 'relative' }}>
                    {/* Current Media Display */}
                    {currentMediaType === 'video' && selectedItem.videoUrl && selectedItem.videoUrl[currentMediaIndex] ? (
                      <Box>
                        {selectedItem.videoUrl[currentMediaIndex].includes('youtube.com') || selectedItem.videoUrl[currentMediaIndex].includes('youtu.be') ? (
                          <Box
                            sx={{
                              position: 'relative',
                              paddingBottom: '56.25%', // 16:9 aspect ratio
                              height: 0,
                              borderRadius: 1,
                              overflow: 'hidden',
                            }}
                          >
                            <iframe
                              src={selectedItem.videoUrl[currentMediaIndex].replace('watch?v=', 'embed/')}
                              title={selectedItem.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                borderRadius: 4,
                              }}
                            />
                          </Box>
                        ) : (
                          <video
                            width="100%"
                            height="auto"
                            controls
                            style={{ borderRadius: 4 }}
                          >
                            <source src={selectedItem.videoUrl[currentMediaIndex]} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </Box>
                    ) : currentMediaType === 'image' && selectedItem.images && selectedItem.images[currentMediaIndex] ? (
                      <img
                        src={selectedItem.images[currentMediaIndex]}
                        alt={`${selectedItem.title} - ${currentMediaIndex + 1}`}
                        style={{ width: '100%', height: 'auto', borderRadius: 4 }}
                      />
                    ) : (
                      <Paper
                        sx={{
                          height: 300,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'grey.100',
                          borderRadius: 1,
                        }}
                      >
                        <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                          <PlayArrow sx={{ fontSize: 48, mb: 1 }} />
                          <Typography variant="h6">Media Not Available</Typography>
                          <Typography variant="body2">No media found</Typography>
                        </Box>
                      </Paper>
                    )}
                    
                    {/* Navigation Controls */}
                    {getTotalMediaCount(selectedItem) > 1 && (
                      <>
                        {/* Previous Button */}
                        <IconButton
                          onClick={handlePreviousMedia}
                          sx={{
                            position: 'absolute',
                            left: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            },
                          }}
                        >
                          <ArrowBackIos />
                        </IconButton>
                        {/* Next Button */}
                        <IconButton
                          onClick={handleNextMedia}
                          sx={{
                            position: 'absolute',
                            right: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            },
                          }}
                        >
                          <ArrowForwardIos />
                        </IconButton>
                        {/* Media Counter */}
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                          }}
                        >
                          {currentMediaType === 'image' ? 
                            `Image ${currentMediaIndex + 1} / ${getImageCount(selectedItem)}` :
                            `Video ${currentMediaIndex + 1} / ${getVideoCount(selectedItem)}`
                          }
                        </Box>
                      </>
                    )}
                  </Box>

                  {/* Media Thumbnails */}
                  {getTotalMediaCount(selectedItem) > 1 && (
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 0.5,
                        mt: 2,
                        justifyContent: 'center',
                        overflowX: 'auto',
                        pb: 1,
                      }}
                    >
                      {/* Image Thumbnails */}
                      {selectedItem.images?.map((image, index) => (
                        <Box
                          key={`image-${index}`}
                          onClick={() => {
                            setCurrentMediaType('image');
                            setCurrentMediaIndex(index);
                          }}
                          sx={{
                            cursor: 'pointer',
                            border: currentMediaType === 'image' && currentMediaIndex === index ? '2px solid' : '2px solid transparent',
                            borderColor: currentMediaType === 'image' && currentMediaIndex === index ? 'primary.main' : 'transparent',
                            borderRadius: 1,
                            overflow: 'hidden',
                            minWidth: 60,
                            height: 60,
                            position: 'relative',
                          }}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </Box>
                      ))}
                      
                      {/* Video Thumbnails */}
                      {selectedItem.videoUrl?.map((video, index) => (
                        <Box
                          key={`video-${index}`}
                          onClick={() => {
                            setCurrentMediaType('video');
                            setCurrentMediaIndex(index);
                          }}
                          sx={{
                            cursor: 'pointer',
                            border: currentMediaType === 'video' && currentMediaIndex === index ? '2px solid' : '2px solid transparent',
                            borderColor: currentMediaType === 'video' && currentMediaIndex === index ? 'secondary.main' : 'transparent',
                            borderRadius: 1,
                            overflow: 'hidden',
                            minWidth: 60,
                            height: 60,
                            position: 'relative',
                            backgroundColor: 'grey.200',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <PlayArrow sx={{ fontSize: 24, color: 'grey.600' }} />
                          <Typography
                            sx={{
                              position: 'absolute',
                              bottom: 2,
                              right: 2,
                              fontSize: '0.6rem',
                              color: 'grey.600',
                              fontWeight: 'bold',
                            }}
                          >
                            {index + 1}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
                <Typography variant="body1" paragraph>
                  {selectedItem.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(selectedItem.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Chip 
                      label={selectedItem.category} 
                      size="small" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={selectedItem.type} 
                      size="small" 
                      variant="outlined" 
                    />
                  </Box>
                </Box>
                {/* Keyboard navigation hint for media */}
                {getTotalMediaCount(selectedItem) > 1 && (
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ 
                      display: { xs: 'none', md: 'block' },
                      fontStyle: 'italic',
                      textAlign: 'center' 
                    }}
                  >
                    Use ← → arrow keys to navigate media | Click thumbnails to jump | Press ESC to close
                  </Typography>
                )}
              </DialogContent>
            </>
          )}
        </Dialog>
        </Box>
      </Container>
    </Box>
  );
}