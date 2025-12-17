import React, { useState, useEffect } from 'react';
import { toggleLike } from './api/storiesService';
import { useAuth } from '../AuthContext';
import './LikeDislikeButtons.css';

const LikeDislikeButtons = ({ storyId, initialLikes = 0, initialDislikes = 0 }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userReaction, setUserReaction] = useState(null); // 'like', 'dislike', or null
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLikes(initialLikes);
    setDislikes(initialDislikes);
  }, [initialLikes, initialDislikes]);

  const handleReaction = async (isLike) => {
    if (!user) {
      alert('Please log in to react to stories');
      return;
    }

    setLoading(true);
    try {
      const result = await toggleLike(storyId, user.uid, isLike);

      if (result === 'added') {
        if (isLike) {
          setLikes(prev => prev + 1);
          setUserReaction('like');
        } else {
          setDislikes(prev => prev + 1);
          setUserReaction('dislike');
        }
      } else if (result === 'removed') {
        if (isLike) {
          setLikes(prev => prev - 1);
          setUserReaction(null);
        } else {
          setDislikes(prev => prev - 1);
          setUserReaction(null);
        }
      } else if (result === 'changed') {
        if (isLike) {
          setLikes(prev => prev + 1);
          setDislikes(prev => prev - 1);
          setUserReaction('like');
        } else {
          setLikes(prev => prev - 1);
          setDislikes(prev => prev + 1);
          setUserReaction('dislike');
        }
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
      alert('Failed to update reaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reaction-buttons">
      <button
        className={`reaction-btn like-btn ${userReaction === 'like' ? 'active' : ''}`}
        onClick={() => handleReaction(true)}
        disabled={loading}
        title="Like this story"
      >
        <span className="reaction-icon">❤️</span>
        <span className="reaction-count">{likes}</span>
      </button>

      <button
        className={`reaction-btn dislike-btn ${userReaction === 'dislike' ? 'active' : ''}`}
        onClick={() => handleReaction(false)}
        disabled={loading}
        title="Dislike this story"
      >
        <span className="reaction-icon">👎</span>
        <span className="reaction-count">{dislikes}</span>
      </button>
    </div>
  );
};

export default LikeDislikeButtons;