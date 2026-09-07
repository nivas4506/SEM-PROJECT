import React from 'react';

/**
 * LeftNavRail - Vertical Left Navigation Rail
 * Matches the user-provided snippet (Home, Reels, Messages with badge, Search, Heart, Create +, Insights, Profile, Menu).
 * Replaces the bottom Dock completely.
 */
export default function LeftNavRail({
  activeTab,
  onSelectTab,
  user,
  unreadMessages = 5,
  onCreatePost,
  onOpenMenu
}) {
  return (
    <aside
      aria-label="Sidebar Navigation"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '74px',
        background: 'rgba(10, 10, 14, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 0 24px 0',
        zIndex: 45,
        userSelect: 'none'
      }}
    >
      {/* Top Section: Logo + Main Navigation Icons */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px', width: '100%' }}>
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => onSelectTab('feed')}
          title="Social Connectivity Platform"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '12px',
            transition: 'transform 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <img
            src="/logo.png"
            alt="Platform Logo"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              objectFit: 'contain',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.4)'
            }}
          />
        </button>

        {/* Separator */}
        <div style={{ width: '32px', height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />

        {/* 1. Home */}
        <NavRailButton
          active={activeTab === 'feed'}
          onClick={() => onSelectTab('feed')}
          title="Home"
        >
          <svg width="25" height="25" viewBox="0 0 24 24" fill={activeTab === 'feed' ? '#ffffff' : 'none'} stroke="#ffffff" strokeWidth={activeTab === 'feed' ? '0' : '2'} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2.1l9 7.2v10.7a2 2 0 0 1-2 2h-4a1 1 0 0 1-1-1v-5a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v5a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V9.3l9-7.2z" />
          </svg>
        </NavRailButton>

        {/* 2. Reels / Videos */}
        <NavRailButton
          active={activeTab === 'explore'}
          onClick={() => onSelectTab('explore')}
          title="Reels & Discovery"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={activeTab === 'explore' ? '#38bdf8' : '#ffffff'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="18" rx="6" />
            <polygon points="10 8 16 12 10 16 10 8" fill={activeTab === 'explore' ? '#38bdf8' : 'none'} stroke={activeTab === 'explore' ? '#38bdf8' : '#ffffff'} strokeWidth="1.5" />
          </svg>
        </NavRailButton>

        {/* 3. Messages with Red Badge */}
        <NavRailButton
          active={activeTab === 'messages'}
          onClick={() => onSelectTab('messages')}
          title="Messages"
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={activeTab === 'messages' ? '#38bdf8' : '#ffffff'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2L10 13.5" />
              <path d="M21.5 2L15 22L10 13.5L1.5 9.5L21.5 2Z" />
            </svg>
            {unreadMessages > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-7px',
                  right: '-9px',
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 700,
                  minWidth: '16px',
                  height: '16px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 3px',
                  border: '1.5px solid #0a0a0e',
                  boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)'
                }}
              >
                {unreadMessages}
              </span>
            )}
          </div>
        </NavRailButton>

        {/* 4. Search */}
        <NavRailButton
          active={activeTab === 'search'}
          onClick={() => onSelectTab('search')}
          title="Search"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={activeTab === 'search' ? '#38bdf8' : '#ffffff'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7.5" />
            <line x1="21" y1="21" x2="16.5" y2="16.5" />
          </svg>
        </NavRailButton>

        {/* 5. Notifications / Heart */}
        <NavRailButton
          active={activeTab === 'notifications'}
          onClick={() => onSelectTab('notifications')}
          title="Notifications & Activity"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'notifications' ? '#ef4444' : 'none'} stroke={activeTab === 'notifications' ? '#ef4444' : '#ffffff'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </NavRailButton>

        {/* 6. Create + */}
        <NavRailButton
          onClick={onCreatePost}
          title="Create New Post"
          highlight
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </NavRailButton>

        {/* 7. Insights / Stats */}
        <NavRailButton
          active={activeTab === 'insights' || activeTab === 'events'}
          onClick={() => onSelectTab('events')}
          title="Insights & Events"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={activeTab === 'events' ? '#38bdf8' : '#ffffff'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <line x1="8" y1="17" x2="8" y2="13" />
            <line x1="12" y1="17" x2="12" y2="9" />
            <line x1="16" y1="17" x2="16" y2="11" />
          </svg>
        </NavRailButton>

        {/* 8. Profile Avatar */}
        <button
          type="button"
          onClick={() => onSelectTab('profile')}
          title="My Profile"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px',
            borderRadius: '50%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
            alt="Profile"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: activeTab === 'profile' ? '2px solid #38bdf8' : '2px solid rgba(255, 255, 255, 0.4)',
              boxShadow: activeTab === 'profile' ? '0 0 10px rgba(56, 189, 248, 0.5)' : 'none'
            }}
          />
        </button>
      </div>

      {/* Bottom Section: Hamburger Menu */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <button
          type="button"
          onClick={onOpenMenu}
          title="More Options"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'none',
            border: 'none',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease, transform 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        </button>
      </div>
    </aside>
  );
}

function NavRailButton({ active = false, onClick, title, children, highlight = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        position: 'relative',
        width: '44px',
        height: '44px',
        borderRadius: '14px',
        background: active
          ? 'rgba(56, 189, 248, 0.12)'
          : highlight
          ? 'rgba(255, 255, 255, 0.06)'
          : 'transparent',
        border: active ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
        color: active ? '#38bdf8' : '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.transform = 'scale(1.08)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = highlight ? 'rgba(255, 255, 255, 0.06)' : 'transparent';
          e.currentTarget.style.transform = 'scale(1)';
        }
      }}
    >
      {children}
    </button>
  );
}
