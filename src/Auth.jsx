import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import './Auth.css';

const Auth = () => {
    const { currentUser, updateUserProfile } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isSignUp) {
                // Sign Up
                if (password !== confirmPassword) {
                    throw new Error('Passwords do not match');
                }

                if (password.length < 6) {
                    throw new Error('Password should be at least 6 characters');
                }

                const userCredential = await createUserWithEmailAndPassword(auth, email, password);

                // Create user profile in Firestore
                await setDoc(doc(db, 'users', userCredential.user.uid), {
                    email: email,
                    displayName: displayName || email.split('@')[0],
                    level: 'beginner',
                    totalScore: 0,
                    quizzesCompleted: 0,
                    createdAt: new Date(),
                    lastLogin: new Date()
                });

                onAuthSuccess(userCredential.user);
            } else {
                // Sign In
                const userCredential = await signInWithEmailAndPassword(auth, email, password);

                // Update last login
                const userRef = doc(db, 'users', userCredential.user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    await setDoc(userRef, {
                        ...userDoc.data(),
                        lastLogin: new Date()
                    }, { merge: true });
                }

                onAuthSuccess(userCredential.user);
            }
        } catch (error) {
            console.error('Auth error:', error);
            let errorMessage = 'An error occurred. Please try again.';

            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'This email is already registered. Please sign in instead.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password should be at least 6 characters.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Please enter a valid email address.';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email. Please sign up first.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password. Please try again.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many failed attempts. Please try again later.';
                    break;
                default:
                    errorMessage = error.message;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            onSignOut();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    if (currentUser) {
        return (
            <div className="auth-container">
                <div className="user-profile">
                    <div className="user-avatar">
                        {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="user-info">
                        <h3>Welcome back!</h3>
                        <p className="user-email">{currentUser.email}</p>
                        <p className="user-name">{currentUser.displayName || 'User'}</p>
                    </div>
                    <button className="sign-out-btn" onClick={handleSignOut}>
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
                    <p>{isSignUp ? 'Join our community to track your learning progress' : 'Sign in to access your personalized dashboard'}</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {isSignUp && (
                        <div className="form-group">
                            <label htmlFor="displayName" className="form-label">Display Name (Optional)</label>
                            <input
                                type="text"
                                id="displayName"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="auth-input"
                                placeholder="Your preferred name"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="auth-input"
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="auth-input"
                            placeholder="Minimum 6 characters"
                            required
                        />
                    </div>

                    {isSignUp && (
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="auth-input"
                                placeholder="Repeat your password"
                                required
                            />
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
                    </button>
                </form>

                <div className="auth-toggle">
                    <p>
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                        <button
                            type="button"
                            className="toggle-btn"
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError('');
                                setEmail('');
                                setPassword('');
                                setConfirmPassword('');
                                setDisplayName('');
                            }}
                        >
                            {isSignUp ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </div>

                <div className="auth-privacy">
                    <p className="privacy-text">
                        🔒 Your privacy is protected. We only collect information necessary for your learning experience.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;