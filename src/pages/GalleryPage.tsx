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
} from '@mui/icons-material';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  type: 'photo' | 'video';
  category: string;
  date: string;
  imageUrl: string;
  videoUrl?: string;
  tags: string[];
}

export function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMediaType, setSelectedMediaType] = useState('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

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

  const galleryItems: GalleryItem[] = [
    {
      id: '1',
      title: 'Annual Day Celebration 2024',
      description: 'Our spectacular annual day celebration featuring student performances, awards ceremony, and cultural programs.',
      type: 'photo',
      category: 'events',
      date: '2024-03-15',
      imageUrl: 'https://images.unsplash.com/photo-1758316727379-4c995d3ae455?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBldmVudCUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc1OTM3ODM5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tags: ['celebration', 'performance', 'awards']
    },
    {
      id: '2',
      title: 'Basketball Championship Victory',
      description: 'Our varsity basketball team winning the regional championship for the third consecutive year.',
      type: 'photo',
      category: 'sports',
      date: '2024-02-20',
      imageUrl: 'https://images.unsplash.com/photo-1585915751878-f51978a77710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBzcG9ydHMlMjBjb21wZXRpdGlvbnxlbnwxfHx8fDE3NTkzNzgzOTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tags: ['basketball', 'championship', 'victory']
    },
    {
      id: '3',
      title: 'Science Fair Presentations',
      description: 'Students showcasing their innovative science projects and research at the annual science fair.',
      type: 'photo',
      category: 'academic',
      date: '2024-01-10',
      imageUrl: 'https://images.unsplash.com/photo-1758610840977-8ee55513281c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwZmFpciUyMHN0dWRlbnRzfGVufDF8fHx8MTc1OTM3ODM5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tags: ['science', 'research', 'innovation']
    },
    {
      id: '4',
      title: 'Art Exhibition Opening',
      description: 'Student artwork displayed in our annual art exhibition showcasing creativity and artistic talent.',
      type: 'photo',
      category: 'arts',
      date: '2023-12-05',
      imageUrl: 'https://images.unsplash.com/photo-1621327822018-51bedefc19af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBhcnQlMjBleGhpYml0aW9ufGVufDF8fHx8MTc1OTM3ODQwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tags: ['art', 'exhibition', 'creativity']
    },
    {
      id: '5',
      title: 'Interactive Learning Session',
      description: 'Students engaged in collaborative learning activities in our modern classrooms.',
      type: 'photo',
      category: 'academic',
      date: '2023-11-18',
      imageUrl: 'https://images.unsplash.com/photo-1558443957-d056622df610?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBjbGFzc3Jvb20lMjBsZWFybmluZ3xlbnwxfHx8fDE3NTkzNzg0MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tags: ['learning', 'collaboration', 'classroom']
    },
    {
      id: '6',
      title: 'Graduation Ceremony Highlights',
      description: 'A video montage of our memorable graduation ceremony with speeches, awards, and celebrations.',
      type: 'video',
      category: 'events',
      date: '2023-06-15',
      imageUrl: 'https://images.unsplash.com/photo-1686213011624-8578b598ef0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGdyYWR1YXRpb24lMjBjZXJlbW9ueXxlbnwxfHx8fDE3NTkzMTUwNTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      videoUrl: '#',
      tags: ['graduation', 'ceremony', 'celebration']
    },
    {
      id: '7',
      title: 'Campus Tour Video',
      description: 'Take a virtual tour of our beautiful campus facilities including classrooms, labs, library, and sports complex.',
      type: 'video',
      category: 'campus',
      date: '2023-09-01',
      imageUrl: 'https://images.unsplash.com/photo-1699347914988-c61ec13c99c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBidWlsZGluZyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NTkyOTk2NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      videoUrl: '#',
      tags: ['campus', 'facilities', 'tour']
    },
    {
      id: '8',
      title: 'Music Concert Performance',
      description: 'Students performing at our annual music concert showcasing various musical talents and instruments.',
      type: 'video',
      category: 'arts',
      date: '2023-10-20',
      imageUrl: 'https://images.unsplash.com/photo-1621327822018-51bedefc19af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBhcnQlMjBleGhpYml0aW9ufGVufDF8fHx8MTc1OTM3ODQwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      videoUrl: '#',
      tags: ['music', 'performance', 'concert']
    }
  ];

  const categories = [
    { id: 'all', label: 'All Media', icon: PhotoCamera },
    { id: 'events', label: 'Events', icon: Event },
    { id: 'academic', label: 'Academic', icon: School },
    { id: 'sports', label: 'Sports', icon: EmojiEvents },
    { id: 'arts', label: 'Arts & Culture', icon: Palette },
    { id: 'campus', label: 'Campus Life', icon: LocationCity }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const finalFilteredItems = selectedMediaType === 'all'
    ? filteredItems
    : filteredItems.filter(item => item.type === selectedMediaType);

  const photoItems = filteredItems.filter(item => item.type === 'photo');
  const videoItems = filteredItems.filter(item => item.type === 'video');

  const handleItemClick = (item: GalleryItem) => {
    setSelectedItem(item);
  };

  const handleCloseDialog = () => {
    setSelectedItem(null);
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

        {/* Media Type Filter */}
        <Box sx={{ mb: { xs: 3, md: 4 }, display: 'flex', justifyContent: 'center', px: { xs: 1, md: 0 } }}>
          <Tabs
            value={selectedMediaType}
            onChange={(_, newValue) => setSelectedMediaType(newValue)}
            sx={{ maxWidth: 400 }}
          >
            <Tab value="all" label={`All (${filteredItems.length})`} />
            <Tab value="photo" label={`Photos (${photoItems.length})`} />
            <Tab value="video" label={`Videos (${videoItems.length})`} />
          </Tabs>
        </Box>

        {/* Gallery Grid */}
        {finalFilteredItems.length > 0 ? (
          <Grid 
            container 
            spacing={{ xs: 2, sm: 3, md: 4 }} 
            sx={{ mb: { xs: 5, md: 6 }, mx: 0, width: '100%' }}
          >
            {finalFilteredItems.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
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
                      image={item.imageUrl}
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
                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                      <Chip
                        label={item.type === 'video' ? 'Video' : 'Photo'}
                        size="small"
                        color={item.type === 'video' ? 'secondary' : 'primary'}
                        sx={{ fontSize: { xs: '0.6rem', md: '0.65rem' } }}
                      />
                    </Box>
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
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {item.tags.slice(0, 2).map(tag => (
                          <Chip 
                            key={tag} 
                            label={tag} 
                            size="small" 
                            variant="outlined"
                            sx={{ fontSize: { xs: '0.55rem', md: '0.6rem' }, height: 'auto', py: 0 }}
                          />
                        ))}
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
                  {selectedItem.type === 'video' ? (
                    <Paper
                      sx={{
                        height: 300,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'grey.100',
                      }}
                    >
                      <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                        <PlayArrow sx={{ fontSize: 48, mb: 1 }} />
                        <Typography variant="h6">Video Player</Typography>
                        <Typography variant="body2">Click to play video</Typography>
                      </Box>
                    </Paper>
                  ) : (
                    <img
                      src={selectedItem.imageUrl}
                      alt={selectedItem.title}
                      style={{ width: '100%', height: 'auto', borderRadius: 4 }}
                    />
                  )}
                </Box>
                <Typography variant="body1" paragraph>
                  {selectedItem.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(selectedItem.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {selectedItem.tags.map(tag => (
                      <Chip key={tag} label={tag} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              </DialogContent>
            </>
          )}
        </Dialog>
        </Box>
      </Container>
    </Box>
  );
}