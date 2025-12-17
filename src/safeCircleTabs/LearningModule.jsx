import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    getLearningModule,
    getLessonsByModule,
    updateUserProgress,
    getUserProgress
} from './api/storiesService';
import { useAuth } from '../AuthContext';
import BreadCrumb from './BreadCrumb';
import '../SafeCircle.css';
import './LearningModule.css';

const LearningModule = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const [module, setModule] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [userProgress, setUserProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentLesson, setCurrentLesson] = useState(null);

    useEffect(() => {
        if (id) {
            loadModule(id);
        }
    }, [id]);

    useEffect(() => {
        if (module && user) {
            loadUserProgress();
        }
    }, [module, user]);

    const loadModule = async (moduleId) => {
        try {
            setLoading(true);
            const moduleData = await getLearningModule(moduleId);
            setModule(moduleData);

            const lessonsData = await getLessonsByModule(moduleId);
            setLessons(lessonsData);
        } catch (error) {
            console.error('Error loading module:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadUserProgress = async () => {
        try {
            const progress = await getUserProgress(user.uid, module.id);
            setUserProgress(progress);
        } catch (error) {
            console.error('Error loading user progress:', error);
        }
    };

    const getLessonProgress = (lessonId) => {
        const lessonProgress = userProgress.find(p => p.lessonId === lessonId);
        return lessonProgress || { completed: false, lastAccessed: null };
    };

    const markLessonComplete = async (lessonId) => {
        if (!user) return;

        try {
            await updateUserProgress(user.uid, module.id, lessonId, {
                completed: true,
                completedAt: new Date()
            });
            loadUserProgress(); // Refresh progress
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const getModuleProgress = () => {
        if (!user || lessons.length === 0) return 0;
        const completedLessons = lessons.filter(lesson =>
            getLessonProgress(lesson.id).completed
        ).length;
        return Math.round((completedLessons / lessons.length) * 100);
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

    if (loading) {
        return (
            <section className="learning-module">
                <div className="loading">Loading learning module...</div>
            </section>
        );
    }

    if (!module) {
        return (
            <section className="learning-module">
                <div className="error">Learning module not found</div>
            </section>
        );
    }

    return (
        <section className="learning-module">
            <div className="module-top-nav">
                <BreadCrumb />
            </div>

            <div className="module-header">
                <div className="module-info">
                    <div className="module-category-badge">
                        <span className="category-icon">{getCategoryIcon(module.category)}</span>
                        <span className="category-label">
                            {module.category?.replace('-', ' ').toUpperCase()}
                        </span>
                    </div>

                    <h1 className="module-title">{module.title}</h1>
                    <p className="module-description">{module.description}</p>

                    <div className="module-meta">
                        <div className="meta-item">
                            <span className="meta-icon">📖</span>
                            <span>{lessons.length} lessons</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-icon">⏱️</span>
                            <span>{module.estimatedTime || '30'} min</span>
                        </div>
                        <div
                            className="difficulty-badge"
                            style={{ backgroundColor: getDifficultyColor(module.difficulty) }}
                        >
                            {module.difficulty?.toUpperCase()}
                        </div>
                    </div>

                    {user && (
                        <div className="module-progress">
                            <div className="progress-label">
                                Your Progress: {getModuleProgress()}%
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${getModuleProgress()}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="module-objectives">
                    <h3>🎯 Learning Objectives</h3>
                    {module.objectives && (
                        <ul>
                            {module.objectives.map((objective, index) => (
                                <li key={index}>{objective}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="lessons-section">
                <h2>📚 Module Lessons</h2>

                <div className="lessons-list">
                    {lessons.map((lesson, index) => {
                        const progress = getLessonProgress(lesson.id);
                        return (
                            <div key={lesson.id} className="lesson-card">
                                <div className="lesson-header">
                                    <div className="lesson-number">
                                        {index + 1}
                                    </div>
                                    <div className="lesson-status">
                                        {progress.completed ? (
                                            <span className="completed-badge">✅ Completed</span>
                                        ) : progress.lastAccessed ? (
                                            <span className="in-progress-badge">⏳ In Progress</span>
                                        ) : (
                                            <span className="not-started-badge">🔒 Not Started</span>
                                        )}
                                    </div>
                                </div>

                                <div className="lesson-content">
                                    <h3 className="lesson-title">{lesson.title}</h3>
                                    <p className="lesson-description">
                                        {lesson.description?.substring(0, 120)}
                                        {lesson.description?.length > 120 && '...'}
                                    </p>

                                    <div className="lesson-meta">
                                        <span className="lesson-type">
                                            {lesson.contentType === 'video' ? '🎥 Video' :
                                             lesson.contentType === 'interactive' ? '🎮 Interactive' :
                                             '📄 Reading'}
                                        </span>
                                        <span className="lesson-duration">
                                            {lesson.estimatedTime || '5'} min
                                        </span>
                                    </div>
                                </div>

                                <div className="lesson-actions">
                                    <button
                                        className="start-lesson-btn"
                                        onClick={() => setCurrentLesson(lesson)}
                                    >
                                        {progress.completed ? 'Review Lesson' : 'Start Lesson'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Lesson Modal */}
            {currentLesson && (
                <LessonModal
                    lesson={currentLesson}
                    module={module}
                    onClose={() => setCurrentLesson(null)}
                    onComplete={() => markLessonComplete(currentLesson.id)}
                    userProgress={getLessonProgress(currentLesson.id)}
                />
            )}

            {/* Module Resources */}
            <div className="module-resources">
                <h3>📋 Additional Resources</h3>
                <div className="resources-grid">
                    <div className="resource-card">
                        <h4>📞 Emergency Support</h4>
                        <p>Kenya Police: 112 | GBV Hotline: 1195</p>
                    </div>

                    <div className="resource-card">
                        <h4>🏥 Medical Help</h4>
                        <p>Seek immediate medical attention if injured</p>
                    </div>

                    <div className="resource-card">
                        <h4>💬 Counseling</h4>
                        <p>Professional support for emotional healing</p>
                    </div>

                    <div className="resource-card">
                        <h4>📚 Further Reading</h4>
                        <p>Explore related articles and research</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Lesson Modal Component
const LessonModal = ({ lesson, module, onClose, onComplete, userProgress }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [completed, setCompleted] = useState(userProgress.completed);

    const steps = [
        { title: 'Introduction', content: lesson.introduction || lesson.description },
        { title: 'Main Content', content: lesson.content },
        ...(lesson.keyPoints ? [{ title: 'Key Points', content: lesson.keyPoints }] : []),
        { title: 'Summary', content: lesson.summary || 'Review what you\'ve learned in this lesson.' }
    ];

    const handleComplete = () => {
        setCompleted(true);
        onComplete();
    };

    return (
        <div className="lesson-modal-overlay">
            <div className="lesson-modal">
                <div className="modal-header">
                    <div className="lesson-info">
                        <h2>{lesson.title}</h2>
                        <p>{module.title}</p>
                    </div>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="lesson-progress">
                    <div className="progress-steps">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                                onClick={() => setCurrentStep(index)}
                            >
                                {index + 1}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lesson-content">
                    <h3>{steps[currentStep].title}</h3>
                    <div className="content-area">
                        {steps[currentStep].content}
                    </div>
                </div>

                <div className="lesson-navigation">
                    <button
                        className="nav-btn prev-btn"
                        disabled={currentStep === 0}
                        onClick={() => setCurrentStep(currentStep - 1)}
                    >
                        ← Previous
                    </button>

                    {currentStep === steps.length - 1 ? (
                        <button
                            className={`complete-btn ${completed ? 'completed' : ''}`}
                            onClick={handleComplete}
                        >
                            {completed ? '✅ Completed' : 'Mark as Complete'}
                        </button>
                    ) : (
                        <button
                            className="nav-btn next-btn"
                            onClick={() => setCurrentStep(currentStep + 1)}
                        >
                            Next →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LearningModule;