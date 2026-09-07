import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ShinyText from '../reactbits/ShinyText';
import SpotlightCard from '../reactbits/SpotlightCard';
import TiltedCard from '../reactbits/TiltedCard';
import Magnet from '../reactbits/Magnet';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  User, 
  AtSign, 
  FileText, 
  Globe, 
  Users, 
  Lock, 
  Shuffle, 
  Camera,
  CheckCircle2
} from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
];

const TOPIC_PRESETS = [
  { id: 'ai', label: 'AI & Machine Learning', icon: '⚡', desc: 'LLMs, Neural nets & agentic systems' },
  { id: 'design', label: 'Design & UI/UX', icon: '🎨', desc: 'Design systems, 3D, and typography' },
  { id: 'photo', label: 'Photography & Film', icon: '📸', desc: 'Visual storytelling & cinematography' },
  { id: 'gaming', label: 'Gaming & Interactive', icon: '🎮', desc: 'Game dev, indie titles & esports' },
  { id: 'code', label: 'Engineering & Code', icon: '💻', desc: 'Distributed systems & full-stack' },
  { id: 'music', label: 'Music & Audio', icon: '🎵', desc: 'Electronic, vinyl & audio engineering' },
  { id: 'crypto', label: 'Web3 & Cryptography', icon: '🌐', desc: 'Zero-knowledge, DeFi & protocols' },
  { id: 'travel', label: 'Travel & Expeditions', icon: '✈️', desc: 'Global explorations & remote life' },
  { id: 'fitness', label: 'Health & Longevity', icon: '🏃', desc: 'Training, mobility & sports' }
];

export default function OnboardingSetup({ onComplete }) {
  const { user, session, saveSession } = useAuth();

  const [step, setStep] = useState(1); // 1: Identity, 2: Topics, 3: Privacy
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [username, setUsername] = useState(
    user?.email ? user.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '') : 'creator'
  );
  const [avatar, setAvatar] = useState(user?.avatar || AVATAR_PRESETS[0]);
  const [bio, setBio] = useState('Crafting social connections & exploring new ideas.');
  const [selectedTopics, setSelectedTopics] = useState(['ai', 'design', 'code']);
  const [privacyMode, setPrivacyMode] = useState('public'); // 'public' | 'mutual' | 'private'

  const toggleTopic = (id) => {
    if (selectedTopics.includes(id)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter((t) => t !== id));
      }
    } else {
      setSelectedTopics([...selectedTopics, id]);
    }
  };

  const handleFinish = () => {
    const updatedUser = {
      ...user,
      name: displayName.trim() || user?.name || 'Creator',
      username: username.toLowerCase().trim(),
      avatar: avatar,
      bio: bio.trim(),
      interests: selectedTopics,
      privacy: privacyMode,
      onboardingCompleted: true
    };

    // Update in session
    if (session) {
      const updatedSession = { ...session, user: updatedUser };
      localStorage.setItem('scp_auth_session', JSON.stringify(updatedSession));
    }

    if (onComplete) {
      onComplete(updatedUser);
    }
  };

  return (
    <div className="w-full max-w-[560px] mx-auto z-10 animate-fade-in" style={{ padding: '20px 16px' }}>
      {/* Container Box */}
      <div 
        className="auth-box-card"
        style={{
          padding: '32px 30px',
          background: 'rgba(18, 18, 22, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Step Progress Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
          <div>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: '#38bdf8', letterSpacing: '0.06em' }}>
              Step {step} of 3 • Profile Setup
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <ShinyText 
                text={
                  step === 1 ? 'Design Your Identity' :
                  step === 2 ? 'Select Your Interests' :
                  'Privacy & Audience'
                }
                style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              type="button"
              onClick={handleFinish}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                fontSize: '12px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
              title="Enter directly without setting up profile"
            >
              Skip to Platform
            </button>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  style={{
                    width: s === step ? '24px' : '8px',
                    height: '6px',
                    borderRadius: '9999px',
                    background: s === step ? '#38bdf8' : s < step ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* STEP 1: IDENTITY & AVATAR */}
        {step === 1 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* ReactBits TiltedCard 3D Profile Preview */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 10px 0' }}>
              <TiltedCard maxTilt={12} scale={1.03}>
                <div style={{
                  padding: '16px 20px',
                  borderRadius: '22px',
                  background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.12), rgba(99, 102, 241, 0.1))',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  width: '320px',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)'
                }}>
                  <img
                    src={avatar}
                    alt="Selected Avatar"
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      border: '2px solid #38bdf8',
                      objectFit: 'cover'
                    }}
                  />
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
                      {displayName || 'Your Name'}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                      @{username || 'handle'}
                    </p>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', maxWidth: '190px' }} className="truncate">
                      {bio}
                    </p>
                  </div>
                </div>
              </TiltedCard>
            </div>

            {/* Avatar Selector Presets */}
            <div>
              <label style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: 500, display: 'block', marginBottom: '8px' }}>
                Select Avatar
              </label>
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                {AVATAR_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(p)}
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      border: avatar === p ? '2px solid #38bdf8' : '2px solid transparent',
                      padding: '2px',
                      background: 'none',
                      cursor: 'pointer',
                      transform: avatar === p ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 0.15s ease, border-color 0.15s ease',
                      flexShrink: 0
                    }}
                  >
                    <img src={p} alt="Preset" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Display Name Input */}
            <div className="auth-input-group" style={{ marginBottom: '4px' }}>
              <label style={{ fontSize: '12px', color: '#a1a1aa', display: 'block', marginBottom: '6px' }}>Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Alex Morgan"
                className="auth-input"
                style={{ height: '44px', fontSize: '14px' }}
              />
            </div>

            {/* Username Handle */}
            <div className="auth-input-group" style={{ marginBottom: '4px' }}>
              <label style={{ fontSize: '12px', color: '#a1a1aa', display: 'block', marginBottom: '6px' }}>Unique Handle</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }}>@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="handle"
                  className="auth-input"
                  style={{ height: '44px', fontSize: '14px', paddingLeft: '32px' }}
                />
              </div>
            </div>

            {/* Bio Input */}
            <div className="auth-input-group" style={{ marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#a1a1aa', marginBottom: '6px' }}>
                <span>Bio</span>
                <span>{bio.length}/160</span>
              </div>
              <textarea
                value={bio}
                maxLength={160}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell your community what you're passionate about..."
                className="auth-input"
                style={{ height: '70px', padding: '10px 14px', resize: 'none', fontSize: '13px' }}
              />
            </div>
          </div>
        )}

        {/* STEP 2: TOPIC INTERESTS (REACTBITS SPOTLIGHTCARD GRID) */}
        {step === 2 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>
              Pick at least <strong>3 interests</strong> to tailor your personalized algorithm feed:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', maxHeight: '360px', overflowY: 'auto', paddingRight: '4px' }}>
              {TOPIC_PRESETS.map((topic) => {
                const isSelected = selectedTopics.includes(topic.id);
                return (
                  <SpotlightCard
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    spotlightColor={isSelected ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.08)'}
                    borderColor={isSelected ? '#38bdf8' : 'rgba(255, 255, 255, 0.15)'}
                    style={{
                      border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                      background: isSelected ? '#161c28' : '#121217',
                      padding: '14px 12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '22px' }}>{topic.icon}</span>
                      {isSelected && (
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={12} color="#09090b" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', marginTop: '8px', lineHeight: 1.2 }}>
                      {topic.label}
                    </h4>
                    <p style={{ fontSize: '10.5px', color: '#71717a', marginTop: '3px', lineHeight: 1.3 }}>
                      {topic.desc}
                    </p>
                  </SpotlightCard>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#94a3b8', paddingTop: '6px' }}>
              <span>Selected: <strong style={{ color: '#38bdf8' }}>{selectedTopics.length} topics</strong></span>
              {selectedTopics.length < 3 && (
                <span style={{ color: '#f87171' }}>Select at least 3 to continue</span>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: PRIVACY & AUDIENCE PREFERENCES */}
        {step === 3 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>
              Control your visibility and who can send you direct connection requests:
            </p>

            {[
              {
                id: 'public',
                title: 'Open Community (Recommended)',
                icon: <Globe size={18} color="#38bdf8" />,
                desc: 'Your profile and public posts are discoverable. Anyone can follow and request connection.'
              },
              {
                id: 'mutual',
                title: 'Friends & Mutuals Only',
                icon: <Users size={18} color="#a855f7" />,
                desc: 'Only connections and people with mutual friends can see your activity and feed updates.'
              },
              {
                id: 'private',
                title: 'Private Safe Space',
                icon: <Lock size={18} color="#f59e0b" />,
                desc: 'Strict privacy. All follow requests require manual confirmation. Search visibility is limited.'
              }
            ].map((p) => {
              const active = privacyMode === p.id;
              return (
                <SpotlightCard
                  key={p.id}
                  onClick={() => setPrivacyMode(p.id)}
                  spotlightColor={active ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.06)'}
                  style={{
                    padding: '16px',
                    border: active ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: active ? '#151b26' : '#121217',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px'
                  }}
                >
                  <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)' }}>
                    {p.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>{p.title}</h4>
                      {active && <CheckCircle2 size={16} color="#38bdf8" />}
                    </div>
                    <p style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '2px', lineHeight: 1.4 }}>
                      {p.desc}
                    </p>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        )}

        {/* Action Buttons with ReactBits Magnet */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '26px' }}>
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              style={{
                height: '46px',
                padding: '0 20px',
                borderRadius: '13px',
                background: '#1b1b22',
                border: '1px solid #2e2e3a',
                color: '#a1a1aa',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Back
            </button>
          )}

          <div style={{ flex: 1 }}>
            <button
              type="button"
              onClick={() => {
                if (step < 3) {
                  if (step === 2 && selectedTopics.length < 3) return;
                  setStep(step + 1);
                } else {
                  handleFinish();
                }
              }}
              disabled={step === 2 && selectedTopics.length < 3}
              className="auth-btn-continue"
              style={{
                height: '46px',
                width: '100%',
                background: '#ffffff',
                color: '#09090b',
                fontWeight: 600,
                fontSize: '14.5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 20px rgba(255, 255, 255, 0.15)',
                cursor: 'pointer',
                transform: 'none'
              }}
            >
              <span>{step === 3 ? 'Launch My Profile' : 'Continue'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
