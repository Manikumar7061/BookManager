import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  CardActionArea,
  LinearProgress,
  Chip,
  Stack,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { bookService } from '../../services/api';

interface Book {
  id: number;
  title: string;
  author: string;
  cover_image: string;
  current_position?: number;
  is_completed?: boolean;
  is_favorite?: boolean;
}

interface BookCardProps {
  book: Book;
  onUpdate?: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onUpdate }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/books/${book.id}`);
  };
  
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const newFavoriteStatus = !book.is_favorite;
      await bookService.toggleFavorite(book.id, newFavoriteStatus);
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };
  
  // Format progress percentage
  const progressPercentage = book.current_position || 0;
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        }
      }}
    >
      <CardActionArea onClick={handleCardClick} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            image={book.cover_image || 'https://via.placeholder.com/150x220?text=No+Cover'}
            alt={book.title}
            sx={{ 
              height: 220,
              objectFit: 'contain',
              backgroundColor: '#f5f5f5',
            }}
          />
          
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            <IconButton 
              onClick={handleToggleFavorite}
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
              }}
              size="small"
            >
              {book.is_favorite ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
          </Box>
          
          {/* Status indicators */}
          <Stack 
            direction="row" 
            spacing={0.5} 
            sx={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              p: 0.5,
              backgroundColor: 'rgba(0, 0, 0, 0.6)'
            }}
          >
            {book.is_completed && (
              <Chip 
                icon={<CheckCircleIcon />} 
                label="Completed" 
                size="small"
                sx={{ 
                  height: 24, 
                  backgroundColor: 'rgba(76, 175, 80, 0.9)',
                  color: 'white',
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />
            )}
            
            {!book.is_completed && book.current_position && book.current_position > 0 && (
              <Chip 
                icon={<BookmarkIcon />} 
                label={`${Math.round(book.current_position)}%`}
                size="small"
                sx={{ 
                  height: 24, 
                  backgroundColor: 'rgba(33, 150, 243, 0.9)',
                  color: 'white',
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />
            )}
          </Stack>
        </Box>
        
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography gutterBottom variant="h6" component="div" noWrap title={book.title}>
            {book.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {book.author}
          </Typography>
          
          {!book.is_completed && progressPercentage > 0 && (
            <Box sx={{ mt: 'auto', width: '100%' }}>
              <LinearProgress 
                variant="determinate" 
                value={progressPercentage} 
                sx={{ height: 6, borderRadius: 3, mt: 1 }}
              />
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default BookCard; 