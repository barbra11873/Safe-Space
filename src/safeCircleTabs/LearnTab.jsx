import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllLearningModules, getUserProgress, testFirestoreConnection } from './api/storiesService';
import { useAuth } from '../AuthContext';
import '../SafeCircle.css';
import './LearnTab.css';

const LearnTab = () => {
    const { user } = useAuth();
    const [modules, setModules] = useState([]);
    const [userProgress, setUserProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        difficulty: '',
        search: ''
    });

    useEffect(() => {
        loadModules();
        if (user) {
            loadUserProgress();
        }
    }, [filters, user]);

    const loadModules = async () => {
        try {
            setLoading(true);
            console.log('Loading learning modules with filters:', filters);
            const fetchedModules = await getAllLearningModules(filters);
            console.log('Fetched modules:', fetchedModules);
            setModules(fetchedModules);
        } catch (error) {
            console.error('Error loading modules:', error);
            setModules([]);
        } finally {
            setLoading(false);
        }
    };

    const loadUserProgress = async () => {
        try {
            const progress = await getUserProgress(user.uid);
            setUserProgress(progress);
        } catch (error) {
            console.error('Error loading user progress:', error);
        }
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({ ...prev, [filterType]: value }));
    };

    const getModuleProgress = (moduleId) => {
        const moduleProgress = userProgress.filter(p => p.moduleId === moduleId);
        if (moduleProgress.length === 0) return 0;

        const completedLessons = moduleProgress.filter(p => p.completed).length;
        return Math.round((completedLessons / moduleProgress.length) * 100);
    };

    const getDifficultyColor = (difficulty) => {
        const colors = {
            'beginner': '#27ae60',
            'intermediate': '#f39c12',
            'advanced': '#e74c3c'
        };
        return colors[difficulty] || '#95a5a6';
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'understanding-gbv': '🎯',
            'gender-inclusivity': '🌈',
            'myths-facts': '❌',
            'after-violation': '🛡️',
            'prevention': '✋',
            'healing': '💚'
        };
        return icons[category] || '📚';
    };

    const getCategoryTitle = (category) => {
        const titles = {
            'understanding-gbv': 'Understanding GBV',
            'gender-inclusivity': 'Gender & Inclusivity',
            'myths-facts': 'Myths & Facts',
            'after-violation': 'What To Do After Violation',
            'prevention': 'Prevention & Healthy Relationships',
            'healing': 'Healing & Recovery'
        };
        return titles[category] || category.replace('-', ' ').toUpperCase();
    };

    return (
        <section className="learn-tab">
            <div className="learn-header">
                <div className="header-content">
                    <h2>📚 Learn & Educate</h2>
                    <p className="header-description">
                        Comprehensive educational content on Gender-Based Violence prevention, awareness, and healing
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
                        className="refresh-learn-btn"
                        onClick={() => loadModules()}
                        title="Refresh learning modules"
                    >
                        🔄
                    </button>
                </div>
            </div>

            <div className="filters-section">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search learning modules..."
                        value={filters.search || ''}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                </div>

                <div className="sort-filter-row">
                    <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="understanding-gbv">Understanding GBV</option>
                        <option value="gender-inclusivity">Gender & Inclusivity</option>
                        <option value="myths-facts">Myths & Facts</option>
                        <option value="after-violation">What To Do After Violation</option>
                        <option value="prevention">Prevention & Healthy Relationships</option>
                        <option value="healing">Healing & Recovery</option>
                    </select>

                    <select
                        value={filters.difficulty}
                        onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                    >
                        <option value="">All Levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
            </div>

            {/* Learning Path Overview */}
            <div className="learning-path-section">
                <div className="section-header">
                    <h3>🗺️ Your Learning Journey</h3>
                    <p>Structured educational path from awareness to action</p>
                </div>

                <div className="learning-path">
                    <div className="path-step">
                        <div className="step-icon">🎯</div>
                        <h4>Understanding GBV</h4>
                        <p>Learn about types and forms of GBV</p>
                    </div>
                    <div className="path-arrow">→</div>
                    <div className="path-step">
                        <div className="step-icon">🌈</div>
                        <h4>Gender Inclusivity</h4>
                        <p>GBV affects all genders</p>
                    </div>
                    <div className="path-arrow">→</div>
                    <div className="path-step">
                        <div className="step-icon">❌</div>
                        <h4>Myths & Facts</h4>
                        <p>Correct common misconceptions</p>
                    </div>
                    <div className="path-arrow">→</div>
                    <div className="path-step">
                        <div className="step-icon">🛡️</div>
                        <h4>After Violation</h4>
                        <p>What to do when it happens</p>
                    </div>
                    <div className="path-arrow">→</div>
                    <div className="path-step">
                        <div className="step-icon">✋</div>
                        <h4>Prevention</h4>
                        <p>Healthy relationships & safety</p>
                    </div>
                    <div className="path-arrow">→</div>
                    <div className="path-step">
                        <div className="step-icon">💚</div>
                        <h4>Healing</h4>
                        <p>Recovery and support</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading learning modules...</div>
            ) : (
                <>
                    {modules.length > 0 ? (
                        <div className="modules-grid">
                            {modules.map((module) => (
                                <div key={module.id} className="module-card">
                                    <div className="module-header">
                                        <div className="module-category">
                                            <span className="category-icon">{getCategoryIcon(module.category)}</span>
                                            <span className="category-label">
                                                {getCategoryTitle(module.category)}
                                            </span>
                                        </div>
                                        <div
                                            className="difficulty-badge"
                                            style={{ backgroundColor: getDifficultyColor(module.difficulty) }}
                                        >
                                            {module.difficulty?.toUpperCase()}
                                        </div>
                                    </div>

                                    <div className="module-content">
                                        <h3 className="module-title">{module.title}</h3>
                                        <p className="module-description">
                                            {module.description?.substring(0, 120)}
                                            {module.description?.length > 120 && '...'}
                                        </p>

                                        <div className="module-meta">
                                            <div className="meta-item">
                                                <span className="meta-icon">📖</span>
                                                <span>{module.totalLessons || 0} lessons</span>
                                            </div>
                                            <div className="meta-item">
                                                <span className="meta-icon">⏱️</span>
                                                <span>{module.estimatedTime || '30'} min</span>
                                            </div>
                                            <div className="meta-item">
                                                <span className="meta-icon">👥</span>
                                                <span>{module.completionCount || 0} completed</span>
                                            </div>
                                        </div>

                                        {user && (
                                            <div className="progress-section">
                                                <div className="progress-label">
                                                    Your Progress: {getModuleProgress(module.id)}%
                                                </div>
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-fill"
                                                        style={{ width: `${getModuleProgress(module.id)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="module-footer">
                                        <div className="module-actions">
                                            <Link to={`${module.id}`} className="start-module-btn">
                                                {getModuleProgress(module.id) > 0 ? 'Continue Learning' : 'Start Module'}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-modules">
                            <p>No learning modules found matching your criteria.</p>
                            <p>Check back later for new educational content!</p>
                            <button
                                onClick={() => loadModules()}
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
                                🔄 Refresh Modules
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Educational Resources Sidebar */}
            <div className="educational-resources">
                <h3>📋 Learning Tips</h3>
                <div className="resource-card">
                    <h4>🎯 Set Learning Goals</h4>
                    <p>Take your time with each module. Learning about GBV is important but can be emotionally challenging.</p>
                </div>

                <div className="resource-card">
                    <h4>🤝 Take Breaks</h4>
                    <p>If content becomes overwhelming, take a break. Your mental health comes first.</p>
                </div>

                <div className="resource-card">
                    <h4>💬 Discuss & Reflect</h4>
                    <p>Share what you've learned with trusted friends or join our support groups.</p>
                </div>

                <div className="resource-card">
                    <h4>📞 Get Support</h4>
                    <p>If you need immediate help: Kenya Police - 112, GBV Hotline - 1195</p>
                </div>

                <div className="resource-card">
                    <h4>🏆 Track Progress</h4>
                    <p>Your learning journey is personal. Celebrate small victories along the way.</p>
                </div>
            </div>
        </section>
    );
};

export default LearnTab;