import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);

                // Fetch user profile from Firestore
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        setUserProfile(userDoc.data());
                    } else {
                        // Create default profile if it doesn't exist
                        setUserProfile({
                            level: 'beginner',
                            totalScore: 0,
                            quizzesCompleted: 0,
                            displayName: user.displayName || user.email.split('@')[0],
                            email: user.email
                        });
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    setUserProfile({
                        level: 'beginner',
                        totalScore: 0,
                        quizzesCompleted: 0,
                        displayName: user.displayName || user.email.split('@')[0],
                        email: user.email
                    });
                }
            } else {
                setCurrentUser(null);
                setUserProfile(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const updateUserProfile = async (updates) => {
        if (!currentUser) return;

        try {
            const userRef = doc(db, 'users', currentUser.uid);
            await setDoc(userRef, {
                ...userProfile,
                ...updates,
                lastUpdated: new Date()
            }, { merge: true });

            setUserProfile(prev => ({ ...prev, ...updates }));
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    };

    const isAdmin = () => {
        return userProfile?.role === 'admin' || userProfile?.role === 'moderator';
    };

    const isModerator = () => {
        return userProfile?.role === 'moderator';
    };

    const value = {
        currentUser,
        userProfile,
        loading,
        updateUserProfile,
        isAdmin,
        isModerator
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};