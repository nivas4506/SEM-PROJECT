import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import LeftNavRail from '../navigation/LeftNavRail';
import SpotlightCard from '../reactbits/SpotlightCard';
import ShinyText from '../reactbits/ShinyText';
import TiltedCard from '../reactbits/TiltedCard';
import Magnet from '../reactbits/Magnet';
import { 
  Home, 
  Compass, 
  MessageSquare, 
  Calendar, 
  User as UserIcon, 
  Heart, 
  MessageCircle, 
  Share2, 
  Image as ImageIcon, 
  Send, 
  ShieldCheck, 
  LogOut, 
  Search, 
  Check, 
  MapPin, 
  Clock, 
  Users,
  Sparkles,
  Settings,
  HelpCircle,
  X
} from 'lucide-react';

export default function MainShell() {
  const { user, signOut, addToast } = useAuth();
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'explore' | 'messages' | 'search' | 'notifications' | 'events' | 'profile'
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Post composer state
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([
    {
      id: 'p1',
      author: {
        name: 'Elena Rostova',
        handle: 'elena_r',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: 'verified_user'
      },
      content: 'Just launched the beta of our neural design canvas! 🚀 Built with WebGL shaders and real-time collaborative websockets. Feedback is welcome!',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      likes: 42,
      comments: 7,
      liked: false,
      timestamp: '25m ago',
      tags: ['AI & Machine Learning', 'Design & UI/UX']
    },
    {
      id: 'p2',
      author: {
        name: 'Kaito Tanaka',
        handle: 'kaito_dev',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        role: 'standard_user'
      },
      content: 'Morning photography walk in Kyoto. The atmospheric fog through the bamboo forest is unbelievable today.',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
      likes: 89,
      comments: 14,
      liked: true,
      timestamp: '2h ago',
      tags: ['Photography & Film', 'Travel & Expeditions']
    }
  ]);

  // Suggested connections
  const [suggestedUsers, setSuggestedUsers] = useState([
    {
      id: 's1',
      name: 'Dr. Sophia Vance',
      handle: 'sophia_ai',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      role: 'AI Researcher',
      mutuals: 4,
      followed: false
    },
    {
      id: 's2',
      name: 'Mateo Rossi',
      handle: 'mateorossi',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      role: 'Systems Architect',
      mutuals: 2,
      followed: false
    }
  ]);

  // Messages state
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Dr. Sophia Vance', text: 'Hey, I reviewed your architecture proposal for the fanout feed!', time: '10:14 AM', incoming: true },
    { id: 2, sender: 'You', text: 'Thanks Sophia! We are adopting the Fanout-on-Write hybrid model.', time: '10:18 AM', incoming: false }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Events state
  const [events, setEvents] = useState([
    {
      id: 'e1',
      title: 'Global Social Architecture Summit 2026',
      date: 'Sept 24, 2026 • 6:00 PM UTC',
      location: 'Virtual Auditorium & London Studio',
      attendees: 342,
      rsvpd: false,
      tag: 'Engineering'
    },
    {
      id: 'e2',
      title: 'Interactive UI & ReactBits Showcase',
      date: 'Oct 02, 2026 • 7:30 PM UTC',
      location: 'San Francisco, CA & Stream',
      attendees: 512,
      rsvpd: true,
      tag: 'Design'
    }
  ]);

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    const newPost = {
      id: 'p_' + Date.now(),
      author: {
        name: user?.name || 'Creator',
        handle: user?.username || 'creator',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        role: user?.role || 'standard_user'
      },
      content: postContent,
      likes: 0,
      comments: 0,
      liked: false,
      timestamp: 'Just now',
      tags: user?.interests ? user.interests.slice(0, 2) : ['General']
    };

    setPosts([newPost, ...posts]);
    setPostContent('');
    addToast('Post published to your feed!', 'success');
  };

  const toggleLike = (postId) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          liked: !p.liked,
          likes: p.liked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
  };

  const toggleFollow = (userId) => {
    setSuggestedUsers(suggestedUsers.map(u => {
      if (u.id === userId) {
        const nextState = !u.followed;
        addToast(nextState ? `Connected with @${u.handle}` : `Removed connection with @${u.handle}`, 'info');
        return { ...u, followed: nextState };
      }
      return u;
    }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages([...messages, {
      id: Date.now(),
      sender: 'You',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      incoming: false
    }]);
    setChatInput('');
  };

  const toggleRsvp = (eventId) => {
    setEvents(events.map(ev => {
      if (ev.id === eventId) {
        const next = !ev.rsvpd;
        addToast(next ? `RSVP confirmed for ${ev.title}` : `RSVP cancelled`, 'info');
        return {
          ...ev,
          rsvpd: next,
          attendees: next ? ev.attendees + 1 : ev.attendees - 1
        };
      }
      return ev;
    }));
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', minHeight: '100vh', position: 'relative' }}>
      {/* 1. Left Navigation Rail (Snippet Component) */}
      <LeftNavRail
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        unreadMessages={5}
        onCreatePost={() => {
          setActiveTab('feed');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const composer = document.getElementById('post-composer-input');
          if (composer) composer.focus();
        }}
        onOpenMenu={() => setIsMenuOpen(true)}
      />

      {/* 2. Main Scrollable Content Area - Centered */}
      <div 
        className="animate-fade-in main-content-centered" 
        style={{ 
          width: '100%', 
          maxWidth: '1080px', 
          margin: '0 auto',
          padding: '20px 24px 60px 24px' 
        }}
      >
        {/* Top Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          borderRadius: '20px',
          background: 'rgba(18, 18, 22, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(16px)',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShinyText text="Social Connectivity Platform" style={{ fontSize: '16px', fontWeight: 700 }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'right' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>{user?.name}</div>
                <div style={{ fontSize: '11px', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>@{user?.username || 'user'}</div>
              </div>
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt={user?.name}
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1.5px solid #38bdf8', objectFit: 'cover' }}
              />
            </div>
            <button
              onClick={signOut}
              title="Sign Out"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#a1a1aa',
                padding: '8px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>

      {/* VIEW: HOME FEED */}
      {activeTab === 'feed' && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
          {/* Main Feed Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Post Composer Card using ReactBits SpotlightCard */}
            <SpotlightCard
              spotlightColor="rgba(56, 189, 248, 0.12)"
              borderColor="rgba(56, 189, 248, 0.3)"
              style={{ padding: '20px', background: 'rgba(18, 18, 24, 0.85)', backdropFilter: 'blur(16px)' }}
            >
              <form onSubmit={handleCreatePost}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                    alt="Author"
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <textarea
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder={`What's inspiring you today, ${user?.name ? user.name.split(' ')[0] : 'friend'}?`}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: '#f4f4f5',
                        fontSize: '14.5px',
                        resize: 'none',
                        height: '60px',
                        fontFamily: 'inherit',
                        lineHeight: 1.5
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
                    >
                      <ImageIcon size={16} />
                      <span>Photo / Video</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!postContent.trim()}
                    className="auth-btn-continue"
                    style={{ height: '36px', padding: '0 16px', fontSize: '13px', borderRadius: '10px', marginTop: 0 }}
                  >
                    <span>Share Post</span>
                    <Send size={13} />
                  </button>
                </div>
              </form>
            </SpotlightCard>

            {/* Posts Stream */}
            {posts.map((post) => (
              <SpotlightCard
                key={post.id}
                spotlightColor="rgba(56, 189, 248, 0.1)"
                style={{ padding: '22px', background: 'rgba(18, 18, 24, 0.85)', backdropFilter: 'blur(16px)' }}
              >
                {/* Author row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '14.5px', fontWeight: 700, color: '#ffffff' }}>{post.author.name}</span>
                      {post.author.role === 'verified_user' && (
                        <ShieldCheck size={14} color="#38bdf8" />
                      )}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#71717a' }}>
                      @{post.author.handle} • {post.timestamp}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <p style={{ fontSize: '14.5px', color: '#f4f4f5', lineHeight: 1.6, marginBottom: post.image ? '14px' : '10px' }}>
                  {post.content}
                </p>

                {/* Optional Media */}
                {post.image && (
                  <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '14px', maxHeight: '340px' }}>
                    <img src={post.image} alt="Attachment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                {/* Interaction Footer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '13px', color: '#94a3b8' }}>
                  <button
                    onClick={() => toggleLike(post.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: post.liked ? '#f43f5e' : '#94a3b8' }}
                  >
                    <Heart size={16} fill={post.liked ? '#f43f5e' : 'none'} />
                    <span>{post.likes}</span>
                  </button>

                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
                    <MessageCircle size={16} />
                    <span>{post.comments}</span>
                  </button>

                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
                    <Share2 size={16} />
                    <span>Share</span>
                  </button>
                </div>
              </SpotlightCard>
            ))}
          </div>

          {/* Sidebar: Suggested People & Interests */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <SpotlightCard style={{ padding: '20px', background: 'rgba(18, 18, 24, 0.85)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>
                People You May Know
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {suggestedUsers.map((su) => (
                  <div key={su.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={su.avatar} alt={su.name} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>{su.name}</div>
                        <div style={{ fontSize: '11px', color: '#71717a' }}>{su.role}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFollow(su.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '9999px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: su.followed ? 'rgba(56, 189, 248, 0.15)' : '#ffffff',
                        border: su.followed ? '1px solid #38bdf8' : 'none',
                        color: su.followed ? '#38bdf8' : '#09090b',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {su.followed ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </SpotlightCard>

            <SpotlightCard style={{ padding: '20px', background: 'rgba(18, 18, 24, 0.85)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>
                Your Topics
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(user?.interests || ['AI & Machine Learning', 'Design & UI/UX', 'Engineering & Code']).map((tag, idx) => (
                  <span key={idx} style={{ padding: '4px 10px', borderRadius: '9999px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.25)', color: '#38bdf8', fontSize: '11px', fontWeight: 500 }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </SpotlightCard>
          </div>
        </div>
      )}

      {/* VIEW: EXPLORE */}
      {activeTab === 'explore' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
            <input
              type="text"
              placeholder="Search community posts, creators, or topics..."
              className="auth-input"
              style={{ paddingLeft: '46px', height: '48px', borderRadius: '16px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {posts.map((post) => (
              <SpotlightCard key={post.id} style={{ padding: '18px', background: 'rgba(18, 18, 24, 0.85)' }}>
                {post.image && (
                  <div style={{ borderRadius: '12px', overflow: 'hidden', height: '180px', marginBottom: '12px' }}>
                    <img src={post.image} alt="Explore item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ fontSize: '12px', color: '#38bdf8', marginBottom: '4px', fontWeight: 600 }}>@{post.author.handle}</div>
                <p style={{ fontSize: '13.5px', color: '#f4f4f5', lineHeight: 1.5 }}>{post.content}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: MESSAGES */}
      {activeTab === 'messages' && (
        <div className="animate-fade-in" style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '16px',
          height: '520px',
          background: 'rgba(18, 18, 24, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          overflow: 'hidden',
          padding: '16px'
        }}>
          {/* Conversation list */}
          <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.06)', paddingRight: '12px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>Conversations</h3>
            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" alt="Sophia" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>Dr. Sophia Vance</div>
                <div style={{ fontSize: '11px', color: '#38bdf8' }}>Active now</div>
              </div>
            </div>
          </div>

          {/* Active Chat panel */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingLeft: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingRight: '8px' }}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    alignSelf: m.incoming ? 'flex-start' : 'flex-end',
                    maxWidth: '75%',
                    padding: '10px 14px',
                    borderRadius: '16px',
                    background: m.incoming ? '#22222a' : 'linear-gradient(135deg, #0284c7, #0369a1)',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    lineHeight: 1.45
                  }}
                >
                  <div>{m.text}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)', textAlign: 'right', marginTop: '4px' }}>{m.time}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a secure message..."
                className="auth-input"
                style={{ height: '42px', fontSize: '13.5px', borderRadius: '12px' }}
              />
              <button
                type="submit"
                className="auth-btn-continue"
                style={{ width: '42px', height: '42px', borderRadius: '12px', marginTop: 0, padding: 0 }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VIEW: EVENTS */}
      {activeTab === 'events' && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {events.map((ev) => (
            <SpotlightCard
              key={ev.id}
              spotlightColor="rgba(56, 189, 248, 0.15)"
              style={{ padding: '22px', background: 'rgba(18, 18, 24, 0.85)' }}
            >
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: '9999px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                {ev.tag}
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: '10px 0 6px 0' }}>
                {ev.title}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px', color: '#94a3b8', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={14} color="#38bdf8" />
                  <span>{ev.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} color="#38bdf8" />
                  <span>{ev.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={14} color="#38bdf8" />
                  <span>{ev.attendees} going</span>
                </div>
              </div>

              <button
                onClick={() => toggleRsvp(ev.id)}
                style={{
                  width: '100%',
                  height: '40px',
                  borderRadius: '12px',
                  background: ev.rsvpd ? '#10b981' : '#ffffff',
                  color: ev.rsvpd ? '#ffffff' : '#09090b',
                  fontWeight: 600,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {ev.rsvpd ? (
                  <>
                    <Check size={14} />
                    <span>RSVP Confirmed</span>
                  </>
                ) : (
                  <span>RSVP - I'm Going</span>
                )}
              </button>
            </SpotlightCard>
          ))}
        </div>
      )}

      {/* VIEW: MY PROFILE */}
      {activeTab === 'profile' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '640px', margin: '0 auto' }}>
          <TiltedCard maxTilt={10} scale={1.01}>
            <div style={{
              padding: '28px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(18, 18, 26, 0.95), rgba(12, 12, 18, 0.95))',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt={user?.name}
                style={{ width: '84px', height: '84px', borderRadius: '50%', border: '3px solid #38bdf8', objectFit: 'cover', marginBottom: '14px' }}
              />
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>{user?.name}</h2>
              <p style={{ fontSize: '13px', color: '#38bdf8', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                @{user?.username || 'user'}
              </p>
              <p style={{ fontSize: '13.5px', color: '#cbd5e1', maxWidth: '420px', lineHeight: 1.5, marginBottom: '18px' }}>
                {user?.bio || 'Building connected experiences.'}
              </p>

              <div style={{ display: 'flex', gap: '24px', padding: '12px 20px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>128</div>
                  <div style={{ fontSize: '11px', color: '#71717a' }}>Followers</div>
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>94</div>
                  <div style={{ fontSize: '11px', color: '#71717a' }}>Following</div>
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>{posts.length}</div>
                  <div style={{ fontSize: '11px', color: '#71717a' }}>Posts</div>
                </div>
              </div>
            </div>
          </TiltedCard>
        </div>
      )}

      {/* VIEW: SEARCH / DISCOVERY */}
      {activeTab === 'search' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '680px', margin: '0 auto' }}>
          <SpotlightCard style={{ padding: '24px', background: 'rgba(18, 18, 24, 0.9)', backdropFilter: 'blur(16px)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={20} color="#38bdf8" />
              <span>Explore & Search</span>
            </h2>
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <Search size={18} color="#71717a" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search creators, topics, tags (#ai, #design)..."
                className="auth-input"
                style={{ height: '46px', paddingLeft: '42px', fontSize: '14px' }}
              />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['#AI', '#Web3', '#UIUX', '#Frontend', '#SystemDesign', '#Photography', '#React'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearchQuery(tag)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#cbd5e1',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </SpotlightCard>
        </div>
      )}

      {/* VIEW: NOTIFICATIONS / ACTIVITY */}
      {activeTab === 'notifications' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '640px', margin: '0 auto' }}>
          <SpotlightCard style={{ padding: '20px', background: 'rgba(18, 18, 24, 0.9)', backdropFilter: 'blur(16px)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={18} color="#ef4444" fill="#ef4444" />
              <span>Recent Activity</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'Elena Rostova', action: 'liked your post about WebGL Shaders', time: '12m ago', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
                { name: 'Marcus Vance', action: 'started following you', time: '1h ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
                { name: 'Aria Chen', action: 'commented: "Incredible design architecture!"', time: '3h ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
                { name: 'Devin K.', action: 'RSVPed to the System Architecture Summit', time: '5h ago', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' }
              ].map((notif, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <img src={notif.avatar} alt={notif.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div style={{ flex: 1, fontSize: '13px', color: '#e2e8f0' }}>
                    <strong>{notif.name}</strong> {notif.action}
                    <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>{notif.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </div>
      )}

      {/* More Options / Hamburger Drawer Modal */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(10px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            padding: '24px 24px 24px 84px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-fade-in"
            style={{
              width: '260px',
              borderRadius: '18px',
              background: '#121217',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '10px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '4px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>{user?.name}</div>
              <div style={{ fontSize: '11px', color: '#71717a' }}>@{user?.username || 'user'}</div>
            </div>

            <button
              type="button"
              onClick={() => { setActiveTab('profile'); setIsMenuOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'none', border: 'none', color: '#e2e8f0', fontSize: '13px', cursor: 'pointer', textAlign: 'left' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <UserIcon size={16} color="#38bdf8" />
              <span>Your Profile</span>
            </button>

            <button
              type="button"
              onClick={() => { addToast('Settings saved', 'info'); setIsMenuOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'none', border: 'none', color: '#e2e8f0', fontSize: '13px', cursor: 'pointer', textAlign: 'left' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Settings size={16} color="#a1a1aa" />
              <span>Settings</span>
            </button>

            <button
              type="button"
              onClick={() => { addToast('Opening help center', 'info'); setIsMenuOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'none', border: 'none', color: '#e2e8f0', fontSize: '13px', cursor: 'pointer', textAlign: 'left' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <HelpCircle size={16} color="#a1a1aa" />
              <span>Help & Support</span>
            </button>

            <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '4px 0' }} />

            <button
              type="button"
              onClick={() => { signOut(); setIsMenuOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'none', border: 'none', color: '#ef4444', fontSize: '13px', cursor: 'pointer', textAlign: 'left' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
