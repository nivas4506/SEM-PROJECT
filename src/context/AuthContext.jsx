import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [pendingOAuth, setPendingOAuth] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Load existing session on boot
  useEffect(() => {
    try {
      const existing = authService.getStoredSession();
      if (existing) {
        setSession(existing);
      }
    } catch (err) {
      console.error('Failed to restore session:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Toast notification helper
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sign In with Email
  const signInWithEmail = async (email, password) => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const newSession = await authService.signInWithEmail(email, password);
      setSession(newSession);
      addToast(`Welcome back, ${newSession.user.name}!`, 'success');
      return newSession;
    } catch (err) {
      setAuthError(err.message);
      addToast(err.message, 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Up with Email
  const signUpWithEmail = async ({ name, email, password }) => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const newSession = await authService.signUpWithEmail({ name, email, password });
      setSession(newSession);
      addToast(`Welcome to Social Platform, ${newSession.user.name}!`, 'success');
      return newSession;
    } catch (err) {
      setAuthError(err.message);
      addToast(err.message, 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger OAuth 2.0 PKCE flow (opens simulated OAuth consent modal)
  const initiateOAuth = (provider, isSignUp = false) => {
    setAuthError(null);
    const pending = authService.createOAuthRequest(provider, isSignUp);
    setPendingOAuth(pending);
  };

  // User authorizes on the OAuth 2.0 consent dialog
  const completeOAuth = async (provider, profileOverride = {}) => {
    setIsLoading(true);
    try {
      const isSignUp = pendingOAuth?.isSignUp ?? false;
      const newSession = await authService.completeOAuthFlow(provider, profileOverride, isSignUp);
      setSession(newSession);
      setPendingOAuth(null);
      addToast(`Authenticated via ${provider.toUpperCase()} OAuth 2.0!`, 'success');
      return newSession;
    } catch (err) {
      setAuthError(err.message);
      addToast(`OAuth failed: ${err.message}`, 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // User cancels the OAuth popup
  const cancelOAuth = () => {
    setPendingOAuth(null);
    addToast('OAuth authorization cancelled', 'info');
  };

  // Sign Out
  const signOut = () => {
    authService.clearSession();
    setSession(null);
    addToast('You have been signed out successfully.', 'info');
  };

  // Forgot password
  const requestPasswordReset = async (email) => {
    try {
      const res = await authService.requestPasswordReset(email);
      addToast(res.message, 'success');
      return res;
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  // Update user profile (for onboarding & settings)
  const updateUser = (updatedFields) => {
    if (!session?.user) return;
    const updatedUser = { ...session.user, ...updatedFields };
    const updatedSession = { ...session, user: updatedUser };
    setSession(updatedSession);
    authService.saveSession(updatedSession);
    addToast('Profile updated successfully!', 'success');
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user || null,
        jwt: session?.jwt || null,
        isAuthenticated: !!session?.user,
        isLoading,
        authError,
        clearAuthError: () => setAuthError(null),
        signInWithEmail,
        signUpWithEmail,
        initiateOAuth,
        completeOAuth,
        cancelOAuth,
        pendingOAuth,
        signOut,
        updateUser,
        requestPasswordReset,
        toasts,
        removeToast,
        addToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
