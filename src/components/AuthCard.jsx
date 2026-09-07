import React, { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';

/**
 * AuthCard - Recreates the exact box shape, border-radius, background and micro-interactions
 * from the user's screenshot.
 */
export default function AuthCard({ onOpenHelp, initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode); // 'signin' | 'signup'

  return (
    <div className="auth-box-wrapper animate-fade-in">
      {/* Subtle ambient backlight glow behind the box */}
      <div className="auth-box-halo" aria-hidden="true" />

      {/* Main Container Card */}
      <div className="auth-box-card">
        {mode === 'signin' ? (
          <SignIn
            onSwitchToSignUp={() => setMode('signup')}
            onOpenHelp={onOpenHelp}
          />
        ) : (
          <SignUp
            onSwitchToSignIn={() => setMode('signin')}
            onOpenHelp={onOpenHelp}
          />
        )}
      </div>
    </div>
  );
}
