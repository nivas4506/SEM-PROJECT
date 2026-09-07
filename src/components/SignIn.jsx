import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleIcon, AppleIcon, GitHubIcon, DiscordIcon, TwitterXIcon } from './Icons';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function SignIn({ onSwitchToSignUp, onOpenHelp }) {
  const { signInWithEmail, initiateOAuth, isLoading, authError, clearAuthError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showMoreProviders, setShowMoreProviders] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAuthError();

    if (!email) return;

    // First click reveals password input
    if (!showPasswordField) {
      setShowPasswordField(true);
      return;
    }

    if (!password) {
      return;
    }

    setSubmitting(true);
    try {
      await signInWithEmail(email, password);
    } catch {
      // Error handled in AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Title & Switch link matching screenshot */}
      <div style={{ marginBottom: '20px' }}>
        <h1 className="auth-heading" style={{ fontSize: '28px', marginBottom: '4px' }}>
          Sign in
        </h1>
        <p className="auth-subheading" style={{ fontSize: '13.5px', marginBottom: '0' }}>
          New user?{' '}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="auth-subheading-link"
          >
            Create an account
          </button>
        </p>
      </div>

      {authError && (
        <div className="auth-error-banner">
          <span>{authError}</span>
          <button
            onClick={clearAuthError}
            style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontWeight: 700 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Email Form */}
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="auth-input-group">
          <input
            id="signin-email"
            name="scp_auth_email"
            type="email"
            required
            autoFocus
            autoComplete="off"
            spellCheck="false"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="auth-input"
          />
        </div>

        {/* Dynamic password entry */}
        {showPasswordField && (
          <div className="animate-fade-in" style={{ marginBottom: '14px' }}>
            <div style={{ position: 'relative' }}>
              <input
                id="signin-password"
                name="scp_auth_secret"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="auth-input"
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#71717a',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button
                type="button"
                onClick={onOpenHelp}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#a1a1aa',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Forgot password?
              </button>
            </div>
          </div>
        )}

        {/* Primary Continue Button */}
        <button
          id="signin-continue-btn"
          type="submit"
          disabled={submitting || isLoading}
          className="auth-btn-continue"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="spinner" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Continue</span>
          )}
        </button>
      </form>

      {/* Horizontal 'Or' Divider matching screenshot */}
      <div className="auth-divider">
        <span className="auth-divider-text">Or</span>
      </div>

      {/* OAuth 2.0 Provider Buttons matching screenshot */}
      <div className="auth-oauth-group">
        {/* Google OAuth */}
        <button
          id="oauth-google-btn"
          type="button"
          onClick={() => initiateOAuth('google', false)}
          disabled={isLoading}
          className="auth-btn-oauth"
        >
          <GoogleIcon className="w-5 h-5" />
          <span>Sign in with Google</span>
        </button>

        {/* Apple OAuth */}
        <button
          id="oauth-apple-btn"
          type="button"
          onClick={() => initiateOAuth('apple', false)}
          disabled={isLoading}
          className="auth-btn-oauth"
        >
          <AppleIcon className="w-5 h-5" />
          <span>Sign in with Apple</span>
        </button>

        {/* GitHub OAuth */}
        <button
          id="oauth-github-btn"
          type="button"
          onClick={() => initiateOAuth('github', false)}
          disabled={isLoading}
          className="auth-btn-oauth"
        >
          <GitHubIcon className="w-5 h-5" />
          <span>Sign in with GitHub</span>
        </button>

        {/* Expandable More Providers */}
        {showMoreProviders && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              id="oauth-discord-btn"
              type="button"
              onClick={() => initiateOAuth('discord', false)}
              disabled={isLoading}
              className="auth-btn-oauth"
            >
              <DiscordIcon className="w-5 h-5" />
              <span>Sign in with Discord</span>
            </button>

            <button
              id="oauth-twitter-btn"
              type="button"
              onClick={() => initiateOAuth('twitter', false)}
              disabled={isLoading}
              className="auth-btn-oauth"
            >
              <TwitterXIcon className="w-5 h-5" />
              <span>Sign in with X</span>
            </button>
          </div>
        )}
      </div>

      {/* 'View more' toggle link matching screenshot */}
      <div className="auth-view-more">
        <button
          type="button"
          onClick={() => setShowMoreProviders(!showMoreProviders)}
          className="auth-view-more-btn"
        >
          {showMoreProviders ? 'View less' : 'View more'}
        </button>
      </div>

      {/* Footer link 'Can't sign in? Get help' matching screenshot */}
      <div className="auth-card-footer">
        Can't sign in?{' '}
        <button
          type="button"
          onClick={onOpenHelp}
        >
          Get help
        </button>
      </div>
    </div>
  );
}
