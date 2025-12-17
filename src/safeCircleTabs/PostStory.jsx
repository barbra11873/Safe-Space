import React, { useState, useEffect } from 'react';
import { createStory, getCategories } from './api/storiesService';
import { useAuth } from '../AuthContext';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './PostStory.css';

// Simple list of profane words for basic moderation
// Note: In production, use a more comprehensive list or external API.
// However, since this is a GBV app, some of these words might be valid in context.
// A "bad word" filter usually targets slurs and toxicity.
// For this demo/requirement, I'm keeping it minimal but functional as a proof of concept.
const PROFANITY_LIST = ['badword1', 'badword2', 'offensive_term', 'slur'];

const PostStory = ({ onClose, onStoryPosted }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    genderPerspective: '',
    abuseType: '',
    isAnonymous: false,
    contentType: 'text', // 'text' or 'video'
    videoFile: null,
    triggerWarning: false,
    healingPrompt: '',
    gdprConsent: false
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Default categories - load instantly for immediate use
  const defaultCategories = [
    { id: "domestic-violence", name: "Domestic Violence" },
    { id: "sexual-assault", name: "Sexual Violence" },
    { id: "childhood-abuse", name: "Childhood Abuse" },
    { id: "recovery", name: "Recovery & Healing" },
    { id: "support-networks", name: "Support Networks" },
    { id: "breaking-cycles", name: "Breaking Cycles" }
  ];

  useEffect(() => {
    // Set default categories immediately for instant loading
    setCategories(defaultCategories);

    // Try to load from database in background (non-blocking)
    loadCategoriesFromDatabase();
  }, []);

  const loadCategoriesFromDatabase = async () => {
    try {
      const cats = await getCategories();
      if (cats && cats.length > 0) {
        setCategories(cats);
      }
    } catch (error) {
      console.error('Error loading categories from database:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate video format
      if (!file.type.startsWith('video/')) {
        setError('Please select a valid video file');
        return;
      }

      // Validate file size (max 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        setError('File size too large. Maximum allowed size is 50MB.');
        return;
      }

      setFormData(prev => ({ ...prev, videoFile: file }));
      setError('');
    }
  };

  const checkProfanity = (text) => {
    const lowerText = text.toLowerCase();
    // This is a placeholder for a real moderation system
    // We will check against our PROFANITY_LIST array.
    for (const word of PROFANITY_LIST) {
      if (lowerText.includes(word)) {
        return true;
      }
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Please provide a story title');
      }
      if (!formData.category) {
        throw new Error('Please select a category from the dropdown');
      }
      if (!formData.genderPerspective) {
        throw new Error('Please select your gender perspective');
      }
      if (!formData.gdprConsent) {
        throw new Error('You must agree to the Terms and Privacy Policy to continue.');
      }

      // Content Moderation Check
      if (checkProfanity(formData.title) || (formData.contentType === 'text' && checkProfanity(formData.content))) {
        throw new Error('Your story contains prohibited language. Please revise and try again.');
      }

      if (formData.contentType === 'text' && !formData.content.trim()) {
        throw new Error('Please provide story content');
      }

      if (formData.contentType === 'video' && !formData.videoFile) {
        throw new Error('Please select a video file');
      }

      const storyData = {
        title: formData.title,
        category: formData.category,
        genderPerspective: formData.genderPerspective,
        abuseType: formData.abuseType,
        contentType: formData.contentType,
        triggerWarning: formData.triggerWarning,
        healingPrompt: formData.healingPrompt,
        isAnonymous: formData.isAnonymous,
        authorId: user?.uid || 'anonymous',
        authorName: formData.isAnonymous ? 'Anonymous Survivor' : (user?.displayName || 'Anonymous'),
        authorGender: formData.isAnonymous ? null : (user?.gender || null),
        content: formData.content // Will be empty string for video type initially
      };

      if (formData.contentType === 'video') {
        // Upload Video to Firebase Storage
        const fileName = `story-videos/${Date.now()}_${formData.videoFile.name}`;
        const storageRef = ref(storage, fileName);

        // In a real app we'd use uploadBytesResumable to show progress
        // For now, simple uploadBytes
        const snapshot = await uploadBytes(storageRef, formData.videoFile);
        const downloadUrl = await getDownloadURL(snapshot.ref);

        storyData.videoUrl = downloadUrl;
        storyData.content = "Video Story"; // Fallback text content
      }

      const newStory = await createStory(storyData);

      // Show success message
      alert('✅ Your story has been shared successfully! It will be permanently stored and visible to the community in the "Community Stories & Videos" section.');

      if (onStoryPosted) {
        onStoryPosted(newStory);
      }

      onClose();
    } catch (error) {
      console.error("Submission error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-story-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Share Your Story</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="story-form">
          <div className="form-group">
            <label htmlFor="title">Story Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Give your story a title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contentType">Content Type</label>
            <select
              id="contentType"
              name="contentType"
              value={formData.contentType}
              onChange={handleInputChange}
            >
              <option value="text">Written Story</option>
              <option value="video">Video Story</option>
            </select>
          </div>

          {formData.contentType === 'text' ? (
            <div className="form-group">
              <label htmlFor="content">Your Story *</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Share your experience..."
                rows={8}
                required
              />
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="videoFile">Upload Video *</label>
              <div className="upload-instruction">
                Supported formats: MP4, WebM. Max size: 50MB.
              </div>
              <input
                type="file"
                id="videoFile"
                accept="video/*"
                onChange={handleFileChange}
                required
              />
              {formData.videoFile && (
                <div className="video-preview">
                  <video controls width="300">
                    <source src={URL.createObjectURL(formData.videoFile)} type="video/mp4" />
                  </video>
                </div>
              )}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="genderPerspective">Gender Perspective *</label>
              <select
                id="genderPerspective"
                name="genderPerspective"
                value={formData.genderPerspective}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Perspective</option>
                <option value="male">Male Survivor</option>
                <option value="female">Female Survivor</option>
                <option value="non-binary">Non-binary Survivor</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="abuseType">Type of Abuse</label>
            <select
              id="abuseType"
              name="abuseType"
              value={formData.abuseType}
              onChange={handleInputChange}
            >
              <option value="">Select Type</option>
              <option value="physical">Physical Abuse</option>
              <option value="emotional">Emotional/Psychological Abuse</option>
              <option value="sexual">Sexual Violence</option>
              <option value="domestic">Domestic Violence</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleInputChange}
              />
              Post anonymously
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="triggerWarning"
                checked={formData.triggerWarning}
                onChange={handleInputChange}
              />
              Add trigger warning for sensitive content
            </label>
          </div>

          <div className="form-group checkbox-group gdpr-box">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="gdprConsent"
                checked={formData.gdprConsent}
                onChange={handleInputChange}
                required
              />
              I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>. I understand that my content will be stored securely and I can request deletion at any time.
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="healingPrompt">Healing Prompt (Optional)</label>
            <select
              id="healingPrompt"
              name="healingPrompt"
              value={formData.healingPrompt}
              onChange={handleInputChange}
            >
              <option value="">Select a prompt</option>
              <option value="recovery">What helped you recover?</option>
              <option value="advice">What would you tell your younger self?</option>
              <option value="support">How did you find support?</option>
              <option value="breaking-free">How did you break free?</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-btn" style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? (formData.contentType === 'video' ? 'Uploading Video...' : 'Sharing...') : 'Share Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostStory;