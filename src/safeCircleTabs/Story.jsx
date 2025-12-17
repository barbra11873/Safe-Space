import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getStory, getAllStories } from './api/storiesService';
import { useAuth } from '../AuthContext';
import CommentsSection from './CommentsSection';
import LikeDislikeButtons from './LikeDislikeButtons';
import BreadCrumb from './BreadCrumb';
import '../SafeCircle.css';
import './Story.css';

const Story = () => {
    useAuth(); // Ensure auth context is available
    const { id } = useParams();
    const [story, setStory] = useState(null);
    const [similarStories, setSimilarStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (id) {
            loadStory(id);
            loadSimilarStories();
        }
    }, [id]);

    const loadStory = async (storyId) => {
        try {
            setLoading(true);
            const storyData = await getStory(storyId);
            setStory(storyData);
        } catch (error) {
            console.error('Error loading story:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadSimilarStories = async () => {
        try {
            // Load stories from same category or recent stories
            const stories = await getAllStories({ limit: 6 });
            setSimilarStories(stories.filter(s => s.id !== id));
        } catch (error) {
            console.error('Error loading similar stories:', error);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <section className="storyWrapper">
                <div className="loading">Loading story...</div>
            </section>
        );
    }

    if (!story) {
        return (
            <section className="storyWrapper">
                <div className="error">Story not found</div>
            </section>
        );
    }
    
    return (
        <section className="storyWrapper">
            <div className="storyTopNav">
                <BreadCrumb />
                <input
                    type="text"
                    placeholder="Search stories..."
                    className="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="contentArea">
                <div>
                    <div className="storyCard">
                        <div className="storyTopBar">
                            <div className="userProfile">
                                {story.authorName?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                            <div>
                                <span className="userName">{story.authorName || 'Anonymous Survivor'}</span>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    {story.genderPerspective} Survivor • {formatDate(story.createdAt)}
                                </div>
                            </div>
                            <h1 className="videoTitle">{story.title}</h1>
                        </div>

                        <div className="storyContent">
                            {story.triggerWarning && (
                                <div className="triggerWarning">
                                    ⚠️ Trigger Warning: This story contains sensitive content about abuse experiences.
                                </div>
                            )}

                            {story.healingPrompt && (
                                <div className="healingPrompt">
                                    💭 Healing Prompt: {story.healingPrompt}
                                </div>
                            )}

                            {story.contentType === 'video' && story.videoUrl ? (
                                <div className="storyMedia">
                                    <video controls poster={story.thumbnailUrl}>
                                        <source src={story.videoUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            ) : (
                                <div className="storyText">{story.content}</div>
                            )}
                        </div>

                        <div className="storyBottomBar">
                            <div className="reactionStrip">
                                <div className="reactionButtons">
                                    <LikeDislikeButtons
                                        storyId={story.id}
                                        initialLikes={story.likes || 0}
                                        initialDislikes={story.dislikes || 0}
                                    />
                                </div>
                                <div className="storyStats">
                                    <span>❤️ {story.likes || 0}</span>
                                    <span>💬 {story.commentsCount || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <CommentsSection storyId={story.id} />
                </div>

                <div className="sideSuggestions">
                    <h3>Similar Stories</h3>
                    <div className="similarStoriesContainer">
                        {similarStories.length > 0 ? (
                            similarStories.slice(0, 5).map((similarStory) => (
                                <Link
                                    key={similarStory.id}
                                    className="similarStory"
                                    to={`/forum/stories/${similarStory.id}`}
                                    style={{
                                        backgroundImage: similarStory.thumbnailUrl
                                            ? `url(${similarStory.thumbnailUrl})`
                                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                    }}
                                >
                                    <div className="colourWrapper">
                                        <p className="title">{similarStory.title}</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="errorMessage">No similar stories available</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Story
