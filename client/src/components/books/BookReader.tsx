import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Slider,
  LinearProgress,
  Button,
  Divider,
  Tooltip,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Slide
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { bookService } from '../../services/api';

interface BookReaderProps {
  bookId: number;
  title: string;
  content: string;
  currentPosition?: number;
  isCompleted?: boolean;
  onNavigateBack: () => void;
  onProgressUpdate: (position: number, completed: boolean) => void;
}

const BookReader: React.FC<BookReaderProps> = ({
  bookId,
  title,
  content,
  currentPosition = 0,
  isCompleted = false,
  onNavigateBack,
  onProgressUpdate,
}) => {
  // Reader state
  const [position, setPosition] = useState<number>(currentPosition || 0);
  const [completed, setCompleted] = useState<boolean>(isCompleted || false);
  const [fontSize, setFontSize] = useState<number>(16);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [completionDialogOpen, setCompletionDialogOpen] = useState<boolean>(false);
  const [showCongrats, setShowCongrats] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastScrollPosition = useRef<number>(0);

  // Split content into pages (improved approach)
  const pagesCount = Math.max(1, Math.ceil(content.length / 3000));
  const currentPage = Math.min(pagesCount - 1, Math.floor((position / 100) * pagesCount));
  
  // Calculate content for current page
  const getPageContent = () => {
    const pageSize = Math.ceil(content.length / pagesCount);
    const start = currentPage * pageSize;
    const end = Math.min(start + pageSize, content.length);
    return content.substring(start, end);
  };

  // Monitor scroll position to update progress
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const scrollPercentage = Math.min(100, Math.ceil((scrollTop / (scrollHeight - clientHeight)) * 100));
      
      // Only update if scroll position has changed significantly (by at least 5%)
      if (Math.abs(scrollPercentage - lastScrollPosition.current) >= 5) {
        lastScrollPosition.current = scrollPercentage;
        
        // Calculate new position based on current page and scroll position
        const pageProgress = scrollPercentage / 100;
        const overallProgress = ((currentPage + pageProgress) / pagesCount) * 100;
        setPosition(Math.min(99, overallProgress)); // Cap at 99% until full completion
      }
    };
    
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, [currentPage, pagesCount]);

  // Show completion dialog when book is completed for the first time
  useEffect(() => {
    if (completed && !isCompleted && !showCongrats) {
      setCompletionDialogOpen(true);
      setShowCongrats(true);
    }
  }, [completed, isCompleted, showCongrats]);

  // Save reading progress when component unmounts or when values change
  useEffect(() => {
    const saveProgress = async () => {
      if (loading) return;
      
      try {
        setLoading(true);
        await bookService.updateReadingProgress(bookId, position, completed);
        onProgressUpdate(position, completed);
      } catch (error) {
        console.error('Error saving reading progress:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(saveProgress, 2000);
    return () => clearTimeout(timer);
  }, [position, completed, bookId]);

  // Navigate to previous page
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      const newPosition = ((currentPage - 1) / pagesCount) * 100;
      setPosition(newPosition);
      setCompleted(false);
    }
  };

  // Navigate to next page
  const handleNextPage = () => {
    if (currentPage < pagesCount - 1) {
      const newPosition = ((currentPage + 1) / pagesCount) * 100;
      setPosition(newPosition);
      
      // Mark as completed when reaching the last page
      if (currentPage === pagesCount - 2) {
        setCompleted(true);
      }
    } else if (currentPage === pagesCount - 1) {
      // Already on the last page, mark as completed
      setCompleted(true);
      
      // Show completion dialog if not already shown
      if (!showCongrats) {
        setCompletionDialogOpen(true);
        setShowCongrats(true);
      }
    }
  };

  // Handle slider change
  const handleSliderChange = (_event: any, newValue: number | number[]) => {
    const value = newValue as number;
    setPosition(value);
    
    // Update completion status based on position
    if (value >= 99) {
      setCompleted(true);
    } else if (completed) {
      setCompleted(false);
    }
  };

  // Handle font size changes
  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 24));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 12));

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Handle completion dialog close
  const handleCompletionDialogClose = () => {
    setCompletionDialogOpen(false);
  };

  // Calculate progress percentage
  const progressPercentage = position;

  // Background and text colors based on dark mode
  const bgColor = darkMode ? '#282c34' : '#ffffff';
  const textColor = darkMode ? '#ffffff' : '#333333';
  const secondaryBgColor = darkMode ? '#21252b' : '#f5f5f5';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: bgColor,
        color: textColor,
        transition: 'background-color 0.3s, color 0.3s',
      }}
    >
      {/* Reader Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: secondaryBgColor,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={onNavigateBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ maxWidth: { xs: 150, sm: 300, md: 500 } }}>
            {title}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Tooltip title="Decrease Font Size">
            <IconButton onClick={decreaseFontSize}>
              <TextDecreaseIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Increase Font Size">
            <IconButton onClick={increaseFontSize}>
              <TextIncreaseIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"}>
            <IconButton onClick={toggleDarkMode}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Progress Indicator */}
      <LinearProgress 
        variant="determinate" 
        value={progressPercentage} 
        sx={{ height: 4 }} 
      />

      {/* Content Area */}
      <Box
        ref={contentRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={darkMode ? 0 : 3}
          sx={{
            p: { xs: 2, sm: 4 },
            maxWidth: 800,
            width: '100%',
            backgroundColor: bgColor,
            color: textColor,
            borderRadius: 2,
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.12)' : 'none',
          }}
        >
          <Typography
            variant="body1"
            component="div"
            sx={{
              fontSize: `${fontSize}px`,
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
            }}
          >
            {getPageContent()}
          </Typography>
        </Paper>
      </Box>

      {/* Navigation Controls */}
      <Box
        sx={{
          p: 2,
          backgroundColor: secondaryBgColor,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography variant="body2">
              Page {currentPage + 1} of {pagesCount}
            </Typography>
            <Typography variant="body2">
              {completed ? 'Completed' : `${Math.round(progressPercentage)}% complete`}
            </Typography>
          </Box>
          
          <Slider
            value={position}
            onChange={handleSliderChange}
            aria-labelledby="progress-slider"
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              startIcon={<NavigateBeforeIcon />}
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              endIcon={<NavigateNextIcon />}
              onClick={handleNextPage}
              disabled={completed && currentPage === pagesCount - 1}
            >
              {completed && currentPage === pagesCount - 1 ? 'Completed' : 'Next'}
            </Button>
          </Box>
        </Box>
      </Box>
      
      {/* Completion Dialog */}
      <Dialog
        open={completionDialogOpen}
        onClose={handleCompletionDialogClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          <EmojiEventsIcon color="primary" sx={{ fontSize: 60, mb: 1 }} />
          <Typography variant="h5" component="div">
            Congratulations!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText textAlign="center">
            You've completed "{title}"!
            <br />
            Thank you for reading this book.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button 
            onClick={handleCompletionDialogClose}
            variant="contained"
            color="primary"
          >
            Close
          </Button>
          <Button 
            onClick={onNavigateBack}
            variant="outlined"
          >
            Back to Books
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookReader; 