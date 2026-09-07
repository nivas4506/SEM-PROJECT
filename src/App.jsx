import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import SilkGradientBackground from './components/SilkGradientBackground';
import AuthCard from './components/AuthCard';
import OnboardingSetup from './components/onboarding/OnboardingSetup';
import MainShell from './components/shell/MainShell';
import OAuthConsentModal from './components/OAuthConsentModal';
import HelpModal from './components/HelpModal';
import ToastContainer from './components/Toast';
import { Lock } from 'lucide-react';
import logoImg from './assets/logo.png';

function MainApp() {
  const { isAuthenticated, user, updateUser } = useAuth();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div className="app-shell" style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {/* Exact Silk Cyan/Ocean Blue Fluid Wave Gradient Background */}
      <SilkGradientBackground />

      {/* Top Header */}
      {!isAuthenticated && (
        <header className="auth-header" style={{ position: 'relative', zIndex: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={logoImg}
              alt="Social Connectivity Platform Logo"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                objectFit: 'contain',
                display: 'block',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            />
            <span className="auth-brand-name" style={{ fontSize: '16px', fontWeight: 700 }}>
              Social Connectivity Platform
            </span>
          </div>

          <div>
            <button
              onClick={() => setIsHelpOpen(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#e2e8f0',
                fontSize: '12px',
                padding: '6px 14px',
                borderRadius: '9999px',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.15s ease'
              }}
            >
              Need Help?
            </button>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        display: 'flex',
        alignItems: isAuthenticated ? 'flex-start' : 'center',
        justifyContent: 'center',
        padding: isAuthenticated ? '0' : '30px 20px',
        maxWidth: isAuthenticated ? '100%' : '1200px',
        width: '100%',
        margin: '0 auto'
      }}>
        {!isAuthenticated ? (
          <AuthCard onOpenHelp={() => setIsHelpOpen(true)} />
        ) : !user?.onboardingCompleted ? (
          <OnboardingSetup onComplete={(updatedProfile) => updateUser(updatedProfile)} />
        ) : (
          <MainShell />
        )}
      </main>

      {/* Footer */}
      {!isAuthenticated && (
        <footer style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '20px 16px',
          fontSize: '12px',
          color: '#94a3b8',
          background: 'linear-gradient(to top, rgba(3, 7, 18, 0.4), transparent)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
            <Lock size={13} color="#38bdf8" />
            <span style={{ color: '#e2e8f0' }}>Stateless Token-Based Auth • RS256 JWT • PKCE Enabled</span>
          </div>
          <p style={{ fontSize: '11px', color: '#64748b' }}>
            System Design Document Step 1 compliant • Oceanic Silk Mesh Gradient
          </p>
        </footer>
      )}

      {/* Global Modals & Notifications */}
      <OAuthConsentModal />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
