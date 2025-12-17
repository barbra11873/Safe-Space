import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './UserProfile.css';

const UserProfile = () => {
    const { currentUser, userProfile, updateUserProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [posts, setPosts] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            loadUserData();
        }
    }, [currentUser]);

    const loadUserData = async () => {
        try {
            // Load user posts
            const postsQuery = query(
                collection(db, 'posts'),
                where('authorId', '==', currentUser.uid)
            );
            const postsSnapshot = await getDocs(postsQuery);
            const userPosts = postsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(userPosts);

            // Load notifications (mock data for now)
            setNotifications([
                { id: 1, type: 'like', message: 'Someone liked your post', time: '2 hours ago' },
                { id: 2, type: 'comment', message: 'New comment on your story', time: '1 day ago' },
                { id: 3, type: 'event', message: 'Upcoming event: GBV Awareness Workshop', time: '3 days ago' }
            ]);
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const handleProfilePictureUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `profile-pictures/${currentUser.uid}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            await updateUserProfile({ profilePicture: downloadURL });
        } catch (error) {
            console.error('Error uploading profile picture:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateProfile = async (field, value) => {
        setLoading(true);
        try {
            await updateUserProfile({ [field]: value });
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser || !userProfile) {
        return <div className="loading">Loading profile...</div>;
    }

    return (
        <div className="user-profile-page">
            <div className="profile-header">
                <div className="profile-avatar-section">
                    <div className="profile-avatar">
                        {userProfile.profilePicture ? (
                            <img src={userProfile.profilePicture} alt="Profile" />
                        ) : (
                            <div className="default-avatar">
                                {userProfile.displayName?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        )}
                        <label className="upload-overlay">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePictureUpload}
                                style={{ display: 'none' }}
                            />
                            {uploading ? 'Uploading...' : 'Change Photo'}
                        </label>
                    </div>
                </div>
                <div className="profile-info">
                    <h1>{userProfile.displayName || 'User'}</h1>
                    <p className="profile-email">{userProfile.email}</p>
                    <div className="profile-stats">
                        <div className="stat">
                            <span className="stat-number">{posts.length}</span>
                            <span className="stat-label">Posts</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">{userProfile.quizzesCompleted || 0}</span>
                            <span className="stat-label">Quizzes</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">{userProfile.totalScore || 0}</span>
                            <span className="stat-label">Score</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-tabs">
                <button
                    className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    Profile Settings
                </button>
                <button
                    className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('posts')}
                >
                    My Posts
                </button>
                <button
                    className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('notifications')}
                >
                    Notifications
                </button>
            </div>

            <div className="profile-content">
                {activeTab === 'profile' && (
                    <div className="profile-settings">
                        <div className="setting-group">
                            <label>Display Name</label>
                            <input
                                type="text"
                                value={userProfile.displayName || ''}
                                onChange={(e) => handleUpdateProfile('displayName', e.target.value)}
                                placeholder="Your display name"
                            />
                        </div>
                        <div className="setting-group">
                            <label>Bio</label>
                            <textarea
                                value={userProfile.bio || ''}
                                onChange={(e) => handleUpdateProfile('bio', e.target.value)}
                                placeholder="Tell us about yourself..."
                                rows={4}
                            />
                        </div>
                        <div className="setting-group">
                            <label>Level</label>
                            <span className="level-badge">{userProfile.level || 'beginner'}</span>
                        </div>
                    </div>
                )}

                {activeTab === 'posts' && (
                    <div className="user-posts">
                        <h3>My Forum Posts</h3>
                        {posts.length === 0 ? (
                            <p className="no-posts">No posts yet. Start sharing in the forum!</p>
                        ) : (
                            <div className="posts-list">
                                {posts.map(post => (
                                    <div key={post.id} className="post-item">
                                        <h4>{post.title}</h4>
                                        <p>{post.content?.substring(0, 100)}...</p>
                                        <small>{new Date(post.createdAt?.toDate()).toLocaleDateString()}</small>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="notifications">
                        <h3>Recent Notifications</h3>
                        {notifications.length === 0 ? (
                            <p className="no-notifications">No new notifications</p>
                        ) : (
                            <div className="notifications-list">
                                {notifications.map(notification => (
                                    <div key={notification.id} className="notification-item">
                                        <div className="notification-icon">
                                            {notification.type === 'like' && '❤️'}
                                            {notification.type === 'comment' && '💬'}
                                            {notification.type === 'event' && '📅'}
                                        </div>
                                        <div className="notification-content">
                                            <p>{notification.message}</p>
                                            <small>{notification.time}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;