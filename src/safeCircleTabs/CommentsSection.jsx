import React, { useState, useEffect, useCallback } from 'react';
import { addComment, getComments, addReply, getReplies, reportContent, moderateContent } from './api/storiesService';
import { useAuth } from '../AuthContext';
import LikeDislikeButtons from './LikeDislikeButtons';
import './CommentsSection.css';

const CommentsSection = ({ storyId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);

  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedComments = await getComments(storyId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  }, [storyId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    if (!user && !isAnonymous) {
      alert('Please log in or post anonymously');
      return;
    }

    try {
      const commentData = {
        content: newComment,
        authorId: user?.uid || 'anonymous',
        authorName: isAnonymous ? 'Anonymous' : (user?.displayName || 'Anonymous'),
        isAnonymous
      };

      await addComment(storyId, commentData);
      setNewComment('');
      setIsAnonymous(false);
      loadComments(); // Refresh comments
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const handleAddReply = async (commentId) => {
    if (!replyText.trim()) return;

    if (!user && !isAnonymous) {
      alert('Please log in or post anonymously');
      return;
    }

    try {
      const replyData = {
        content: replyText,
        authorId: user?.uid || 'anonymous',
        authorName: isAnonymous ? 'Anonymous' : (user?.displayName || 'Anonymous'),
        isAnonymous
      };

      await addReply(commentId, replyData);
      setReplyText('');
      setReplyingTo(null);
      setIsAnonymous(false);
      loadComments(); // Refresh comments
    } catch (error) {
      console.error('Error adding reply:', error);
      alert('Failed to add reply. Please try again.');
    }
  };

  const handleReport = async (contentId, contentType, reason) => {
    try {
      await reportContent(contentId, contentType, {
        reason,
        reportedBy: user?.uid || 'anonymous',
        reportedByName: user?.displayName || 'Anonymous'
      });
      alert('Content reported successfully');
      setShowReportModal(false);
      setReportTarget(null);
    } catch (error) {
      console.error('Error reporting content:', error);
      alert('Failed to report content. Please try again.');
    }
  };

  const handleModerate = async (contentId, contentType, action) => {
    if (!user || (!user.isAdmin() && !user.isModerator())) return;

    try {
      await moderateContent(contentId, contentType, action, user.currentUser.uid);
      alert(`Content ${action}d successfully`);
      loadComments(); // Refresh comments
    } catch (error) {
      console.error('Error moderating content:', error);
      alert('Failed to moderate content. Please try again.');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const CommentItem = ({ comment, isReply = false }) => {
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState([]);

    const loadReplies = async () => {
      if (replies.length === 0) {
        try {
          const fetchedReplies = await getReplies(comment.id);
          setReplies(fetchedReplies);
        } catch (error) {
          console.error('Error loading replies:', error);
        }
      }
      setShowReplies(!showReplies);
    };

    return (
      <div className={`comment-item ${isReply ? 'reply' : ''}`}>
        <div className="comment-header">
          <div className="comment-author">
            <div className="author-avatar">
              {comment.authorName?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="author-info">
              <span className="author-name">{comment.authorName || 'Anonymous'}</span>
              <span className="comment-date">{formatDate(comment.createdAt)}</span>
            </div>
          </div>
          <button
            className="report-btn"
            onClick={() => {
              setReportTarget({ id: comment.id, type: 'comment' });
              setShowReportModal(true);
            }}
          >
            ⚠️
          </button>
        </div>

        <div className="comment-content">
          {comment.content}
        </div>

        <div className="comment-actions">
          <LikeDislikeButtons
            storyId={comment.id}
            initialLikes={comment.likes || 0}
            initialDislikes={comment.dislikes || 0}
          />

          {!isReply && (
            <button
              className="action-btn"
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            >
              Reply
            </button>
          )}

          {!isReply && comment.replies && comment.replies.length > 0 && (
            <button className="action-btn" onClick={loadReplies}>
              {showReplies ? 'Hide' : 'Show'} Replies ({comment.replies.length})
            </button>
          )}

          {user && (user.isAdmin() || user.isModerator()) && (
            <div className="admin-actions">
              <button
                className="admin-btn approve-btn"
                onClick={() => handleModerate(comment.id, isReply ? 'reply' : 'comment', 'approve')}
                title="Approve content"
              >
                ✓
              </button>
              <button
                className="admin-btn delete-btn"
                onClick={() => handleModerate(comment.id, isReply ? 'reply' : 'comment', 'delete')}
                title="Remove content"
              >
                ✗
              </button>
            </div>
          )}
        </div>

        {replyingTo === comment.id && (
          <div className="reply-form">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              rows={3}
            />
            <div className="reply-form-actions">
              <label className="anonymous-checkbox">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                Post anonymously
              </label>
              <div className="reply-buttons">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyText('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="submit-btn"
                  onClick={() => handleAddReply(comment.id)}
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        )}

        {showReplies && replies.length > 0 && (
          <div className="replies-section">
            {replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="comments-loading">Loading comments...</div>;
  }

  return (
    <div className="comments-section">
      <h3>Comments ({comments.length})</h3>

      {/* Add Comment Form */}
      <div className="add-comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts, encouragement, or experience..."
          rows={4}
        />
        <div className="comment-form-actions">
          <label className="anonymous-checkbox">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            Post anonymously
          </label>
          <button
            className="submit-comment-btn"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            Post Comment
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <div className="no-comments">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && reportTarget && (
        <div className="report-modal-overlay">
          <div className="report-modal">
            <h4>Report Content</h4>
            <p>Why are you reporting this content?</p>
            <div className="report-reasons">
              {['Harassment', 'Spam', 'Inappropriate content', 'Hate speech', 'Other'].map(reason => (
                <button
                  key={reason}
                  className="report-reason-btn"
                  onClick={() => handleReport(reportTarget.id, reportTarget.type, reason)}
                >
                  {reason}
                </button>
              ))}
            </div>
            <button
              className="cancel-report-btn"
              onClick={() => {
                setShowReportModal(false);
                setReportTarget(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;