import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleIcon, AppleIcon, GitHubIcon, DiscordIcon, TwitterXIcon } from './Icons';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function SignUp({ onSwitchToSignIn, onOpenHelp }) {
  const { signUpWithEmail, initiateOAuth, isLoading, authError, clearAuthError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showMoreProviders, setShowMoreProviders] = useState(false);

  // Password strength calculation
  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const strength = calculateStrength(password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAuthError();

    if (!agreedToTerms) {
      alert('Please agree to the Terms of Service to create an account.');
      return;
    }

    setSubmitting(true);
    try {
      await signUpWithEmail({ name, email, password });
    } catch {
      // Handled in context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Compact Title & Switch link */}
      <div style={{ marginBottom: '18px' }}>
        <h1 className="auth-heading" style={{ fontSize: '28px', marginBottom: '4px' }}>
          Sign up
        </h1>
        <p className="auth-subheading" style={{ fontSize: '13.5px', marginBottom: '0' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="auth-subheading-link"
          >
            Sign in
          </button>
        </p>
      </div>

      {authError && (
        <div className="auth-error-banner" style={{ padding: '8px 12px', marginBottom: '12px', fontSize: '12px' }}>
          <span>{authError}</span>
          <button
            onClick={clearAuthError}
            style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontWeight: 700 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* OAuth 2.0 Quick Sign Up (Compact 3-column row) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
        <button
          id="signup-oauth-google-btn"
          type="button"
          onClick={() => initiateOAuth('google', true)}
          disabled={isLoading}
          className="auth-btn-oauth"
          style={{ height: '42px', padding: '0 8px', gap: '6px', fontSize: '13px' }}
          title="Sign up with Google"
        >
          <GoogleIcon className="w-4 h-4" />
          <span>Google</span>
        </button>

        <button
          id="signup-oauth-apple-btn"
          type="button"
          onClick={() => initiateOAuth('apple', true)}
          disabled={isLoading}
          className="auth-btn-oauth"
          style={{ height: '42px', padding: '0 8px', gap: '6px', fontSize: '13px' }}
          title="Sign up with Apple"
        >
          <AppleIcon className="w-4 h-4" />
          <span>Apple</span>
        </button>

        <button
          id="signup-oauth-github-btn"
          type="button"
          onClick={() => initiateOAuth('github', true)}
          disabled={isLoading}
          className="auth-btn-oauth"
          style={{ height: '42px', padding: '0 8px', gap: '6px', fontSize: '13px' }}
          title="Sign up with GitHub"
        >
          <GitHubIcon className="w-4 h-4" />
          <span>GitHub</span>
        </button>
      </div>

      {/* Expandable Discord & Twitter in compact grid */}
      {showMoreProviders && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '12px' }}>
          <button
            id="signup-oauth-discord-btn"
            type="button"
            onClick={() => initiateOAuth('discord', true)}
            disabled={isLoading}
            className="auth-btn-oauth"
            style={{ height: '40px', padding: '0 8px', gap: '6px', fontSize: '13px' }}
          >
            <DiscordIcon className="w-4 h-4" />
            <span>Discord</span>
          </button>

          <button
            id="signup-oauth-twitter-btn"
            type="button"
            onClick={() => initiateOAuth('twitter', true)}
            disabled={isLoading}
            className="auth-btn-oauth"
            style={{ height: '40px', padding: '0 8px', gap: '6px', fontSize: '13px' }}
          >
            <TwitterXIcon className="w-4 h-4" />
            <span>X</span>
          </button>
        </div>
      )}

      {/* Compact toggle for more providers */}
      <div style={{ textAlign: 'center', marginBottom: '14px' }}>
        <button
          type="button"
          onClick={() => setShowMoreProviders(!showMoreProviders)}
          className="auth-view-more-btn"
          style={{ fontSize: '11.5px', padding: '0 4px', color: '#71717a' }}
        >
          {showMoreProviders ? 'Fewer providers' : 'More providers (Discord, X)'}
        </button>
      </div>

      {/* Horizontal Divider */}
      <div className="auth-divider" style={{ margin: '12px 0 14px 0' }}>
        <span className="auth-divider-text" style={{ fontSize: '12px', padding: '0 10px' }}>
          or with email
        </span>
      </div>

      {/* Form with compact inputs */}
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="auth-input-group" style={{ marginBottom: '10px' }}>
          <input
            id="signup-name"
            name="scp_reg_name"
            type="text"
            required
            autoComplete="off"
            spellCheck="false"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="auth-input"
            style={{ height: '44px', fontSize: '14px' }}
          />
        </div>

        <div className="auth-input-group" style={{ marginBottom: '10px' }}>
          <input
            id="signup-email"
            name="scp_reg_email"
            type="email"
            required
            autoComplete="off"
            spellCheck="false"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="auth-input"
            style={{ height: '44px', fontSize: '14px' }}
          />
        </div>

        <div className="auth-input-group" style={{ marginBottom: '8px' }}>
          <div style={{ position: 'relative' }}>
            <input
              id="signup-password"
              name="scp_reg_secret"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create password"
              className="auth-input"
              style={{ height: '44px', fontSize: '14px', paddingRight: '42px' }}
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
                padding: '2px',
                display: 'flex',
                alignItems: 'center'
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Slim Password Strength Bar */}
          {password.length > 0 && (
            <div className="animate-fade-in" style={{ marginTop: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#a1a1aa', marginBottom: '3px' }}>
                <span>Strength</span>
                <span style={{ color: strengthColors[Math.max(0, strength - 1)] || '#71717a', fontWeight: 600 }}>
                  {strengthLabels[Math.max(0, strength - 1)] || 'Too short'}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', height: '3px' }}>
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    style={{
                      borderRadius: '9999px',
                      backgroundColor: idx < strength ? strengthColors[strength - 1] : 'rgba(255,255,255,0.08)',
                      transition: 'background-color 0.2s ease'
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Compact Terms checkbox */}
        <div className="terms-row" style={{ margin: '8px 0 12px 0', fontSize: '11.5px', gap: '8px' }}>
          <input
            id="terms-checkbox"
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            style={{ marginTop: '2px' }}
          />
          <label htmlFor="terms-checkbox" style={{ cursor: 'pointer', lineHeight: 1.35 }}>
            I agree to the <span style={{ color: '#ffffff', textDecoration: 'underline' }}>Terms</span> and <span style={{ color: '#ffffff', textDecoration: 'underline' }}>Privacy Policy</span>.
          </label>
        </div>

        {/* Primary Continue Button */}
        <button
          id="signup-continue-btn"
          type="submit"
          disabled={submitting || isLoading || !agreedToTerms}
          className="auth-btn-continue"
          style={{ height: '44px', fontSize: '14.5px', marginTop: '4px' }}
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="spinner" />
              <span>Creating account...</span>
            </>
          ) : (
            <span>Create account</span>
          )}
        </button>
      </form>

      {/* Footer link */}
      <div className="auth-card-footer" style={{ marginTop: '16px', paddingTop: '12px', fontSize: '12px' }}>
        Need assistance?{' '}
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
