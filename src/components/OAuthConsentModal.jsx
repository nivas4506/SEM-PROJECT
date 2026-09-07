import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleIcon, AppleIcon, GitHubIcon, DiscordIcon, TwitterXIcon } from './Icons';
import { CheckCircle2, X, Key, Loader2, User } from 'lucide-react';

export default function OAuthConsentModal() {
  const { pendingOAuth, completeOAuth, cancelOAuth } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPkceDetails, setShowPkceDetails] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  if (!pendingOAuth) return null;

  const provider = pendingOAuth.provider;

  const providerConfigs = {
    google: {
      name: 'Google',
      authServer: 'accounts.google.com/o/oauth2/v2/auth',
      icon: <GoogleIcon className="w-6 h-6" />,
      themeColor: '#4285F4',
      defaultDomain: 'gmail.com'
    },
    apple: {
      name: 'Apple',
      authServer: 'appleid.apple.com/auth/authorize',
      icon: <AppleIcon className="w-6 h-6" />,
      themeColor: '#ffffff',
      defaultDomain: 'privaterelay.appleid.com'
    },
    github: {
      name: 'GitHub',
      authServer: 'github.com/login/oauth/authorize',
      icon: <GitHubIcon className="w-6 h-6" />,
      themeColor: '#f0f6fc',
      defaultDomain: 'github.com'
    },
    discord: {
      name: 'Discord',
      authServer: 'discord.com/api/oauth2/authorize',
      icon: <DiscordIcon className="w-6 h-6" />,
      themeColor: '#5865F2',
      defaultDomain: 'discord.gg'
    },
    twitter: {
      name: 'X (Twitter)',
      authServer: 'twitter.com/i/oauth2/authorize',
      icon: <TwitterXIcon className="w-6 h-6" />,
      themeColor: '#ffffff',
      defaultDomain: 'x.com'
    }
  };

  const config = providerConfigs[provider] || providerConfigs.google;

  const handleAuthorize = async () => {
    setIsProcessing(true);
    try {
      const email = customEmail.trim() || `user@${config.defaultDomain}`;
      const name = customName.trim() || `${config.name} User`;
      await completeOAuth(provider, { name, email });
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-card">
        {/* Top bar with close button */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {config.icon}
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>
                {config.name} OAuth 2.0 Provider
              </h3>
              <p style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#71717a' }}>
                {config.authServer}
              </p>
            </div>
          </div>
          <button
            onClick={cancelOAuth}
            disabled={isProcessing}
            className="modal-close-btn"
          >
            <X size={18} />
          </button>
        </div>

        {/* Application details */}
        <div style={{ padding: '18px 0 12px 0', textAlign: 'center' }}>
          <img
            src="/logo.png"
            alt="Logo"
            style={{
              width: '48px',
              height: '48px',
              margin: '0 auto 10px auto',
              borderRadius: '12px',
              objectFit: 'contain',
              display: 'block',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)'
            }}
          />
          <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
            {pendingOAuth.isSignUp ? `Sign up with ${config.name}` : `Sign in with ${config.name}`}
          </h4>
          <p style={{ fontSize: '12.5px', color: '#a1a1aa', maxWidth: '340px', margin: '0 auto' }}>
            {pendingOAuth.isSignUp
              ? `Authorize ${config.name} to create your new Social Platform account.`
              : `Authorize ${config.name} to securely sign in to your account.`}
          </p>
        </div>

        {/* Scopes requested */}
        <div style={{
          background: '#18181e',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '12px',
          padding: '12px',
          marginBottom: '14px',
          fontSize: '11.5px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{ fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.05em' }}>
            Requested OAuth 2.0 Scopes (OIDC)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d4d4d8' }}>
            <CheckCircle2 size={14} color="#34d399" style={{ flexShrink: 0 }} />
            <span><strong>openid</strong>: Verify cryptographic identity</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d4d4d8' }}>
            <CheckCircle2 size={14} color="#34d399" style={{ flexShrink: 0 }} />
            <span><strong>profile</strong>: Read basic profile (name, avatar)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d4d4d8' }}>
            <CheckCircle2 size={14} color="#34d399" style={{ flexShrink: 0 }} />
            <span><strong>email</strong>: Access verified email address</span>
          </div>
        </div>

        {/* Account to link */}
        <div style={{
          padding: '12px',
          borderRadius: '12px',
          background: '#18181e',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '16px'
        }}>
          <div style={{ fontSize: '11px', color: '#a1a1aa', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>
            {config.name} Account Details
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              type="text"
              name="scp_oauth_username"
              autoComplete="off"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder={`Your Name (e.g. ${config.name} User)`}
              className="auth-input"
              style={{ height: '38px', fontSize: '13px', background: '#121216' }}
            />
            <input
              type="email"
              name="scp_oauth_useremail"
              autoComplete="off"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              placeholder={`Email (e.g. you@${config.defaultDomain})`}
              className="auth-input"
              style={{ height: '38px', fontSize: '13px', background: '#121216' }}
            />
          </div>
        </div>

        {/* PKCE Info expandable */}
        <div style={{ marginBottom: '16px' }}>
          <button
            type="button"
            onClick={() => setShowPkceDetails(!showPkceDetails)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              fontSize: '11px',
              color: '#71717a',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px 0'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)' }}>
              <Key size={13} /> OAuth 2.0 PKCE Parameters (RFC 7636)
            </span>
            <span style={{ color: '#a1a1aa' }}>{showPkceDetails ? 'Hide' : 'Inspect'}</span>
          </button>

          {showPkceDetails && (
            <div style={{
              marginTop: '8px',
              padding: '10px',
              borderRadius: '10px',
              background: '#0c0c0e',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10.5px',
              color: '#a1a1aa',
              lineHeight: '1.6'
            }} className="animate-fade-in">
              <div><span style={{ color: '#818cf8' }}>client_id:</span> scp-web-client-2026</div>
              <div><span style={{ color: '#818cf8' }}>response_type:</span> code</div>
              <div><span style={{ color: '#818cf8' }}>code_challenge_method:</span> S256</div>
              <div className="truncate"><span style={{ color: '#818cf8' }}>code_challenge:</span> {pendingOAuth.codeChallenge}</div>
              <div className="truncate"><span style={{ color: '#818cf8' }}>state:</span> {pendingOAuth.state}</div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={cancelOAuth}
            disabled={isProcessing}
            style={{
              flex: 1,
              height: '42px',
              borderRadius: '12px',
              background: '#1b1b22',
              border: '1px solid #2e2e3a',
              color: '#a1a1aa',
              fontWeight: 500,
              fontSize: '13.5px',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAuthorize}
            disabled={isProcessing}
            style={{
              flex: 1,
              height: '42px',
              borderRadius: '12px',
              background: '#ffffff',
              color: '#09090b',
              fontWeight: 600,
              fontSize: '13.5px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.15s ease'
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className="spinner" />
                <span>Authorizing...</span>
              </>
            ) : (
              <span>{pendingOAuth.isSignUp ? `Create Account with ${config.name}` : `Sign in with ${config.name}`}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
