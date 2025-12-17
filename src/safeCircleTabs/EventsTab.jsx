import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllEvents, testFirestoreConnection } from './api/storiesService';
import { useAuth } from '../AuthContext';
import '../SafeCircle.css';
import './EventsTab.css';

const EventsTab = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        type: '',
        locationType: '',
        targetAudience: '',
        dateRange: 'upcoming', // 'upcoming', 'past', 'all'
        sortBy: 'date' // 'date', 'popular', 'recent'
    });

    useEffect(() => {
        loadEvents();
    }, [filters]);

    const loadEvents = async () => {
        try {
            setLoading(true);
            console.log('Loading events with filters:', filters);
            const fetchedEvents = await getAllEvents(filters);
            console.log('Fetched events:', fetchedEvents);
            setEvents(fetchedEvents);
        } catch (error) {
            console.error('Error loading events:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({ ...prev, [filterType]: value }));
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
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

    const getLocationTypeIcon = (locationType) => {
        return locationType === 'online' ? '🌐' : '📍';
    };

    return (
        <section className="events-component">
            <div className="events-header">
                <div className="header-content">
                    <h2>Community Events</h2>
                    <p className="header-description">
                        Join educational events, workshops, and support sessions focused on GBV prevention and healing
                    </p>
                </div>
                <div className="header-actions">
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
                        className="refresh-events-btn"
                        onClick={() => loadEvents()}
                        title="Refresh events from database"
                    >
                        🔄
                    </button>
                </div>
            </div>

            <div className="filters-section">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={filters.search || ''}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                </div>

                <div className="sort-filter-row">
                    <select
                        value={filters.dateRange}
                        onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    >
                        <option value="upcoming">Upcoming Events</option>
                        <option value="past">Past Events</option>
                        <option value="all">All Events</option>
                    </select>

                    <select
                        value={filters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                    >
                        <option value="">All Event Types</option>
                        <option value="awareness">Awareness Campaigns</option>
                        <option value="workshop">Educational Workshops</option>
                        <option value="webinar">Webinars & Talks</option>
                        <option value="support-group">Support Group Meetings</option>
                        <option value="outreach">Community Outreach</option>
                        <option value="training">Training Sessions</option>
                    </select>

                    <select
                        value={filters.locationType}
                        onChange={(e) => handleFilterChange('locationType', e.target.value)}
                    >
                        <option value="">All Locations</option>
                        <option value="online">Online Events</option>
                        <option value="physical">Physical Events</option>
                    </select>

                    <select
                        value={filters.targetAudience}
                        onChange={(e) => handleFilterChange('targetAudience', e.target.value)}
                    >
                        <option value="">All Audiences</option>
                        <option value="general">General Public</option>
                        <option value="survivors">Survivors</option>
                        <option value="youth">Youth & Students</option>
                        <option value="professionals">Professionals</option>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                    </select>

                    <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                        <option value="date">Sort by Date</option>
                        <option value="popular">Most Popular</option>
                        <option value="recent">Recently Added</option>
                    </select>
                </div>
            </div>

            {/* Events Section */}
            <div className="events-section">
                <div className="section-header">
                    <h3>📅 Upcoming Community Events</h3>
                    <p>Discover and join educational events focused on GBV prevention and healing</p>
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading events...</div>
            ) : (
                <>
                    {events.length > 0 ? (
                        <div className="events-grid">
                            {events.map((event) => (
                                <div key={event.id} className="event-card">
                                    <div className="event-header">
                                        <div className="event-type">
                                            <span className="type-icon">{getEventTypeIcon(event.type)}</span>
                                            <span className="type-label">
                                                {event.type?.replace('-', ' ').toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="event-location">
                                            <span className="location-icon">
                                                {getLocationTypeIcon(event.locationType)}
                                            </span>
                                            <span className="location-label">
                                                {event.locationType === 'online' ? 'Online' : 'Physical'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="event-content">
                                        <Link to={`${event.id}`} className="event-title">
                                            {event.title}
                                        </Link>

                                        <div className="event-meta">
                                            <div className="event-date">
                                                <strong>📅 {formatDate(event.startDate)}</strong>
                                                {event.startTime && (
                                                    <span> at {formatTime(event.startDate)}</span>
                                                )}
                                            </div>
                                            {event.location && (
                                                <div className="event-location-details">
                                                    📍 {event.location}
                                                </div>
                                            )}
                                            {event.organizer && (
                                                <div className="event-organizer">
                                                    👤 Organized by: {event.organizer}
                                                </div>
                                            )}
                                        </div>

                                        <p className="event-description">
                                            {event.description?.substring(0, 150)}
                                            {event.description?.length > 150 && '...'}
                                        </p>

                                        {event.targetAudience && (
                                            <div className="target-audience">
                                                🎯 For: {event.targetAudience.replace('-', ' ')}
                                            </div>
                                        )}
                                    </div>

                                    <div className="event-footer">
                                        <div className="event-stats">
                                            <span>❤️ {event.interestedCount || 0} interested</span>
                                            <span>👥 {event.registeredCount || 0} registered</span>
                                        </div>
                                        <div className="event-actions">
                                            <Link to={`${event.id}`} className="view-event-btn">
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-events">
                            <p>No events found matching your criteria.</p>
                            <p>Check back later for upcoming events!</p>
                            <button
                                onClick={() => loadEvents()}
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
                                🔄 Refresh Events
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Educational Resources Sidebar */}
            <div className="educational-resources">
                <h3>Event Categories</h3>
                <div className="resource-card">
                    <h4>📢 Awareness Campaigns</h4>
                    <p>GBV awareness days, gender equality advocacy, and community education events.</p>
                </div>

                <div className="resource-card">
                    <h4>🎓 Educational Workshops</h4>
                    <p>Learn about consent, healthy relationships, and knowing your rights.</p>
                </div>

                <div className="resource-card">
                    <h4>💻 Webinars & Online Talks</h4>
                    <p>Mental health recovery sessions and legal guidance webinars.</p>
                </div>

                <div className="resource-card">
                    <h4>🤝 Support Group Meetings</h4>
                    <p>Safe spaces for survivors to connect and heal together.</p>
                </div>

                <div className="resource-card">
                    <h4>🌍 Community Outreach</h4>
                    <p>School sensitization, youth forums, and community dialogues.</p>
                </div>

                <div className="resource-card">
                    <h4>⚡ Training Sessions</h4>
                    <p>Self-defense classes and bystander intervention training.</p>
                </div>
            </div>
        </section>
    );
};

export default EventsTab;