import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    getEvent,
    registerForEvent,
    markEventInterest,
    checkUserRegistration,
    checkUserInterest
} from './api/storiesService';
import { useAuth } from '../AuthContext';
import BreadCrumb from './BreadCrumb';
import CommentsSection from './CommentsSection';
import '../SafeCircle.css';
import './Event.css';

const Event = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isInterested, setIsInterested] = useState(false);
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);
    const [registrationLoading, setRegistrationLoading] = useState(false);

    useEffect(() => {
        if (id) {
            loadEvent(id);
            if (user) {
                checkUserStatus();
            }
        }
    }, [id, user]);

    const loadEvent = async (eventId) => {
        try {
            setLoading(true);
            const eventData = await getEvent(eventId);
            setEvent(eventData);
        } catch (error) {
            console.error('Error loading event:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkUserStatus = async () => {
        try {
            const [registered, interested] = await Promise.all([
                checkUserRegistration(id, user.uid),
                checkUserInterest(id, user.uid)
            ]);
            setIsRegistered(registered);
            setIsInterested(interested);
        } catch (error) {
            console.error('Error checking user status:', error);
        }
    };

    const handleInterestToggle = async () => {
        if (!user) {
            alert('Please log in to mark your interest');
            return;
        }

        try {
            await markEventInterest(id, user.uid, !isInterested);
            setIsInterested(!isInterested);

            // Update local event data
            setEvent(prev => ({
                ...prev,
                interestedCount: prev.interestedCount + (isInterested ? -1 : 1)
            }));
        } catch (error) {
            console.error('Error updating interest:', error);
            alert('Failed to update interest. Please try again.');
        }
    };

    const handleRegistration = async (registrationData) => {
        if (!user) {
            alert('Please log in to register for events');
            return;
        }

        setRegistrationLoading(true);
        try {
            await registerForEvent(id, {
                userId: user.uid,
                userName: user.displayName || 'Anonymous',
                userEmail: registrationData.email,
                userPhone: registrationData.phone,
                specialRequirements: registrationData.specialRequirements,
                anonymous: registrationData.anonymous
            });

            setIsRegistered(true);
            setShowRegistrationForm(false);

            // Update local event data
            setEvent(prev => ({
                ...prev,
                registeredCount: prev.registeredCount + 1
            }));

            alert('Successfully registered for the event!');
        } catch (error) {
            console.error('Error registering for event:', error);
            alert('Failed to register. Please try again.');
        } finally {
            setRegistrationLoading(false);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'long',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getEventTypeIcon = (type) => {
        const icons = {
            'awareness': '📢',
            'workshop': '🎓',
            'webinar': '💻',
            'support-group': '🤝',
            'outreach': '🌍',
            'training': '⚡'
        };
        return icons[type] || '📅';
    };

    if (loading) {
        return (
            <section className="event-detail">
                <div className="loading">Loading event details...</div>
            </section>
        );
    }

    if (!event) {
        return (
            <section className="event-detail">
                <div className="error">Event not found</div>
            </section>
        );
    }

    return (
        <section className="event-detail">
            <div className="event-top-nav">
                <BreadCrumb />
            </div>

            <div className="event-main">
                <div className="event-content">
                    <div className="event-header">
                        <div className="event-type-badge">
                            <span className="type-icon">{getEventTypeIcon(event.type)}</span>
                            <span className="type-label">
                                {event.type?.replace('-', ' ').toUpperCase()}
                            </span>
                        </div>

                        <h1 className="event-title">{event.title}</h1>

                        <div className="event-meta">
                            <div className="meta-item">
                                <span className="meta-icon">📅</span>
                                <span className="meta-text">
                                    {formatDate(event.startDate)}
                                    {event.startTime && ` at ${formatTime(event.startDate)}`}
                                </span>
                            </div>

                            {event.endDate && (
                                <div className="meta-item">
                                    <span className="meta-icon">⏰</span>
                                    <span className="meta-text">
                                        Ends: {formatDate(event.endDate)}
                                        {event.endTime && ` at ${formatTime(event.endDate)}`}
                                    </span>
                                </div>
                            )}

                            <div className="meta-item">
                                <span className="meta-icon">
                                    {event.locationType === 'online' ? '🌐' : '📍'}
                                </span>
                                <span className="meta-text">
                                    {event.locationType === 'online' ? 'Online Event' : 'Physical Event'}
                                </span>
                            </div>

                            {event.location && (
                                <div className="meta-item">
                                    <span className="meta-icon">📍</span>
                                    <span className="meta-text">{event.location}</span>
                                </div>
                            )}

                            {event.organizer && (
                                <div className="meta-item">
                                    <span className="meta-icon">👤</span>
                                    <span className="meta-text">Organized by: {event.organizer}</span>
                                </div>
                            )}

                            {event.targetAudience && (
                                <div className="meta-item">
                                    <span className="meta-icon">🎯</span>
                                    <span className="meta-text">
                                        Target Audience: {event.targetAudience.replace('-', ' ')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="event-description">
                        <h2>About This Event</h2>
                        <p>{event.description}</p>

                        {event.objectives && (
                            <div className="event-objectives">
                                <h3>Objectives</h3>
                                <ul>
                                    {event.objectives.map((objective, index) => (
                                        <li key={index}>{objective}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {event.agenda && (
                            <div className="event-agenda">
                                <h3>Agenda</h3>
                                <div dangerouslySetInnerHTML={{ __html: event.agenda }} />
                            </div>
                        )}

                        {event.speakers && event.speakers.length > 0 && (
                            <div className="event-speakers">
                                <h3>Guest Speakers & Facilitators</h3>
                                <div className="speakers-grid">
                                    {event.speakers.map((speaker, index) => (
                                        <div key={index} className="speaker-card">
                                            <h4>{speaker.name}</h4>
                                            <p>{speaker.title}</p>
                                            {speaker.organization && (
                                                <p className="organization">{speaker.organization}</p>
                                            )}
                                            {speaker.bio && (
                                                <p className="bio">{speaker.bio}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {event.virtualLink && event.locationType === 'online' && (
                            <div className="virtual-access">
                                <h3>Virtual Access</h3>
                                <p>
                                    <strong>Join Link:</strong>{' '}
                                    <a href={event.virtualLink} target="_blank" rel="noopener noreferrer">
                                        {event.virtualLink}
                                    </a>
                                </p>
                                {event.meetingId && (
                                    <p><strong>Meeting ID:</strong> {event.meetingId}</p>
                                )}
                                {event.passcode && (
                                    <p><strong>Passcode:</strong> {event.passcode}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="event-actions">
                        <div className="action-buttons">
                            <button
                                className={`interest-btn ${isInterested ? 'interested' : ''}`}
                                onClick={handleInterestToggle}
                            >
                                {isInterested ? '❤️ Interested' : '🤔 Mark as Interested'}
                            </button>

                            {!isRegistered ? (
                                <button
                                    className="register-btn"
                                    onClick={() => setShowRegistrationForm(true)}
                                >
                                    📝 Register for Event
                                </button>
                            ) : (
                                <button className="registered-btn" disabled>
                                    ✅ Already Registered
                                </button>
                            )}
                        </div>

                        <div className="event-stats">
                            <span>❤️ {event.interestedCount || 0} interested</span>
                            <span>👥 {event.registeredCount || 0} registered</span>
                        </div>
                    </div>

                    {/* Registration Form Modal */}
                    {showRegistrationForm && (
                        <EventRegistrationForm
                            event={event}
                            onSubmit={handleRegistration}
                            onClose={() => setShowRegistrationForm(false)}
                            loading={registrationLoading}
                        />
                    )}

                    {/* Comments Section */}
                    <CommentsSection storyId={id} />
                </div>

                <div className="event-sidebar">
                    <div className="event-summary">
                        <h3>Event Summary</h3>
                        <div className="summary-item">
                            <strong>Type:</strong> {event.type?.replace('-', ' ')}
                        </div>
                        <div className="summary-item">
                            <strong>Date:</strong> {formatDate(event.startDate)}
                        </div>
                        <div className="summary-item">
                            <strong>Time:</strong> {event.startTime || 'TBD'}
                        </div>
                        <div className="summary-item">
                            <strong>Location:</strong> {event.locationType === 'online' ? 'Online' : event.location || 'TBD'}
                        </div>
                        <div className="summary-item">
                            <strong>Target Audience:</strong> {event.targetAudience?.replace('-', ' ') || 'General'}
                        </div>
                    </div>

                    <div className="safety-info">
                        <h3>🛡️ Safety & Privacy</h3>
                        <ul>
                            <li>Your personal information is protected</li>
                            <li>You can register anonymously if preferred</li>
                            <li>Event discussions are moderated</li>
                            <li>Report any concerns to organizers</li>
                        </ul>
                    </div>

                    <div className="support-resources">
                        <h3>💬 Need Support?</h3>
                        <p>If you're in immediate danger:</p>
                        <ul>
                            <li><strong>Kenya:</strong> Call 119 (Police) or 112 (Emergency)</li>
                            <li><strong>GBV Hotline:</strong> 1195</li>
                        </ul>
                        <p>For counseling and support:</p>
                        <ul>
                            <li>COFEM Kenya</li>
                            <li>Raising Voices</li>
                            <li>Local support organizations</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Event Registration Form Component
const EventRegistrationForm = ({ event, onSubmit, onClose, loading }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        email: user?.email || '',
        phone: '',
        specialRequirements: '',
        anonymous: false
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="registration-modal-overlay">
            <div className="registration-modal">
                <div className="modal-header">
                    <h2>Register for: {event.title}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="registration-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Optional"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="specialRequirements">Special Requirements or Accessibility Needs</label>
                        <textarea
                            id="specialRequirements"
                            name="specialRequirements"
                            value={formData.specialRequirements}
                            onChange={handleInputChange}
                            placeholder="Any special accommodations needed..."
                            rows={3}
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="anonymous"
                                checked={formData.anonymous}
                                onChange={handleInputChange}
                            />
                            Register anonymously (your name won't be shared with other attendees)
                        </label>
                    </div>

                    <div className="privacy-notice">
                        <p><strong>Privacy Notice:</strong> Your information will only be used for event coordination and will not be shared without your consent.</p>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="cancel-btn">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="submit-btn">
                            {loading ? 'Registering...' : 'Complete Registration'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Event;