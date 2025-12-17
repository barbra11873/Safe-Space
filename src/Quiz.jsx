import React, { useState, useEffect } from 'react';
import SafeSpaceHeader from './SafeSpaceHeader';
import SafeSpaceFooter from './SafeSpaceFooter';
import quizImage from './assets/images/quiz 1.svg';
import { getQuizQuestions, saveQuizResult, sampleQuizQuestions, getQuizStatistics, getQuestionsForLevel, getLeaderboardForLevel, getOverallLeaderboard, checkLevelProgression } from './quizService';
import './Quiz.css';

const Quiz = () => {
    const [quizState, setQuizState] = useState('intro'); // intro, quiz, feedback, results, progress
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes default
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);
    const [loading, setLoading] = useState(true);
    const [quizResults, setQuizResults] = useState([]);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [sessionAttempts, setSessionAttempts] = useState(0);
    const [currentLevel, setCurrentLevel] = useState('beginner'); // beginner, intermediate, advanced
    const [userLevel, setUserLevel] = useState('beginner'); // User's unlocked level
    const [leaderboard, setLeaderboard] = useState([]);

    // Set default level on component mount
    useEffect(() => {
        setUserLevel('beginner');
        setCurrentLevel('beginner');
    }, []);

    // Load questions based on selected level
    useEffect(() => {
        const levelQuestions = getQuestionsForLevel(currentLevel);
        setQuestions(levelQuestions);
        setLoading(false);
    }, [currentLevel]);

    // Load leaderboard and stats on component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                // Load quiz statistics
                const stats = await getQuizStatistics();
                setTotalAttempts(stats.totalQuizzes);

                // Load leaderboard for current level
                const levelBoard = await getLeaderboardForLevel(currentLevel);
                setLeaderboard(levelBoard);
            } catch (error) {
                console.log('Could not load data, using defaults');
                setTotalAttempts(0);
                setLeaderboard([]);
            }
        };

        loadData();
    }, [currentLevel]);

    // Timer effect
    useEffect(() => {
        let timer;
        if (quizState === 'quiz' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handleQuizComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [quizState, timeLeft]);

    const getSampleQuestions = () => [
        {
            id: 1,
            type: 'multiple-choice',
            question: 'Which of the following is a type of Gender-Based Violence?',
            choices: ['Physical violence', 'Economic abuse', 'Emotional abuse', 'All of the above'],
            correctAnswer: [3],
            explanation: 'Gender-Based Violence includes physical, emotional, economic, and other forms of abuse.',
            points: 10
        },
        {
            id: 2,
            type: 'multiple-answer',
            question: 'Which statements about domestic violence are true?',
            choices: [
                'It only happens to women',
                'Children can be affected even if not directly abused',
                'It\'s always physical violence',
                'Economic abuse is a form of domestic violence'
            ],
            correctAnswer: [1, 3],
            explanation: 'Domestic violence affects all genders, impacts children indirectly, and includes non-physical forms like economic abuse.',
            points: 15
        },
        {
            id: 3,
            type: 'true-false',
            question: 'Victims of domestic violence are always responsible for the abuse they experience.',
            choices: ['True', 'False'],
            correctAnswer: [1],
            explanation: 'This is a myth. Abusers are always responsible for their violent behavior.',
            points: 10
        },
        {
            id: 4,
            type: 'scenario',
            question: 'Your friend tells you their partner controls their spending and isolates them from family. What type of abuse is this?',
            choices: ['Physical abuse', 'Economic and emotional abuse', 'Sexual abuse', 'Neglect'],
            correctAnswer: [1],
            explanation: 'Controlling finances and social isolation are forms of economic and emotional abuse.',
            points: 15
        },
        {
            id: 5,
            type: 'multiple-choice',
            question: 'What should you do if you suspect someone is experiencing domestic violence?',
            choices: [
                'Confront their partner directly',
                'Tell them to leave immediately',
                'Listen without judgment and offer support',
                'Ignore it as it\'s their private matter'
            ],
            correctAnswer: [2],
            explanation: 'Support victims by listening, believing them, and helping them access professional resources.',
            points: 10
        }
    ];

    const startQuiz = () => {
        setQuizState('quiz');
        setCurrentQuestionIndex(0);
        setAnswers({});
        setScore(0);
        setTimeLeft(300);
    };

    const handleAnswer = (selectedAnswers) => {
        const currentQuestion = questions[currentQuestionIndex];
        const isAnswerCorrect = checkAnswer(selectedAnswers, currentQuestion.correctAnswer);

        setAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: selectedAnswers
        }));

        if (isAnswerCorrect) {
            setScore(prev => prev + currentQuestion.points);
        }

        setIsCorrect(isAnswerCorrect);
        setFeedbackMessage(currentQuestion.explanation);
        setShowFeedback(true);
    };

    const checkAnswer = (selected, correct) => {
        if (Array.isArray(correct)) {
            return selected.length === correct.length &&
                   selected.every(answer => correct.includes(answer));
        }
        return selected[0] === correct[0];
    };

    const nextQuestion = () => {
        setShowFeedback(false);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            handleQuizComplete();
        }
    };

    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            setShowFeedback(false);
        }
    };

    const handleQuizComplete = async () => {
        setQuizState('results');

        // Save results anonymously to Firebase
        try {
            const quizData = {
                score: score,
                totalQuestions: questions.length,
                totalPossibleScore: questions.reduce((sum, q) => sum + q.points, 0),
                answers: answers,
                level: currentLevel,
                userId: 'anonymous',
                timestamp: new Date()
            };

            await saveQuizResult(quizData);

            // Check for level progression (simplified for anonymous users)
            const accuracy = Math.round((score / questions.reduce((sum, q) => sum + q.points, 0)) * 100);
            const recentScores = [accuracy];
            const newLevel = checkLevelProgression(userLevel, recentScores);

            if (newLevel !== userLevel) {
                setUserLevel(newLevel);
                alert(`Congratulations! You've advanced to ${newLevel.charAt(0).toUpperCase() + newLevel.slice(1)} level!`);
            }
        } catch (error) {
            console.error('Error saving results:', error);
        }
    };

    const restartQuiz = () => {
        // Add confirmation for restart
        const confirmRestart = window.confirm(
            "Are you sure you want to retake the quiz? Your previous results will be saved."
        );

        if (confirmRestart) {
            setSessionAttempts(prev => prev + 1);
            setQuizState('intro');
            setCurrentQuestionIndex(0);
            setAnswers({});
            setScore(0);
            setTimeLeft(300);
            setShowFeedback(false);
        }
    };

    const quickRestart = () => {
        // Skip confirmation for immediate restart
        setSessionAttempts(prev => prev + 1);
        setQuizState('intro');
        setCurrentQuestionIndex(0);
        setAnswers({});
        setScore(0);
        setTimeLeft(300);
        setShowFeedback(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getLevelIndex = (level) => {
        const levels = { beginner: 0, intermediate: 1, advanced: 2 };
        return levels[level] || 0;
    };

    const getProgressPercentage = () => {
        return ((currentQuestionIndex + 1) / questions.length) * 100;
    };

    if (loading) {
        return (
            <>
                <SafeSpaceHeader bgColor='#E6F4EA'/>
                <div className="quiz-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading quiz questions...</p>
                </div>
                <SafeSpaceFooter/>
            </>
        );
    }

    return (
        <>
            <SafeSpaceHeader bgColor='#E6F4EA'/>
            <section className="quiz-container">
                {quizState === 'intro' && (
                    <div className="quiz-intro">
                        <div className="hero">
                            <h1 className="title">Test Your Knowledge About GBV</h1>
                            <img src={quizImage} alt="Quiz illustration" className="hero-image"/>
                        </div>
                        <div className="intro-content">
                            <p>This quiz will test your understanding of Gender-Based Violence topics.</p>

                            {/* Level Selection */}
                            <div className="level-selection">
                                <h3>Select Difficulty Level</h3>
                                <div className="level-buttons">
                                    {[
                                        { key: 'beginner', label: 'Beginner', icon: '🌱', description: 'Basic concepts' },
                                        { key: 'intermediate', label: 'Intermediate', icon: '🌿', description: 'Deeper understanding' },
                                        { key: 'advanced', label: 'Advanced', icon: '🌳', description: 'Expert knowledge' }
                                    ].map((level) => (
                                        <button
                                            key={level.key}
                                            className={`level-btn ${currentLevel === level.key ? 'active' : ''} ${userLevel === level.key || getLevelIndex(userLevel) > getLevelIndex(level.key) ? 'unlocked' : 'locked'}`}
                                            onClick={() => (userLevel === level.key || getLevelIndex(userLevel) > getLevelIndex(level.key)) && setCurrentLevel(level.key)}
                                            disabled={!(userLevel === level.key || getLevelIndex(userLevel) > getLevelIndex(level.key))}
                                        >
                                            <div className="level-icon">{level.icon}</div>
                                            <div className="level-info">
                                                <div className="level-name">{level.label}</div>
                                                <div className="level-desc">{level.description}</div>
                                            </div>
                                            {currentLevel === level.key && <div className="current-badge">Current</div>}
                                            {userLevel !== level.key && getLevelIndex(userLevel) <= getLevelIndex(level.key) && <div className="lock-icon">🔒</div>}
                                        </button>
                                    ))}
                                </div>
                                <div className="level-progress">
                                    <div className="progress-text">
                                        Current Level: <span className="current-level">{currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}</span>
                                    </div>
                                    {userLevel !== 'advanced' && (
                                        <div className="next-level-hint">
                                            Complete quizzes with high scores to unlock the next level!
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="quiz-info">
                                <div className="info-item">
                                    <span className="info-label">Questions:</span>
                                    <span className="info-value">{questions.length}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Time Limit:</span>
                                    <span className="info-value">5 minutes</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Max Score:</span>
                                    <span className="info-value">{questions.reduce((sum, q) => sum + q.points, 0)}</span>
                                </div>
                                <div className="info-item attempts-counter">
                                    <span className="info-label">Total Attempts:</span>
                                    <span className="info-value attempts-number">{totalAttempts}</span>
                                </div>
                                {sessionAttempts > 0 && (
                                    <div className="info-item session-counter">
                                        <span className="info-label">Your Retakes:</span>
                                        <span className="info-value">{sessionAttempts}</span>
                                    </div>
                                )}
                            </div>

                            <div className="intro-actions">
                                <button className="start-quiz-btn" onClick={startQuiz}>
                                    Start {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} Quiz
                                </button>
                                <button className="progress-btn" onClick={() => setQuizState('progress')}>
                                    My Progress
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {quizState === 'quiz' && (
                    <div className="quiz-active">
                        <div className="quiz-header">
                            <div className="progress-info">
                                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                                <span>Score: {score}</span>
                            </div>
                            <div className="timer">
                                Time: {formatTime(timeLeft)}
                            </div>
                        </div>

                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${getProgressPercentage()}%` }}
                            ></div>
                        </div>

                        <div className="question-container">
                            {questions[currentQuestionIndex] && (
                                <QuestionComponent
                                    question={questions[currentQuestionIndex]}
                                    onAnswer={handleAnswer}
                                    showFeedback={showFeedback}
                                    feedbackMessage={feedbackMessage}
                                    isCorrect={isCorrect}
                                    selectedAnswers={answers[currentQuestionIndex] || []}
                                />
                            )}
                        </div>

                        <div className="quiz-navigation">
                            <button
                                className="nav-btn prev-btn"
                                onClick={previousQuestion}
                                disabled={currentQuestionIndex === 0}
                            >
                                Previous
                            </button>
                            <button
                                className="nav-btn next-btn"
                                onClick={nextQuestion}
                                disabled={!showFeedback}
                            >
                                {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
                            </button>
                        </div>
                    </div>
                )}

                {quizState === 'results' && (
                    <div className="quiz-results">
                        <h2>Quiz Complete!</h2>
                        <div className="results-summary">
                            <div className="score-display">
                                <div className="final-score">{score}</div>
                                <div className="score-label">Your Score</div>
                            </div>
                            <div className="results-stats">
                                <div className="stat">
                                    <span className="stat-value">{questions.length}</span>
                                    <span className="stat-label">Questions</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">
                                        {Math.round((score / questions.reduce((sum, q) => sum + q.points, 0)) * 100)}%
                                    </span>
                                    <span className="stat-label">Accuracy</span>
                                </div>
                            </div>
                        </div>

                        <div className="results-message">
                            {score >= 35 ? (
                                <div className="message excellent">
                                    <h3>Excellent! 🎉</h3>
                                    <p>You have a great understanding of GBV topics. Keep up the good work!</p>
                                </div>
                            ) : score >= 25 ? (
                                <div className="message good">
                                    <h3>Good Job! 👍</h3>
                                    <p>You have a solid understanding. Consider learning more about specific areas.</p>
                                </div>
                            ) : (
                                <div className="message needs-improvement">
                                    <h3>Keep Learning 📚</h3>
                                    <p>Consider reviewing the myths and facts section to strengthen your understanding.</p>
                                </div>
                            )}
                        </div>

                        <div className="retake-info">
                            <p>💡 <strong>Learning Tip:</strong> Retaking quizzes helps reinforce your understanding of GBV topics!</p>
                        </div>

                        <div className="results-actions">
                            <button className="action-btn quick-restart-btn" onClick={quickRestart}>
                                Quick Retake
                            </button>
                            <button className="action-btn restart-btn" onClick={restartQuiz}>
                                Take Quiz Again
                            </button>
                            <button className="action-btn review-btn" onClick={() => setQuizState('review')}>
                                Review Answers
                            </button>
                        </div>
                    </div>
                )}

                {quizState === 'progress' && (
                    <div className="quiz-progress">
                        <div className="progress-header">
                            <h2>My Learning Progress</h2>
                            <button className="back-btn" onClick={() => setQuizState('intro')}>
                                ← Back to Quiz
                            </button>
                        </div>

                        <div className="progress-overview">
                            <div className="overview-card">
                                <div className="overview-icon">📊</div>
                                <div className="overview-content">
                                    <h3>Session Attempts</h3>
                                    <div className="overview-number">{sessionAttempts}</div>
                                </div>
                            </div>

                            <div className="overview-card">
                                <div className="overview-icon">🎯</div>
                                <div className="overview-content">
                                    <h3>Last Score</h3>
                                    <div className="overview-number">{score}</div>
                                </div>
                            </div>

                            <div className="overview-card">
                                <div className="overview-icon">🏆</div>
                                <div className="overview-content">
                                    <h3>Current Level</h3>
                                    <div className="overview-number">{userLevel.charAt(0).toUpperCase() + userLevel.slice(1)}</div>
                                </div>
                            </div>
                        </div>

                        <div className="progress-details">
                            <h3>Quiz History</h3>
                            {totalAttempts === 0 ? (
                                <div className="no-history">
                                    <p>You haven't taken any quizzes yet. Start your learning journey!</p>
                                    <button className="start-from-progress-btn" onClick={startQuiz}>
                                        Take Your First Quiz
                                    </button>
                                </div>
                            ) : (
                                <div className="history-list">
                                    {/* Mock history data - in real app this would come from Firebase */}
                                    <div className="history-item">
                                        <div className="history-date">Today</div>
                                        <div className="history-score">
                                            <span className="score-value">35/50</span>
                                            <span className="score-percentage">(70%)</span>
                                        </div>
                                        <div className="history-status excellent">Excellent</div>
                                    </div>

                                    <div className="history-item">
                                        <div className="history-date">Yesterday</div>
                                        <div className="history-score">
                                            <span className="score-value">28/50</span>
                                            <span className="score-percentage">(56%)</span>
                                        </div>
                                        <div className="history-status good">Good</div>
                                    </div>

                                    <div className="history-item">
                                        <div className="history-date">2 days ago</div>
                                        <div className="history-score">
                                            <span className="score-value">42/50</span>
                                            <span className="score-percentage">(84%)</span>
                                        </div>
                                        <div className="history-status excellent">Excellent</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="progress-insights">
                            <h3>Learning Insights</h3>
                            <div className="insights-grid">
                                <div className="insight-card">
                                    <h4>Strength Areas</h4>
                                    <ul>
                                        <li>Understanding of basic GBV concepts</li>
                                        <li>Recognition of abuse signs</li>
                                        <li>Knowledge of support resources</li>
                                    </ul>
                                </div>

                                <div className="insight-card">
                                    <h4>Areas for Improvement</h4>
                                    <ul>
                                        <li>Legal aspects of domestic violence</li>
                                        <li>Intervention strategies</li>
                                        <li>Long-term recovery processes</li>
                                    </ul>
                                </div>

                                <div className="insight-card">
                                    <h4>Recommended Next Steps</h4>
                                    <ul>
                                        <li>Review myths and facts section</li>
                                        <li>Explore additional resources</li>
                                        <li>Consider advanced topics</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="leaderboard-section">
                            <h3>🏆 Leaderboard - {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} Level</h3>
                            {leaderboard.length === 0 ? (
                                <div className="no-leaderboard">
                                    <p>Be the first to take this level's quiz and top the leaderboard!</p>
                                </div>
                            ) : (
                                <div className="leaderboard-table">
                                    <div className="leaderboard-header">
                                        <span>Rank</span>
                                        <span>Score</span>
                                        <span>Accuracy</span>
                                        <span>Date</span>
                                    </div>
                                    {leaderboard.map((entry) => (
                                        <div key={entry.id} className={`leaderboard-row ${entry.rank <= 3 ? 'top-three' : ''}`}>
                                            <div className="rank">
                                                {entry.rank === 1 && '🥇'}
                                                {entry.rank === 2 && '🥈'}
                                                {entry.rank === 3 && '🥉'}
                                                {entry.rank > 3 && `#${entry.rank}`}
                                            </div>
                                            <div className="score">{entry.score}/{entry.totalQuestions * 10}</div>
                                            <div className="accuracy">{entry.accuracy}%</div>
                                            <div className="date">{new Date(entry.timestamp.seconds * 1000).toLocaleDateString()}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="leaderboard-note">
                                <p>🔒 <strong>Privacy Protected:</strong> All scores are anonymous. No personal information is collected or displayed.</p>
                            </div>
                        </div>
                    </div>
                )}
            </section>
            <SafeSpaceFooter/>
        </>
    );
};

// Question Component
const QuestionComponent = ({ question, onAnswer, showFeedback, feedbackMessage, isCorrect, selectedAnswers }) => {
    const [localAnswers, setLocalAnswers] = useState(selectedAnswers);

    const handleOptionClick = (optionIndex) => {
        if (showFeedback) return;

        if (question.type === 'multiple-answer') {
            const newAnswers = localAnswers.includes(optionIndex)
                ? localAnswers.filter(a => a !== optionIndex)
                : [...localAnswers, optionIndex];
            setLocalAnswers(newAnswers);
        } else {
            setLocalAnswers([optionIndex]);
        }
    };

    const submitAnswer = () => {
        if (localAnswers.length > 0) {
            onAnswer(localAnswers);
        }
    };

    return (
        <div className="question-wrapper">
            <div className="question-text">
                <h3>{question.question}</h3>
            </div>

            <div className="options-container">
                {question.choices.map((choice, index) => (
                    <button
                        key={index}
                        className={`option-btn ${
                            localAnswers.includes(index) ? 'selected' : ''
                        } ${
                            showFeedback ?
                                (question.correctAnswer.includes(index) ? 'correct' :
                                 localAnswers.includes(index) && !question.correctAnswer.includes(index) ? 'incorrect' : '')
                            : ''
                        }`}
                        onClick={() => handleOptionClick(index)}
                        disabled={showFeedback}
                    >
                        <span className="option-letter">
                            {question.type === 'true-false' ?
                                (index === 0 ? 'T' : 'F') :
                                String.fromCharCode(65 + index)}
                        </span>
                        <span className="option-text">{choice}</span>
                    </button>
                ))}
            </div>

            {!showFeedback && (
                <button
                    className="submit-answer-btn"
                    onClick={submitAnswer}
                    disabled={localAnswers.length === 0}
                >
                    Submit Answer
                </button>
            )}

            {showFeedback && (
                <div className={`feedback ${isCorrect ? 'correct-feedback' : 'incorrect-feedback'}`}>
                    <div className="feedback-header">
                        <span className="feedback-icon">{isCorrect ? '✅' : '❌'}</span>
                        <span className="feedback-title">
                            {isCorrect ? 'Correct!' : 'Incorrect'}
                        </span>
                    </div>
                    <p className="feedback-message">{feedbackMessage}</p>
                </div>
            )}
        </div>
    );
};

export default Quiz;
