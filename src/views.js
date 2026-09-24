import { escapeHTML as e, icon, avatar, mediaURL } from './ui.js';
import { avatars, contacts, navigation, topics, topicLabel } from './data.js';

export const providers = { google: 'Google', apple: 'Apple', github: 'GitHub', discord: 'Discord', twitter: 'X' };
const providerPaths = {
  google: '<path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.4a4.6 4.6 0 0 1-2 3v2.6h3.2c1.9-1.7 3-4.3 3-7.5Z"/><path fill="#34A853" d="M12 22c2.7 0 5-1 6.6-2.4l-3.2-2.6c-.9.6-2 1-3.4 1a6 6 0 0 1-5.7-4.2H3v2.7A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.3 13.8a6 6 0 0 1 0-3.6V7.5H3a10 10 0 0 0 0 9l3.3-2.7Z"/><path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.9 1.5l2.9-2.9A9.5 9.5 0 0 0 12 2a10 10 0 0 0-9 5.5l3.3 2.7A6 6 0 0 1 12 6Z"/>',
  apple: '<path fill="currentColor" d="M16.4 1.4c.2 1.4-.4 2.8-1.2 3.8-.9 1-2.2 1.7-3.5 1.6-.2-1.3.5-2.7 1.3-3.6.9-1 2.3-1.7 3.4-1.8ZM20.8 17.8c-.6 1.4-.9 2-1.7 3.2-1 1.4-2.3 3.1-3.9 3.1-1.4 0-1.8-.9-3.7-.9-1.8 0-2.3.9-3.7.9-1.5 0-2.7-1.5-3.7-3-2.8-3.9-3.1-8.5-1.4-11 1.2-1.8 3-2.8 4.7-2.8 1.5 0 2.5.9 3.8.9s2.1-.9 3.8-.9c1.5 0 3.1.9 4.3 2.3-3.7 2-3.1 7.1 1.5 8.2Z" transform="translate(1 0) scale(.9)"/>',
  github: '<path fill="currentColor" d="M12 .8a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.2.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.7-1.3-1.7-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.9 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.8 5.5-5.5 5.8.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6A11.5 11.5 0 0 0 12 .8Z"/>',
  discord: '<path fill="currentColor" d="M19.6 5.3A18 18 0 0 0 15.4 4l-.5 1a16 16 0 0 0-5.8 0l-.5-1a18 18 0 0 0-4.2 1.3C1.7 9.2 1 13 1.3 16.8a17 17 0 0 0 5.2 2.6l1.1-1.8-1.7-.8.4-.3a12 12 0 0 0 11.4 0l.4.3-1.7.8 1.1 1.8a17 17 0 0 0 5.2-2.6c.4-4.5-.8-8.3-3.1-11.5ZM8.4 14.5c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm7.2 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z"/>',
  twitter: '<path fill="currentColor" d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-7.4L5.5 22H2.3l7.4-8.6L2 2h6.5l4.4 6.7L18.9 2ZM17.8 20h1.7L7.5 3.9H5.7L17.8 20Z"/>'
};
const providerMark = provider => `<svg class="provider-mark ${provider}" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">${providerPaths[provider]}</svg>`;
const button = (action, text, className = 'secondary-button', extra = '') => `<button type="button" class="${className}" data-action="${action}" ${extra}>${text}</button>`;
const field = (name, label, value = '', extra = '') => `<label class="field-label" for="${name}">${label}</label><input class="auth-input" id="${name}" name="${name}" value="${e(value)}" ${extra} />`;

export function authView(mode, background) {
  const signup = mode === 'signup';
  const oauth = `<div class="auth-oauth-group ${signup ? 'provider-grid' : ''}">${Object.entries(providers).map(([id, name], index) =>
    `<button type="button" class="auth-btn-oauth" data-action="oauth" data-provider="${id}" ${index > 2 ? 'data-extra-provider hidden' : ''}>${providerMark(id)}<span>${signup ? name : `Sign in with ${name}`}</span></button>`
  ).join('')}</div><div class="auth-view-more">${button('more-providers', signup ? 'More providers (Discord, X)' : 'View more', 'auth-view-more-btn', 'aria-expanded="false"')}</div>`;
  return `<header class="auth-header">
    <div class="brand"><img src="/logo.png" alt="" class="brand-logo" /><span class="auth-brand-name">Social Connectivity Platform</span></div>
    <div class="row">${button('background', `${icon('sparkle', 14)} <span>${background === 'fibers' ? 'Ghost Fibers' : 'Silk Gradient'}</span>`, 'pill background-toggle')}${button('help', 'Need Help?', 'pill')}</div>
  </header>
  <main class="auth-main"><div class="auth-box-wrapper animate-fade-in"><div class="auth-box-halo" aria-hidden="true"></div><section class="auth-box-card ${signup ? 'signup-card' : ''}">
    <h1 class="auth-heading">${signup ? 'Sign up' : 'Sign in'}</h1>
    <p class="auth-subheading">${signup ? 'Already have an account?' : 'New user?'} ${button('auth-mode', signup ? 'Sign in' : 'Create an account', 'auth-subheading-link')}</p>
    <div id="auth-error" class="auth-error-banner" role="alert" hidden></div>
    ${signup ? `${oauth}<div class="auth-divider"><span class="auth-divider-text">or with email</span></div>` : ''}
    <form id="auth-form" data-mode="${mode}">
      ${signup ? `<div class="auth-input-group">${field('name', 'Full name', '', 'placeholder="Full name" autocomplete="name" minlength="2" maxlength="80" required')}</div>` : ''}
      <div class="auth-input-group">${field('email', 'Email address', '', 'type="email" placeholder="Email address" autocomplete="email" required')}</div>
      <div id="password-group" class="auth-input-group" ${signup ? '' : 'hidden'}>
        <label class="field-label" for="password">${signup ? 'Create password' : 'Password'}</label>
        <div class="password-wrapper"><input id="password" name="password" class="auth-input" type="password" placeholder="${signup ? 'Create password' : 'Enter your password'}" autocomplete="${signup ? 'new-password' : 'current-password'}" ${signup ? 'minlength="6" required' : 'disabled'} />
        ${button('password', icon('eye'), 'password-toggle icon-button', 'aria-label="Show password"')}</div>
        ${signup ? '<div id="password-strength" class="password-strength" aria-live="polite"></div>' : `<div class="text-right">${button('help', 'Forgot password?', 'text-button small')}</div>`}
      </div>
      ${signup ? '<label class="terms-row"><input type="checkbox" name="terms" required checked /> <span>I agree to the Terms and Privacy Policy.</span></label>' : ''}
      <button type="submit" class="auth-btn-continue">${signup ? 'Create account' : 'Continue'}</button>
    </form>
    ${signup ? '' : `<div class="auth-divider"><span class="auth-divider-text">Or</span></div>${oauth}`}
    <div class="auth-card-footer">${signup ? 'Need assistance?' : "Can't sign in?"} ${button('help', 'Get help', 'text-button')}</div>
  </section></div></main>
  <footer class="auth-footer"><p>${icon('lock', 13)} Local account & OAuth flow demo</p><small>Social Connectivity Platform · HTML, CSS & JavaScript</small></footer>`;
}

export function identityFields(profile) {
  return `<div class="identity-preview row">${avatar(profile, 'large')}<div><strong id="preview-name">${e(profile.name)}</strong><p class="accent" id="preview-handle">@${e(profile.username)}</p><small id="preview-bio">${e(profile.bio)}</small></div></div>
    <p class="field-label">Select Avatar</p><div class="avatar-options">${avatars.map((src, index) => button('avatar', `<img src="${mediaURL(src)}" alt="Avatar ${index + 1}" />`, `avatar-option ${profile.avatar === src ? 'selected' : ''}`, `data-index="${index}" aria-pressed="${profile.avatar === src}"`)).join('')}</div>
    <div class="auth-input-group">${field('name', 'Display Name', profile.name, 'required minlength="2" maxlength="80"')}</div>
    <div class="auth-input-group">${field('username', 'Unique Handle', profile.username, 'required pattern="[a-zA-Z0-9_]+" maxlength="30"')}</div>
    <label class="field-label" for="bio">Bio <span class="muted">(up to 160 characters)</span></label><textarea id="bio" name="bio" class="auth-input bio-input" maxlength="160">${e(profile.bio)}</textarea>`;
}

export function onboardingView(profile, step) {
  return `<main class="onboarding-main"><section class="auth-box-card onboarding-card animate-fade-in">
    <div class="row between"><span class="eyebrow">Step ${step} of 3 • Profile Setup</span>${button('skip-onboarding', 'Skip to Platform', 'text-button small')}</div>
    <h1 class="section-title shiny-text">${['Design Your Identity', 'Select Your Interests', 'Privacy & Audience'][step - 1]}</h1>
    <div class="step-progress" aria-label="Step ${step} of 3">${[1, 2, 3].map(n => `<span class="${n <= step ? 'active' : ''}"></span>`).join('')}</div>
    <form id="onboarding-form">
      ${step === 1 ? identityFields(profile) : step === 2 ? `<p class="description">Pick at least <strong>3 interests</strong> to personalize your feed.</p><div class="topic-grid">${topics.map(topic => button('topic', `<span class="topic-emoji">${topic.emoji}</span><strong>${topic.label}</strong><small>${topic.description}</small>`, `topic-option ${profile.interests.includes(topic.id) ? 'selected' : ''}`, `data-id="${topic.id}" aria-pressed="${profile.interests.includes(topic.id)}"`)).join('')}</div><p class="small accent">Selected: ${profile.interests.length} topics</p>` : `<p class="description">Choose your profile visibility preference.</p><div class="stack">${[
        ['public', 'Open Community', 'Anyone can discover your public profile.', 'compass'],
        ['mutual', 'Friends & Mutuals Only', 'Share with connections and mutual friends.', 'user'],
        ['private', 'Private Safe Space', 'Keep your profile visibility limited.', 'lock']
      ].map(([id, title, desc, glyph]) => `<label class="privacy-option ${profile.privacy === id ? 'selected' : ''}"><input type="radio" name="privacy" value="${id}" ${profile.privacy === id ? 'checked' : ''} />${icon(glyph)}<span><strong>${title}</strong><small>${desc}</small></span></label>`).join('')}</div>`}
      <div class="row onboarding-actions">${step > 1 ? button('onboarding-back', 'Back') : ''}<button class="auth-btn-continue" type="submit" ${step === 2 && profile.interests.length < 3 ? 'disabled' : ''}>${step === 3 ? 'Launch My Profile' : 'Continue'} →</button></div>
    </form>
  </section></main>`;
}

export function shellView(user, tab) {
  return `<nav class="nav-rail" aria-label="Main navigation">
    <button type="button" class="nav-logo" data-action="navigate" data-tab="feed" aria-label="Home"><img src="/logo.png" alt="" /></button>
    <div class="nav-links">${navigation.map(([id, glyph, label]) => `<button type="button" class="nav-button ${tab === id ? 'active' : ''}" data-action="navigate" data-tab="${id}" title="${label}" aria-label="${label}" ${tab === id ? 'aria-current="page"' : ''}>${id === 'profile' ? avatar(user) : icon(glyph, 24)}${id === 'messages' ? '<span id="unread-badge" class="unread-badge" hidden></span>' : ''}</button>`).join('')}
    ${button('create-post', icon('plus', 25), 'nav-button create-button', 'aria-label="Create New Post" title="Create New Post"')}</div>
    ${button('menu', icon('menu', 25), 'nav-button menu-button', 'aria-label="More options" title="More options"')}
  </nav><main class="platform-main">
    <header class="platform-header panel"><div class="header-brand"><strong class="shiny-text">Social Connectivity Platform</strong><span id="connection-status" class="connection-status">● Connecting…</span></div>
    ${button('commands', `${icon('search', 14)} <span>Search & Commands</span> <kbd>Ctrl K</kbd>`, 'command-trigger')}
    <div class="header-user"><div><strong>${e(user.name)}</strong><small class="accent">@${e(user.username || 'user')}</small></div>${avatar(user)}${button('signout', icon('logout', 16), 'icon-button', 'aria-label="Sign out" title="Sign out"')}</div></header>
    <div id="view" class="animate-fade-in"></div>
  </main>`;
}

export function postView(post) {
  return `<article class="panel post-card" data-post="${e(post.id)}" id="post-${e(post.id)}">
    <div class="author-row">${avatar(post.author)}<div><strong>${e(post.author.name)} ${post.author.role === 'verified_user' ? `<span class="accent">${icon('shield', 14)}</span>` : ''}</strong><small>@${e(post.author.handle)} • ${e(post.timestamp)}</small></div></div>
    <p class="post-content">${e(post.content)}</p>
    ${post.image ? `<img class="post-media" src="${mediaURL(post.image)}" alt="Post attachment" loading="lazy" />` : ''}
    <div class="post-actions">${button('like', `${icon('heart', 17)} <span>${e(post.likes)}</span>`, `text-button ${post.liked ? 'liked' : ''}`, `data-id="${e(post.id)}" aria-label="Like post by ${e(post.author.name)}" aria-pressed="${!!post.liked}"`)}
    ${button('comments', `${icon('message', 17)} <span>${e(post.comments)}</span>`, 'text-button', `data-id="${e(post.id)}" aria-label="Comments on post by ${e(post.author.name)}"`)}
    ${button('share', `${icon('share', 17)} Share`, 'text-button', `data-id="${e(post.id)}"`)}</div>
  </article>`;
}

export function peopleView(following, people = contacts.slice(0, 2)) {
  return people.map(person => `<div class="person-row">${avatar(person)}<div><strong>${e(person.name)}</strong><small>${e(person.role)}</small></div>${button('follow', following.includes(person.id) ? 'Connected' : 'Connect', `connect-button ${following.includes(person.id) ? 'selected' : ''}`, `data-id="${e(person.id)}" aria-pressed="${following.includes(person.id)}"`)}</div>`).join('');
}

export function feedView(state, user) {
  return `<div class="feed-grid"><section class="stack"><section class="panel composer-card"><form id="post-form">
    <div class="row align-start">${avatar(user)}<label class="sr-only" for="post-composer-input">Write a post</label><textarea id="post-composer-input" name="content" maxlength="5000" placeholder="What's inspiring you today, ${e(user.name.split(' ')[0])}?">${e(state.postDraft)}</textarea></div>
    <div id="attachment-preview">${state.postImage ? `<img src="${mediaURL(state.postImage)}" alt="Selected attachment" />${button('remove-image', 'Remove photo', 'text-button small')}` : ''}</div>
    <div class="row between composer-footer"><label class="text-button accent file-label">${icon('image', 16)} Photo<input id="post-photo" type="file" accept="image/png,image/jpeg,image/webp,image/gif" class="sr-only" /></label><button type="submit" class="primary-button" ${state.postDraft.trim() || state.postImage ? '' : 'disabled'}>Share Post ${icon('send', 14)}</button></div>
  </form></section><div id="post-stream" class="stack">${state.posts.map(postView).join('')}</div></section>
  <aside class="stack feed-sidebar"><section class="panel"><h2 class="card-title">People You May Know</h2><div id="suggested-people" class="stack">${peopleView(state.following)}</div></section>
  <section class="panel"><h2 class="card-title">Your Topics</h2><div class="tags">${(user.interests?.length ? user.interests : ['ai', 'design', 'code']).map(tag => button('search-topic', `#${e(topicLabel(tag))}`, 'tag', `data-query="${e(topicLabel(tag))}"`)).join('')}</div></section></aside></div>`;
}

export function searchResults(state) {
  const query = state.searchQuery.replace(/^#/, '').trim().toLowerCase();
  const posts = state.posts.filter(post => `${post.content} ${post.author.name} ${post.author.handle} ${(post.tags || []).join(' ')}`.toLowerCase().includes(query));
  const people = contacts.filter(person => `${person.name} ${person.handle} ${person.role}`.toLowerCase().includes(query));
  return `${people.length ? `<section class="panel"><h2 class="card-title">Creators</h2><div class="stack">${peopleView(state.following, people)}</div></section>` : ''}<div class="explore-grid">${posts.map(postView).join('')}</div>${!posts.length && !people.length ? '<p class="empty-state">No results. Try another creator, topic, or keyword.</p>' : ''}`;
}

export function exploreView(state) {
  return `<section class="stack"><div class="panel"><h1 class="section-title">${state.tab === 'search' ? 'Explore & Search' : 'Discover your community'}</h1><label class="sr-only" for="search-input">Search creators and posts</label><input id="search-input" class="auth-input" type="search" placeholder="Search community posts, creators, or topics…" value="${e(state.searchQuery)}" /><div class="tags search-tags">${['AI', 'Design', 'Engineering', 'Photography', 'WebGL'].map(tag => button('search-topic', `#${tag}`, 'tag', `data-query="${tag}"`)).join('')}</div></div><div id="search-results" class="stack">${searchResults(state)}</div></section>`;
}

export function contactsView(state, socket) {
  return contacts.map(person => {
    const online = socket.connected && socket.activeUsers.some(user => user.userId === person.id && user.isOnline);
    const unread = state.messages.some(message => message.fromUserId === person.id && message.status !== 'READ');
    return button('partner', `${avatar(person)}<span><strong>${e(person.name)}</strong><small class="${online ? 'accent' : ''}">${online ? 'Active on gateway' : 'Offline'}${unread ? ' • New message' : ''}</small></span>`, `contact-button ${state.partnerId === person.id ? 'selected' : ''}`, `data-id="${person.id}" aria-pressed="${state.partnerId === person.id}"`);
  }).join('');
}

export function messageView(message, userId) {
  const incoming = message.fromUserId !== userId;
  return `<div class="message-bubble ${incoming ? 'incoming' : 'outgoing'}" data-message="${e(message.id)}">${message.audio ? `<audio controls preload="metadata" src="${mediaURL(message.audio, '')}"></audio>` : `<p>${e(message.text)}</p>`}<small>${e(message.time)} ${incoming ? '' : `<span data-message-status="${e(message.id)}">${e(message.status)}</span>`}</small></div>`;
}

export function messagesView(state, user, socket) {
  const partner = contacts.find(person => person.id === state.partnerId) || contacts[0];
  const messages = state.messages.filter(message => message.fromUserId === partner.id || message.toUserId === partner.id);
  return `<section class="panel messages-layout"><aside class="contacts-panel"><h1 class="card-title">${icon('message', 16)} Messages</h1><div id="contacts-list" class="stack">${contactsView(state, socket)}</div></aside>
    <div class="chat-panel"><header class="author-row chat-header">${avatar(partner)}<div><strong>${e(partner.name)}</strong><small>@${e(partner.handle)} • ${e(partner.role)}</small></div></header>
    <div id="message-thread" class="message-thread" role="log" aria-label="Conversation"><p class="empty-state" ${messages.length ? 'hidden' : ''}>No messages yet. Send a greeting to start a conversation!</p>${messages.map(message => messageView(message, user.id)).join('')}</div>
    <p id="typing-indicator" class="small accent" aria-live="polite" hidden>${e(partner.name)} is typing…</p>
    <form id="message-form" class="row chat-composer"><label class="sr-only" for="chat-input">Message ${e(partner.name)}</label><input id="chat-input" class="auth-input" name="message" placeholder="Message ${e(partner.name)}…" maxlength="5000" value="${e(state.chatDrafts[partner.id] || '')}" />${button('record', icon('mic'), 'icon-button', 'aria-label="Record Voice Note" title="Record Voice Note"')}<button type="submit" class="primary-button" aria-label="Send message">${icon('send')}</button></form>
    <div id="voice-recorder" class="row" hidden><span class="recording-dot"></span><span id="recording-time">Recording…</span>${button('send-recording', 'Send', 'primary-button')}${button('cancel-recording', 'Cancel', 'text-button')}</div>
  </div></section>`;
}

export function eventsView(state) {
  return `<h1 class="section-title">Community Events</h1><div class="events-grid">${state.events.map(event => `<article class="panel"><span class="tag">${e(event.tag)}</span><h2 class="event-title">${e(event.title)}</h2><div class="event-details"><p>${icon('clock', 14)} ${e(event.date)}</p><p>${icon('pin', 14)} ${e(event.location)}</p><p>${icon('user', 14)} ${event.attendees} going</p></div>${button('rsvp', event.rsvpd ? `${icon('check', 14)} RSVP Confirmed` : "RSVP - I'm Going", `primary-button full-width ${event.rsvpd ? 'confirmed' : ''}`, `data-id="${event.id}" aria-pressed="${event.rsvpd}"`)}</article>`).join('')}</div>`;
}

export function profileView(state, user) {
  const ownPosts = state.posts.filter(post => post.author.id === user.id);
  const cells = Array.from({ length: 182 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - 181 + index);
    const key = date.toLocaleDateString('en-CA');
    const count = state.activity[key] || 0;
    return `<span class="activity-cell level-${Math.min(4, count)}" title="${e(date.toDateString())}: ${count} activities"></span>`;
  }).join('');
  return `<div class="profile-layout stack"><section class="panel profile-card"><div class="profile-cover"></div>${avatar(user, 'profile-avatar')}<h1>${e(user.name)}</h1><p class="accent font-mono">@${e(user.username || 'user')}</p><p class="profile-bio">${e(user.bio || 'Building connected experiences.')}</p><div class="profile-stats"><div><strong>${state.following.length}</strong><small>Connections</small></div><div><strong>${ownPosts.length}</strong><small>Posts</small></div><div><strong>${(user.interests || []).length}</strong><small>Interests</small></div></div>${button('edit-profile', 'Edit profile', 'secondary-button')}</section>
    <section class="panel"><h2 class="card-title">Community Activity</h2><p class="small muted">Your contributions over the last six months</p><div class="heatmap-scroll"><div class="activity-heatmap" role="img" aria-label="Daily community contributions">${cells}</div></div><div class="row between small"><span>Less <span class="activity-cell level-0"></span><span class="activity-cell level-2"></span><span class="activity-cell level-4"></span> More</span><span>${Object.values(state.activity).reduce((sum, count) => sum + count, 0)} contributions</span></div><div class="tags achievement-tags"><span class="tag">✦ Community Member</span>${ownPosts.length ? '<span class="tag">⚡ Conversation Starter</span>' : ''}${state.following.length ? '<span class="tag">♡ Connected Creator</span>' : ''}</div></section>
    ${ownPosts.length ? `<h2 class="card-title">Your Posts</h2>${ownPosts.map(postView).join('')}` : ''}</div>`;
}

export function notificationsView(state) {
  return `<section class="panel notifications-panel"><h1 class="section-title">${icon('heart')} Recent Activity</h1><div class="stack">${state.notifications.map(notification => `<article class="notification-row">${avatar(notification)}<div><strong>${e(notification.name)}</strong><p>${e(notification.action)}</p><small>${e(notification.time)}</small></div></article>`).join('') || '<p class="empty-state">You’re all caught up.</p>'}</div></section>`;
}

export function dialogHeader(title) {
  return `<header class="modal-header"><h2 id="dialog-title">${title}</h2>${button('close-dialog', icon('close'), 'modal-close-btn', 'aria-label="Close dialog"')}</header>`;
}

export function helpView() {
  return `${dialogHeader('How can we help?')}<div class="stack modal-body"><p>New here? Create an account, set up your profile, and start connecting with the community.</p><details><summary>How do I sign in?</summary><p>Use an email registered in this browser, or try one of the simulated provider flows.</p></details><details><summary>Where is my account stored?</summary><p>This project saves demo accounts, posts, and preferences in your browser’s local storage.</p></details><details><summary>How do live messages work?</summary><p>Start the JavaScript gateway with <code>npm run server</code>. Text messages, presence, and likes then update through the browser’s WebSocket API.</p></details><form id="reset-form"><h3>Password reset demo</h3><p class="small muted">This demo records the request; it does not send email.</p>${field('reset-email', 'Account email', '', 'type="email" required placeholder="you@example.com"')}<button class="auth-btn-continue" type="submit">Request reset</button><p id="reset-result" class="small accent" role="status"></p></form></div>`;
}

export function oauthView(pending) {
  const name = providers[pending.provider];
  return `${dialogHeader(`${name} OAuth 2.0 Demo`)}<form id="oauth-form" class="stack modal-body"><div class="text-center">${providerMark(pending.provider)}<h3>${pending.isSignUp ? 'Sign up' : 'Sign in'} with ${name}</h3><p class="small muted">Simulated provider authorization for this local demo.</p></div><div class="scope-list"><strong>Requested scopes</strong><p>✓ openid — identity</p><p>✓ profile — name and avatar</p><p>✓ email — email address</p></div>${field('oauth-name', 'Your name', '', `placeholder="${name} User" maxlength="80"`)}${field('oauth-email', 'Email address', '', `type="email" placeholder="user@${pending.provider}.com"`)}<details><summary>Inspect demo PKCE parameters</summary><pre>client_id: scp-web-client-2026
response_type: code
state: ${e(pending.state)}
code_challenge: ${e(pending.codeChallenge)}</pre></details><div class="row">${button('close-dialog', 'Cancel')}<button type="submit" class="auth-btn-continue">Authorize & Continue</button></div></form>`;
}

export function commandResults(query = '') {
  const commands = [
    ...navigation.map(([id, glyph, label]) => ({ action: 'navigate', extra: `data-tab="${id}"`, label, glyph })),
    { action: 'create-post', label: 'Create New Post', glyph: 'plus' },
    { action: 'help', label: 'Help & Documentation', glyph: 'help' },
    ...contacts.map(person => ({ action: 'partner', extra: `data-id="${person.id}"`, label: `Message ${person.name}`, glyph: 'message' }))
  ].filter(command => command.label.toLowerCase().includes(query.toLowerCase()));
  return commands.map(command => button(command.action, `${icon(command.glyph)} ${e(command.label)}`, 'command-option', command.extra || '')).join('') || '<p class="empty-state">No matching commands.</p>';
}

export function commandsView() {
  return `${dialogHeader('Search & Commands')}<label class="sr-only" for="command-input">Find a command</label><input id="command-input" class="auth-input" type="search" placeholder="Where would you like to go?" autocomplete="off" /><div id="command-results" class="command-results">${commandResults()}</div><p class="small muted">↑ ↓ to navigate · Enter to select · Esc to close</p>`;
}

export function menuView() {
  return `${dialogHeader('More Options')}<div class="stack modal-body">${button('edit-profile', `${icon('settings')} Profile & Settings`, 'command-option')}${button('background', `${icon('sparkle')} Switch Background`, 'command-option')}${button('help', `${icon('help')} Help & Documentation`, 'command-option')}${button('signout', `${icon('logout')} Sign Out`, 'command-option')}</div>`;
}

function commentView(comment, currentUser, parent = '') {
  const owner = comment.author.id === currentUser.id;
  return `<article class="comment ${parent ? 'reply' : ''}"><div class="author-row">${avatar(comment.author)}<div><strong>${e(comment.author.name)}</strong><small>@${e(comment.author.handle)} • ${e(comment.timestamp)}</small></div></div><p>${e(comment.content)}</p><div class="row small">${!parent ? `${button('like-comment', `♡ ${comment.likes || 0}`, `text-button ${comment.liked ? 'liked' : ''}`, `data-id="${e(comment.id)}" aria-pressed="${!!comment.liked}"`)}${button('reply', 'Reply', 'text-button', `data-id="${e(comment.id)}"`)}` : ''}${owner ? button('delete-comment', 'Delete', 'text-button', `data-id="${e(comment.id)}" data-parent="${e(parent)}"`) : ''}</div>${(comment.replies || []).map(reply => commentView(reply, currentUser, comment.id)).join('')}</article>`;
}

export function commentsView(post, comments, user) {
  return `${dialogHeader('Discussion')}<div class="discussion-summary"><strong>${e(post.author.name)}</strong><p>${e(post.content)}</p></div><div id="comments-list" class="comments-list">${comments.map(comment => commentView(comment, user)).join('') || '<p class="empty-state">No comments yet. Be the first to share your perspective!</p>'}</div><form id="comment-form" class="comment-form"><div id="reply-banner" class="row between" hidden><span></span>${button('cancel-reply', icon('close', 14), 'text-button', 'aria-label="Cancel reply"')}</div><div class="row quick-emojis">${['❤️', '🔥', '👏', '🚀', '💡', '✨', '🙌'].map(emoji => button('emoji', emoji, 'text-button', `data-emoji="${emoji}" aria-label="Insert ${emoji}"`)).join('')}</div><label class="sr-only" for="comment-input">Write a comment</label><textarea id="comment-input" class="auth-input" name="content" placeholder="Share your perspective…" maxlength="2000" required></textarea><button class="auth-btn-continue" type="submit">Post comment ${icon('send', 14)}</button></form>`;
}

export function editProfileView(profile) {
  return `${dialogHeader('Edit Profile')}<form id="profile-form" class="modal-body">${identityFields(profile)}<button class="auth-btn-continue" type="submit">Save changes</button></form>`;
}
