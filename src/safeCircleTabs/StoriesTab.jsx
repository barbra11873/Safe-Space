import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllStories, getCategories, testFirestoreConnection } from './api/storiesService';
import { useAuth } from '../AuthContext';
import PostStory from './PostStory';
import LikeDislikeButtons from './LikeDislikeButtons';
import '../SafeCircle.css';
import './StoriesTab.css';

const StoriesTab = () => {
    useAuth(); // Ensure auth context is available
    const [stories, setStories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPostForm, setShowPostForm] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        gender: '',
        sortBy: 'recent', // 'recent', 'liked', 'discussed'
        search: ''
    });

    useEffect(() => {
      // Set default categories immediately
      const defaultCats = [
        { id: "domestic-violence", name: "Domestic Violence" },
        { id: "sexual-assault", name: "Sexual Violence" },
        { id: "childhood-abuse", name: "Childhood Abuse" },
        { id: "recovery", name: "Recovery & Healing" },
        { id: "support-networks", name: "Support Networks" },
        { id: "breaking-cycles", name: "Breaking Cycles" }
      ];
      setCategories(defaultCats);
  
      loadStories();
      loadCategoriesFromDatabase();
    }, [filters]);

    const loadStories = async () => {
        try {
            setLoading(true);
            console.log('Loading stories with filters:', filters);
            const fetchedStories = await getAllStories(filters);
            console.log('Fetched stories:', fetchedStories);
            setStories(fetchedStories);
        } catch (error) {
            console.error('Error loading stories:', error);
            // Set empty array on error to show "no stories" message
            setStories([]);
        } finally {
            setLoading(false);
        }
    };

    const loadCategoriesFromDatabase = async () => {
      try {
        const cats = await getCategories();
        if (cats && cats.length > 0) {
          setCategories(cats);
        }
        // If database is empty, keep using default categories (already set)
      } catch (error) {
        console.error('Error loading categories from database:', error);
        // Keep using default categories (already set)
      }
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({ ...prev, [filterType]: value }));
    };

    const handleStoryPosted = (newStory) => {
        setStories(prev => [newStory, ...prev]);
        setShowPostForm(false);
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };
    return (
        <section className="stories-component">
            <div className="stories-header">
                <div className="header-content">
                    <h2>Survivor Stories</h2>
                    <p className="header-description">
                        Share your journey and find strength in community stories
                    </p>
                </div>
                <div className="header-actions">
                    <button
                        className="view-stories-btn"
                        onClick={() => {
                            const storiesSection = document.getElementById('stories-section');
                            if (storiesSection) {
                                storiesSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                    >
                        📚 View Shared Stories
                    </button>
                    <button
                        className="test-db-btn"
                        onClick={async () => {
                            const result = await testFirestoreConnection();
                            alert(result.success ? result.message : `Connection failed: ${result.error}`);
                        }}
                        title="Test database connection"
                    >
                        🧪 Test DB
                    </button>
                    <button
                        className="refresh-stories-btn"
                        onClick={() => loadStories()}
                        title="Refresh stories from database"
                    >
                        🔄
                    </button>
                    <button
                        className="post-story-btn"
                        onClick={() => setShowPostForm(true)}
                    >
                        ✍️ Share Your Story
                    </button>
                </div>
            </div>

            <div className="filters-section">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search stories..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                </div>

                <div className="sort-filter-row">
                    <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                        <option value="recent">Most Recent</option>
                        <option value="liked">Most Liked</option>
                        <option value="discussed">Most Discussed</option>
                    </select>

                    <select
                        value={filters.gender}
                        onChange={(e) => handleFilterChange('gender', e.target.value)}
                    >
                        <option value="">All Genders</option>
                        <option value="male">Male Survivors</option>
                        <option value="female">Female Survivors</option>
                        <option value="non-binary">Non-binary Survivors</option>
                    </select>

                    <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Shared Stories Section */}
            <div className="shared-stories-section">
                <div className="section-header">
                    <h3>📚 Community Stories & Videos</h3>
                    <p>All shared stories and videos are safely stored here and remain accessible to the community</p>
                    <div className="storage-status">
                        <small>
                            {stories.length > 0 && `${stories.length} stories loaded`}
                        </small>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading stories...</div>
            ) : (
                <>
                    {stories.length > 0 ? (
                        <div id="stories-section" className="stories-grid">
                            {stories.map((story) => (
                                <div key={story.id} className="story-card">
                                    <div className="story-header">
                                        <div className="story-author">
                                            <div className="author-avatar">
                                                {story.authorName?.charAt(0)?.toUpperCase() || 'A'}
                                            </div>
                                            <div className="author-info">
                                                <h4>{story.authorName || 'Anonymous Survivor'}</h4>
                                                <p>{story.genderPerspective} Survivor</p>
                                            </div>
                                        </div>
                                        <div className="story-date">
                                            {formatDate(story.createdAt)}
                                        </div>
                                    </div>

                                    <div className="story-content">
                                        {story.triggerWarning && (
                                            <div className="trigger-warning">
                                                ⚠️ Trigger Warning: Sensitive Content
                                            </div>
                                        )}

                                        <Link to={`${story.id}`} className="story-title">
                                            {story.title}
                                        </Link>

                                        {story.contentType === 'video' && story.videoUrl ? (
                                            <div className="story-media">
                                                <video controls>
                                                    <source src={story.videoUrl} type="video/mp4" />
                                                </video>
                                            </div>
                                        ) : (
                                            <p className="story-preview">{story.content}</p>
                                        )}
                                    </div>

                                    <div className="story-footer">
                                        <div className="story-stats">
                                            <LikeDislikeButtons
                                                storyId={story.id}
                                                initialLikes={story.likes || 0}
                                                initialDislikes={story.dislikes || 0}
                                            />
                                            <span>💬 {story.commentsCount || 0}</span>
                                        </div>
                                        <div className="story-actions">
                                            <Link to={`${story.id}`} className="view-story-btn">
                                                Read More
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-stories">
                            <p>No stories found matching your criteria.</p>
                            <p>Be the first to share your story!</p>
                            <button
                                onClick={() => loadStories()}
                                className="refresh-btn"
                                style={{
                                    marginTop: '10px',
                                    padding: '8px 16px',
                                    backgroundColor: '#3498db',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                🔄 Refresh Stories
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Educational Resources Sidebar */}
            <div className="educational-resources">
                <h3>Support & Resources</h3>
                <div className="resource-card">
                    <h4>🏥 Get Help Now</h4>
                    <p>If you're in immediate danger, call emergency services:</p>
                    <ul>
                        <li>Kenya: 119 (Police) or 112 (Emergency)</li>
                        <li>GBV Hotline: 1195</li>
                    </ul>
                </div>

                <div className="resource-card">
                    <h4>💬 Healing Journey</h4>
                    <p>Remember: Your story matters, and healing is possible.</p>
                    <ul>
                        <li>Seek professional counseling</li>
                        <li>Connect with support groups</li>
                        <li>Practice self-care</li>
                        <li>Share when you're ready</li>
                    </ul>
                </div>

                <div className="resource-card">
                    <h4>📚 Learn More</h4>
                    <p>Educational resources on GBV:</p>
                    <ul>
                        <li>COFEM Kenya</li>
                        <li>Raising Voices</li>
                        <li>UN Women</li>
                        <li>Local support organizations</li>
                    </ul>
                </div>

                <div className="resource-card">
                    <h4>⚖️ Know Your Rights</h4>
                    <p>GBV affects everyone. You have the right to:</p>
                    <ul>
                        <li>Live free from violence</li>
                        <li>Seek protection and justice</li>
                        <li>Access medical and psychological support</li>
                        <li>Share your experience safely</li>
                    </ul>
                </div>
            </div>

            {showPostForm && (
                <PostStory
                    onClose={() => setShowPostForm(false)}
                    onStoryPosted={handleStoryPosted}
                />
            )}
        </section>
    );
}

export default StoriesTab
