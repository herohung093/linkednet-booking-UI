import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, CircularProgress, Collapse, Fade } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, ExpandMore, ExpandLess } from "@mui/icons-material";
import axios from "@/ulti/axios";

interface ResultsGalleryProps {
  storeUuid?: string;
}

interface Photo {
  id: number;
  storeUuid: string;
  photoData: string; // base64 or URL
  contentType: string;
  description: string;
  uploadDate: string;
  displayOrder: number;
}

const ResultsGallery: React.FC<ResultsGalleryProps> = ({ storeUuid }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<{ id: number; url: string; caption: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Real API call to fetch gallery images
  useEffect(() => {
    const fetchGalleryImages = async () => {
      setLoading(true);
      setHasError(false);
      try {
        const storeConfigResponse = await axios.get(
          "storeConfig/photos",
          {
            headers: { "X-StoreID": storeUuid },
          }
        );
        
        // Transform the API response to match the expected format
        const transformedImages = storeConfigResponse.data
          .sort((a: Photo, b: Photo) => (a.displayOrder || 0) - (b.displayOrder || 0))
          .map((photo: Photo) => ({
            id: photo.id,
            url: `data:${photo.contentType};base64,${photo.photoData}`,
            caption: photo.description || `Photo ${photo.id}`
          }));
        
        setImages(transformedImages);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
        setHasError(true);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    if (storeUuid) {
      fetchGalleryImages();
    } else {
      // If no storeUuid is provided, set images to empty array
      setImages([]);
      setLoading(false);
    }
  }, [storeUuid]);

  const handlePrevious = () => {
    setImageLoaded(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
      setImageLoaded(true);
    }, 150);
  };

  const handleNext = () => {
    setImageLoaded(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
      setImageLoaded(true);
    }, 150);
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="300px"
        bgcolor="#f8f8f8"
        borderRadius={2}
        mt={3}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Don't render the component if there are no images or there was an error
  if (images.length === 0 || hasError) {
    return null;
  }

  return (
    <Box 
      sx={{ 
        mt: 3, 
        mb: 2, 
        position: "relative",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header with toggle button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          pt: 2,
          pb: 1,
          cursor: "pointer",
        }}
        onClick={handleToggleExpand}
      >
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            fontWeight: "bold" 
          }}
        >
          Our Works
        </Typography>
        <IconButton size="small">
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      {/* Collapsible content */}
      <Collapse in={isExpanded}>
        <Box 
          sx={{ 
            position: "relative",
            height: "300px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f8f8f8",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {images.length > 0 && (
            <Fade in={imageLoaded} timeout={300}>
              <Box 
                component="img"
                src={images[currentIndex].url}
                alt={images[currentIndex].caption}
                sx={{ 
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                  transition: "all 0.3s ease-in-out",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
                onLoad={() => setImageLoaded(true)}
              />
            </Fade>
          )}

          {/* Navigation buttons */}
          <IconButton 
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            sx={{ 
              position: "absolute", 
              left: 16, 
              backgroundColor: "rgba(255,255,255,0.7)",
              "&:hover": { 
                backgroundColor: "rgba(255,255,255,0.9)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <ArrowBackIos />
          </IconButton>
          
          <IconButton 
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            sx={{ 
              position: "absolute", 
              right: 16, 
              backgroundColor: "rgba(255,255,255,0.7)",
              "&:hover": { 
                backgroundColor: "rgba(255,255,255,0.9)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <ArrowForwardIos />
          </IconButton>
        </Box>

        {/* Caption */}
        <Box 
          sx={{ 
            p: 2, 
            backgroundColor: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Fade in={imageLoaded} timeout={300}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flexShrink: 0 }}>{images[currentIndex].caption}</Typography>
          </Fade>
          {/* <Typography variant="body2" color="text.secondary">
            {currentIndex + 1} / {images.length}
          </Typography> */}
        </Box>
      </Collapse>
    </Box>
  );
};

export default ResultsGallery;
