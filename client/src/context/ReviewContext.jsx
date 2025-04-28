import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ReviewContext = createContext();

export function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState({});
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const fetchReviews = async (accommodationId) => {
    if (loading[accommodationId]) return;
    
    setLoading(prev => ({ ...prev, [accommodationId]: true }));
    
    try {
      const response = await axios.get(`http://localhost:9000/accReview/accommodation/${accommodationId}`);
      const reviewData = response.data;
      
      const avgRating = reviewData.length > 0 
        ? reviewData.reduce((sum, review) => sum + review.rating, 0) / reviewData.length 
        : 0;
      
      setReviews(prev => ({
        ...prev,
        [accommodationId]: {
          rating: avgRating,
          reviewCount: reviewData.length,
          reviews: reviewData
        }
      }));
    } catch (error) {
      console.error(`❌ ${accommodationId} 리뷰 불러오기 실패:`, error);
      setReviews(prev => ({
        ...prev,
        [accommodationId]: {
          rating: 0,
          reviewCount: 0,
          reviews: []
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [accommodationId]: false }));
    }
  };

  const getReviewData = async (accommodationId) => {
    if (!reviews[accommodationId]) {
      await fetchReviews(accommodationId);
    }
    return reviews[accommodationId] || {
      rating: 0,
      reviewCount: 0,
      reviews: []
    };
  };

  const refreshReviews = async (accommodationId) => {
    await fetchReviews(accommodationId);
    setUpdateTrigger(prev => prev + 1);
  };

  return (
    <ReviewContext.Provider value={{ getReviewData, refreshReviews, loading, updateTrigger }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReview() {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReview must be used within a ReviewProvider');
  }
  return context;
} 