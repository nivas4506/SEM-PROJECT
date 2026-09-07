import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HelpCircle, Mail, CheckCircle2, X, Loader2 } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  const { requestPasswordReset } = useAuth();
  const [resetEmail, setResetEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleReset = async (e) => {
    e.preventDefault();
    if (!resetEmail) return;

    setIsSubmitting(true);
    try {
      const res = await requestPasswordReset(resetEmail);
      setSuccessMessage(res.message);
    } catch {
      // Handled in context toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-card">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HelpCircle size={18} color="#818cf8" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
              Account Help & Recovery
            </h3>
          </div>
          <button
            onClick={() => {
              setSuccessMessage('');
              onClose();
            }}
            className="modal-close-btn"
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '18px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={15} color="#818cf8" /> Reset your password
            </h4>
            <p style={{ fontSize: '12.5px', color: '#a1a1aa', marginBottom: '12px', lineHeight: 1.45 }}>
              Enter your registered email and we'll dispatch a magic sign-in link or reset ticket.
            </p>

            {successMessage ? (
              <div style={{
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: '#6ee7b7',
                fontSize: '12.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0 }} />
                <span>{successMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="auth-input"
                  style={{ height: '46px', fontSize: '14px' }}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    height: '42px',
                    borderRadius: '12px',
                    background: '#22222a',
                    border: '1px solid #33333e',
                    color: '#ffffff',
                    fontWeight: 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="spinner" />
                  ) : (
                    <span>Send Reset Instructions</span>
                  )}
                </button>
              </form>
            )}
          </div>

          <div style={{
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '12px',
            color: '#a1a1aa'
          }}>
            <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '13px' }}>Common Questions</div>
            <div style={{ padding: '10px 12px', borderRadius: '10px', background: '#18181e', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
              <strong style={{ color: '#f4f4f5' }}>OAuth Provider Sign-in:</strong> You can sign in using Google, Apple, or GitHub without creating a separate password.
            </div>
            <div style={{ padding: '10px 12px', borderRadius: '10px', background: '#18181e', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
              <strong style={{ color: '#f4f4f5' }}>Session Expiry:</strong> Access tokens refresh every 15 minutes per OAuth 2.0 architecture standards.
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', paddingTop: '8px' }}>
          <button
            onClick={() => {
              setSuccessMessage('');
              onClose();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#71717a',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Back to Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
