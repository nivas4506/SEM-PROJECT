import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleIcon, AppleIcon, GitHubIcon, DiscordIcon, TwitterXIcon } from './Icons';
import { ShieldCheck, LogOut, Copy, Check, User, Clock } from 'lucide-react';

export default function UserProfileView() {
  const { user, jwt, session, signOut, addToast } = useAuth();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'token'
  const [timeLeft, setTimeLeft] = useState(900);

  useEffect(() => {
    const interval = setInterval(() => {
      if (jwt?.decoded?.exp) {
        const remaining = Math.max(0, jwt.decoded.exp - Math.floor(Date.now() / 1000));
        setTimeLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [jwt]);

  const copyToken = () => {
    if (jwt?.accessToken) {
      navigator.clipboard.writeText(jwt.accessToken);
      setCopied(true);
      addToast('JWT Access Token copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getProviderIcon = (prov) => {
    switch (prov) {
      case 'google':
        return <GoogleIcon className="w-5 h-5" />;
      case 'apple':
        return <AppleIcon className="w-5 h-5 text-white" />;
      case 'github':
        return <GitHubIcon className="w-5 h-5 text-white" />;
      case 'discord':
        return <DiscordIcon className="w-5 h-5" />;
      case 'twitter':
        return <TwitterXIcon className="w-5 h-5 text-white" />;
      default:
        return <User className="w-5 h-5 text-indigo-400" />;
    }
  };

  const formatMinutes = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="auth-box-wrapper animate-fade-in" style={{ maxWidth: '460px' }}>
      <div className="auth-box-halo" aria-hidden="true" />

      <div className="dashboard-card">
        {/* Header Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399' }} />
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#34d399', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Authenticated Session
            </span>
          </div>
          <button
            onClick={signOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: '#a1a1aa',
              padding: '4px 10px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <LogOut size={13} />
            <span>Sign out</span>
          </button>
        </div>

        {/* User Card */}
        <div style={{ padding: '24px 0 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ position: 'relative', marginBottom: '14px' }}>
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={user?.name}
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                border: '2px solid rgba(99, 102, 241, 0.5)',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(user?.email || 'user');
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-4px',
              padding: '6px',
              borderRadius: '50%',
              background: '#18181c',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {getProviderIcon(user?.provider)}
            </div>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
            {user?.name}
          </h2>
          <p style={{ fontSize: '13px', color: '#a1a1aa', fontFamily: 'var(--font-mono)', marginBottom: '14px' }}>
            {user?.email}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span className="badge-tag badge-indigo">
              <ShieldCheck size={14} />
              {user?.role || 'standard_user'}
            </span>
            <span className="badge-tag">
              {getProviderIcon(user?.provider)}
              <span style={{ textTransform: 'capitalize' }}>{user?.provider || 'Email'} OAuth</span>
            </span>
          </div>
        </div>

        {/* Tab Toggle */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '16px', fontSize: '12px' }}>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              flex: 1,
              paddingBottom: '10px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'profile' ? '2px solid #ffffff' : '2px solid transparent',
              color: activeTab === 'profile' ? '#ffffff' : '#71717a',
              fontWeight: activeTab === 'profile' ? 600 : 500,
              cursor: 'pointer'
            }}
          >
            Session Info
          </button>
          <button
            onClick={() => setActiveTab('token')}
            style={{
              flex: 1,
              paddingBottom: '10px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'token' ? '2px solid #ffffff' : '2px solid transparent',
              color: activeTab === 'token' ? '#ffffff' : '#71717a',
              fontWeight: activeTab === 'token' ? 600 : 500,
              cursor: 'pointer'
            }}
          >
            OAuth 2.0 JWT Inspector
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            <div style={{ padding: '12px 14px', borderRadius: '12px', background: '#18181e', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="#818cf8" /> Token Expiry (15m validity)
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#ffffff', fontWeight: 600 }}>
                {formatMinutes(timeLeft)} remaining
              </span>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: '12px', background: '#18181e', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#a1a1aa' }}>Auth Method</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
                {session?.authMethod || 'oauth2:bearer'}
              </span>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: '12px', background: '#18181e', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#a1a1aa' }}>Session Storage</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#34d399' }}>localStorage: active</span>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: '12px', background: '#18181e', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#a1a1aa' }}>Bearer Access Token</span>
                <button
                  onClick={copyToken}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '11px',
                    color: '#818cf8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#71717a', wordBreak: 'break-all', maxHeight: '48px', overflowY: 'auto' }}>
                {jwt?.accessToken}
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: '#0e0e11', border: '1px solid rgba(255, 255, 255, 0.05)', color: '#a1a1aa' }}>
              <div style={{ color: '#818cf8', fontWeight: 600, marginBottom: '4px' }}>// RS256 Decoded Header</div>
              <pre style={{ color: '#ffffff', fontSize: '10px', overflowX: 'auto', margin: 0 }}>
{JSON.stringify({ alg: 'RS256', typ: 'JWT', kid: 'scp-auth-key-2026-v1' }, null, 2)}
              </pre>
            </div>

            <div style={{ padding: '12px', borderRadius: '12px', background: '#0e0e11', border: '1px solid rgba(255, 255, 255, 0.05)', color: '#a1a1aa' }}>
              <div style={{ color: '#34d399', fontWeight: 600, marginBottom: '4px' }}>// JWT Claims (OIDC / SDD Step 1)</div>
              <pre style={{ color: '#ffffff', fontSize: '10px', overflowX: 'auto', maxHeight: '140px', margin: 0 }}>
{JSON.stringify(jwt?.decoded || {}, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Primary Sign Out Action */}
        <div style={{ marginTop: '22px' }}>
          <button
            onClick={signOut}
            className="auth-btn-continue"
          >
            <LogOut size={16} />
            <span>Sign Out & Return to Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}
