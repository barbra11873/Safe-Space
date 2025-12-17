// Quiz Service for Firebase operations
import { collection, addDoc, getDocs, doc, updateDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';

// Sample quiz questions data structure by level
export const quizQuestionsByLevel = {
    beginner: [
        {
            question: "Which of the following is a type of Gender-Based Violence?",
            type: "multiple-choice",
            choices: ["Physical violence", "Economic abuse", "Emotional abuse", "All of the above"],
            correctAnswer: [3],
            explanation: "Gender-Based Violence includes physical, emotional, economic, and other forms of abuse.",
            points: 10,
            order: 1
        },
        {
            question: "Domestic violence only happens to women.",
            type: "true-false",
            choices: ["True", "False"],
            correctAnswer: [1],
            explanation: "This is a myth. Domestic violence can happen to anyone, regardless of gender.",
            points: 10,
            order: 2
        },
        {
            question: "What is physical abuse in a relationship?",
            type: "multiple-choice",
            choices: [
                "Yelling and name-calling",
                "Hitting, slapping, or pushing",
                "Controlling money",
                "Threatening to leave"
            ],
            correctAnswer: [1],
            explanation: "Physical abuse involves any intentional physical contact that causes harm or fear.",
            points: 10,
            order: 3
        },
        {
            question: "Victims of domestic violence should stay and try to work things out.",
            type: "true-false",
            choices: ["True", "False"],
            correctAnswer: [1],
            explanation: "This is a myth. If someone is being abused, they should seek help and prioritize their safety.",
            points: 10,
            order: 4
        },
        {
            question: "Which of these is a sign of emotional abuse?",
            type: "multiple-choice",
            choices: [
                "Bruises and injuries",
                "Constant criticism and put-downs",
                "Missing money",
                "Broken furniture"
            ],
            correctAnswer: [1],
            explanation: "Emotional abuse involves attacking someone's self-worth through words and actions.",
            points: 10,
            order: 5
        }
    ],
    intermediate: [
        {
            question: "Which statements about domestic violence are true?",
            type: "multiple-answer",
            choices: [
                "It only happens to women",
                "Children can be affected even if not directly abused",
                "It's always physical violence",
                "Economic abuse is a form of domestic violence"
            ],
            correctAnswer: [1, 3],
            explanation: "Domestic violence affects all genders, impacts children indirectly, and includes non-physical forms like economic abuse.",
            points: 15,
            order: 1
        },
        {
            question: "What is the 'cycle of violence'?",
            type: "multiple-choice",
            choices: [
                "A pattern where abuse happens repeatedly",
                "A type of exercise program",
                "A legal term for court proceedings",
                "A medical condition"
            ],
            correctAnswer: [0],
            explanation: "The cycle of violence describes the pattern of tension building, abusive incident, honeymoon phase, and calm period that repeats in abusive relationships.",
            points: 15,
            order: 2
        },
        {
            question: "Your friend tells you their partner controls their spending and isolates them from family. What type of abuse is this?",
            type: "scenario",
            choices: ["Physical abuse", "Economic and emotional abuse", "Sexual abuse", "Neglect"],
            correctAnswer: [1],
            explanation: "Controlling finances and social isolation are forms of economic and emotional abuse.",
            points: 15,
            order: 3
        },
        {
            question: "Which of these should you do if you suspect domestic violence?",
            type: "multiple-answer",
            choices: [
                "Confront the abuser directly",
                "Listen without judgment",
                "Help them find resources",
                "Tell them to leave immediately"
            ],
            correctAnswer: [1, 2],
            explanation: "Support victims by listening, believing them, and helping them access professional resources. Never confront the abuser directly as it can be dangerous.",
            points: 15,
            order: 4
        },
        {
            question: "What is gaslighting in an abusive relationship?",
            type: "multiple-choice",
            choices: [
                "Using utilities without permission",
                "Making someone doubt their own reality",
                "Physical violence",
                "Financial control"
            ],
            correctAnswer: [1],
            explanation: "Gaslighting is a form of emotional abuse where the abuser makes the victim doubt their own perceptions and sanity.",
            points: 15,
            order: 5
        }
    ],
    advanced: [
        {
            question: "Which of these are considered coercive control tactics?",
            type: "multiple-answer",
            choices: [
                "Monitoring phone calls and messages",
                "Controlling what clothes to wear",
                "Isolating from friends and family",
                "All of the above"
            ],
            correctAnswer: [0, 1, 2, 3],
            explanation: "Coercive control involves a pattern of behaviors designed to dominate and control another person, including monitoring, isolation, and controlling appearance.",
            points: 20,
            order: 1
        },
        {
            question: "What is the difference between situational couple violence and intimate terrorism?",
            type: "scenario",
            choices: [
                "Situational is one-time, terrorism is ongoing",
                "Situational is mutual, terrorism is one-sided control",
                "Situational is physical, terrorism is emotional",
                "There is no difference"
            ],
            correctAnswer: [1],
            explanation: "Situational couple violence involves mutual arguments that escalate, while intimate terrorism involves one partner using violence as part of a pattern of control and domination.",
            points: 20,
            order: 2
        },
        {
            question: "Which factors increase the risk of lethal violence in domestic abuse cases?",
            type: "multiple-answer",
            choices: [
                "Strangulation during abuse",
                "Threats to kill",
                "Access to weapons",
                "Recent separation"
            ],
            correctAnswer: [0, 1, 2, 3],
            explanation: "These are all major risk factors for lethal violence. Strangulation is particularly dangerous as it indicates intent to kill.",
            points: 20,
            order: 3
        },
        {
            question: "What is the role of power and control in domestic violence?",
            type: "multiple-choice",
            choices: [
                "It's not important",
                "It's the central dynamic",
                "It's only about physical strength",
                "It's a myth"
            ],
            correctAnswer: [1],
            explanation: "Domestic violence is fundamentally about power and control. Physical violence is just one tactic abusers use to maintain dominance.",
            points: 20,
            order: 4
        },
        {
            question: "Which approach is most effective for intervening in domestic violence?",
            type: "scenario",
            choices: [
                "Individual counseling for the victim",
                "Coordinated community response involving multiple agencies",
                "Arresting the abuser",
                "Family mediation"
            ],
            correctAnswer: [1],
            explanation: "A coordinated community response involving law enforcement, social services, advocacy, and the courts provides the most comprehensive support for victims and accountability for abusers.",
            points: 20,
            order: 5
        }
    ]
};

// Get questions for a specific level
export const getQuestionsForLevel = (level) => {
    return quizQuestionsByLevel[level] || quizQuestionsByLevel.beginner;
};

// Legacy function for backward compatibility
export const sampleQuizQuestions = quizQuestionsByLevel.beginner;

// Initialize quiz questions in Firebase (run this once)
export const initializeQuizQuestions = async () => {
    try {
        const questionsRef = collection(db, 'quizQuestions');

        for (const question of sampleQuizQuestions) {
            await addDoc(questionsRef, question);
        }

        console.log('Quiz questions initialized successfully');
    } catch (error) {
        console.error('Error initializing quiz questions:', error);
    }
};

// Get all quiz questions
export const getQuizQuestions = async () => {
    try {
        const questionsRef = collection(db, 'quizQuestions');
        const q = query(questionsRef, orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);

        const questions = [];
        querySnapshot.forEach((doc) => {
            questions.push({ id: doc.id, ...doc.data() });
        });

        return questions;
    } catch (error) {
        console.error('Error getting quiz questions:', error);
        throw error;
    }
};

// Save quiz result
export const saveQuizResult = async (resultData) => {
    try {
        const resultsRef = collection(db, 'quizResults');
        const docRef = await addDoc(resultsRef, {
            ...resultData,
            timestamp: new Date()
        });

        return docRef.id;
    } catch (error) {
        console.error('Error saving quiz result:', error);
        throw error;
    }
};

// Get user's quiz history
export const getUserQuizHistory = async (userId) => {
    try {
        const resultsRef = collection(db, 'quizResults');
        const q = query(
            resultsRef,
            where('userId', '==', userId),
            orderBy('timestamp', 'desc'),
            limit(10)
        );
        const querySnapshot = await getDocs(q);

        const history = [];
        querySnapshot.forEach((doc) => {
            history.push({ id: doc.id, ...doc.data() });
        });

        return history;
    } catch (error) {
        console.error('Error getting quiz history:', error);
        throw error;
    }
};

// Get leaderboard (top scores)
export const getLeaderboard = async (limitCount = 10) => {
    try {
        const resultsRef = collection(db, 'quizResults');
        const q = query(
            resultsRef,
            orderBy('score', 'desc'),
            orderBy('timestamp', 'desc'),
            limit(limitCount)
        );
        const querySnapshot = await getDocs(q);

        const leaderboard = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            leaderboard.push({
                id: doc.id,
                score: data.score,
                totalQuestions: data.totalQuestions,
                accuracy: Math.round((data.score / data.totalPossibleScore) * 100),
                timestamp: data.timestamp
            });
        });

        return leaderboard;
    } catch (error) {
        console.error('Error getting leaderboard:', error);
        throw error;
    }
};

// Update question (admin function)
export const updateQuizQuestion = async (questionId, updates) => {
    try {
        const questionRef = doc(db, 'quizQuestions', questionId);
        await updateDoc(questionRef, updates);
        console.log('Question updated successfully');
    } catch (error) {
        console.error('Error updating question:', error);
        throw error;
    }
};

// Get leaderboard for a specific level
export const getLeaderboardForLevel = async (level, limitCount = 10) => {
    try {
        const resultsRef = collection(db, 'quizResults');
        const q = query(
            resultsRef,
            where('level', '==', level),
            orderBy('score', 'desc'),
            orderBy('timestamp', 'desc'),
            limit(limitCount)
        );
        const querySnapshot = await getDocs(q);

        const leaderboard = [];
        querySnapshot.forEach((doc, index) => {
            const data = doc.data();
            leaderboard.push({
                id: doc.id,
                rank: index + 1,
                score: data.score,
                totalQuestions: data.totalQuestions,
                accuracy: Math.round((data.score / data.totalPossibleScore) * 100),
                level: data.level,
                timestamp: data.timestamp
            });
        });

        return leaderboard;
    } catch (error) {
        console.error('Error getting leaderboard:', error);
        return [];
    }
};

// Get overall leaderboard (across all levels)
export const getOverallLeaderboard = async (limitCount = 10) => {
    try {
        const resultsRef = collection(db, 'quizResults');
        const q = query(
            resultsRef,
            orderBy('score', 'desc'),
            orderBy('timestamp', 'desc'),
            limit(limitCount)
        );
        const querySnapshot = await getDocs(q);

        const leaderboard = [];
        querySnapshot.forEach((doc, index) => {
            const data = doc.data();
            leaderboard.push({
                id: doc.id,
                rank: index + 1,
                score: data.score,
                totalQuestions: data.totalQuestions,
                accuracy: Math.round((data.score / data.totalPossibleScore) * 100),
                level: data.level,
                timestamp: data.timestamp
            });
        });

        return leaderboard;
    } catch (error) {
        console.error('Error getting overall leaderboard:', error);
        return [];
    }
};

// Quiz statistics
export const getQuizStatistics = async () => {
    try {
        const resultsRef = collection(db, 'quizResults');
        const querySnapshot = await getDocs(resultsRef);

        let totalQuizzes = 0;
        let totalScore = 0;
        let averageScore = 0;
        const scoreDistribution = {};

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            totalQuizzes++;
            totalScore += data.score;

            const percentage = Math.round((data.score / data.totalPossibleScore) * 100);
            scoreDistribution[percentage] = (scoreDistribution[percentage] || 0) + 1;
        });

        if (totalQuizzes > 0) {
            averageScore = Math.round(totalScore / totalQuizzes);
        }

        return {
            totalQuizzes,
            averageScore,
            scoreDistribution
        };
    } catch (error) {
        console.error('Error getting quiz statistics:', error);
        throw error;
    }
};

// Level progression logic
export const checkLevelProgression = (currentLevel, recentScores) => {
    const levelThresholds = {
        beginner: { minScore: 35, minAttempts: 2 }, // 70% average
        intermediate: { minScore: 50, minAttempts: 3 }, // 80% average
        advanced: { minScore: 75, minAttempts: 4 } // 90% average
    };

    if (currentLevel === 'beginner' && recentScores.length >= 2) {
        const avgScore = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
        if (avgScore >= 35) { // 70% average
            return 'intermediate';
        }
    } else if (currentLevel === 'intermediate' && recentScores.length >= 3) {
        const avgScore = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
        if (avgScore >= 50) { // 80% average
            return 'advanced';
        }
    }

    return currentLevel;
};