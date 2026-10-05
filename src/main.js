import { authService, generateMockJWT } from './services/authService.js';
import { SocketService } from './services/socketService.js';
import { startBackground } from './background.js';
import { makeId, readStored, toast } from './ui.js';
import { avatars, initialMessages, navigation, seedComments, seedEvents, seedNotifications, seedPosts } from './data.js';
import * as views from './views.js';

const root = document.getElementById('root');
const dialog = document.getElementById('app-dialog');
let session = authService.getStoredSession();
if (!session?.user?.id) session = null;
let authMode = 'signin';
let step = 1;
let profileDraft;
let pendingOAuth;
let dialogType = '';
let commentPostId;
let replyingTo;
let modalTrigger;
let typingTimer;
let recorder;
let recordingTimer;
let recordingRequest = 0;
let state;
let background = readStored('scp_background', 'fibers');
const setBackground = startBackground(document.getElementById('fibers-canvas'));
const socket = new SocketService(handleSocketEvent);

function newState(user) {
  const saved = user ? readStored(`scp_data_${user.id}`, {}) : {};
  return {
    tab: 'feed', partnerId: 's1', searchQuery: '', postDraft: '', postImage: '', chatDrafts: {},
    posts: saved.posts || structuredClone(seedPosts), events: saved.events || structuredClone(seedEvents),
    comments: saved.comments || structuredClone(seedComments), following: saved.following || [],
    messages: saved.messages || initialMessages(user?.id), notifications: saved.notifications || structuredClone(seedNotifications),
    activity: saved.activity || {}
  };
}

function save() {
  if (!session) return;
  const { posts, events, comments, following, messages, notifications, activity } = state;
  try {
    localStorage.setItem(`scp_data_${session.user.id}`, JSON.stringify({ posts, events, comments, following, messages, notifications, activity }));
  } catch {
    toast('Browser storage is full. This change is available for the current visit.', 'error');
  }
}

function recordActivity() {
  const day = new Date().toLocaleDateString('en-CA');
  state.activity[day] = (state.activity[day] || 0) + 1;
}

function makeProfileDraft() {
  const user = session.user;
  return {
    ...user, username: user.username || user.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() || 'creator',
    bio: user.bio ?? 'Crafting social connections & exploring new ideas.',
    avatar: user.avatar || avatars[0], interests: user.interests || ['ai', 'design', 'code'], privacy: user.privacy || 'public'
  };
}

function updateProfile(fields) {
  session = { ...session, user: { ...session.user, ...fields } };
  session.jwt = generateMockJWT(session.user);
  authService.saveSession(session);
  const users = authService.getRegisteredUsers().map(user => user.id === session.user.id ? { ...user, ...fields } : user);
  localStorage.setItem('scp_registered_users', JSON.stringify(users));
  socket.start(session);
}

function renderApp() {
  root.classList.toggle('authenticated', !!session?.user.onboardingCompleted);
  if (!session) {
    root.innerHTML = views.authView(authMode, background);
  } else if (!session.user.onboardingCompleted) {
    profileDraft ||= makeProfileDraft();
    root.innerHTML = views.onboardingView(profileDraft, step);
  } else {
    root.innerHTML = views.shellView(session.user, state.tab);
    renderView();
    updateConnection();
  }
}

function renderView() {
  const view = document.getElementById('view');
  if (!view || !session) return;
  const renderers = {
    feed: () => views.feedView(state, session.user),
    explore: () => views.exploreView(state), search: () => views.exploreView(state),
    messages: () => views.messagesView(state, session.user, socket),
    events: () => views.eventsView(state), profile: () => views.profileView(state, session.user),
    notifications: () => views.notificationsView(state)
  };
  view.innerHTML = renderers[state.tab]();
  if (state.tab === 'messages') scrollMessages();
  updateUnread();
}

function navigate(tab) {
  if (!navigation.some(([id]) => id === tab) || !session?.user.onboardingCompleted) return;
  stopRecording(false);
  stopTyping();
  closeDialog();
  state.tab = tab;
  root.querySelectorAll('.nav-button[data-tab]').forEach(button => {
    button.classList.toggle('active', button.dataset.tab === tab);
    if (button.dataset.tab === tab) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  if (tab === 'messages') markAsRead(state.partnerId);
  renderView();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function openDialog(type, html) {
  if (!dialog.open) modalTrigger = document.activeElement;
  dialogType = type;
  dialog.className = type === 'comments' ? 'discussion-dialog' : '';
  dialog.innerHTML = html;
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('dialog-open');
  const focusTarget = dialog.querySelector('input:not([type="radio"]), textarea') || dialog.querySelector('button');
  focusTarget?.focus();
}

function closeDialog() {
  if (!dialog.open) return;
  dialog.close();
  dialogType = '';
  replyingTo = null;
  if (pendingOAuth) {
    pendingOAuth = null;
    sessionStorage.removeItem('scp_pending_oauth');
  }
  document.body.classList.remove('dialog-open');
  if (modalTrigger?.isConnected) modalTrigger.focus();
}

function showComments(postId, preserveDraft = false) {
  const post = state.posts.find(post => post.id === postId);
  if (!post) return;
  const draft = preserveDraft ? dialog.querySelector('#comment-input')?.value || '' : '';
  const currentReply = preserveDraft ? replyingTo : null;
  commentPostId = postId;
  replyingTo = currentReply;
  openDialog('comments', views.commentsView(post, state.comments[postId] || [], session.user));
  dialog.querySelector('#comment-input').value = draft;
  updateReplyBanner();
}

function updateReplyBanner() {
  const banner = document.getElementById('reply-banner');
  if (!banner) return;
  const comment = (state.comments[commentPostId] || []).find(comment => comment.id === replyingTo);
  banner.hidden = !comment;
  banner.querySelector('span').textContent = comment ? `Replying to @${comment.author.handle}` : '';
}

function updatePost(postId) {
  const post = state.posts.find(post => post.id === postId);
  if (!post) return;
  root.querySelectorAll('[data-post]').forEach(element => {
    if (element.dataset.post !== postId) return;
    const focusedAction = element.contains(document.activeElement) ? document.activeElement.dataset.action : null;
    const template = document.createElement('template');
    template.innerHTML = views.postView(post);
    const replacement = template.content.firstElementChild;
    element.replaceWith(replacement);
    if (focusedAction) replacement.querySelector(`[data-action="${focusedAction}"]`)?.focus();
  });
}

function updateConnection() {
  const badge = document.getElementById('connection-status');
  if (badge) {
    badge.textContent = socket.connected ? '● WS Gateway: Live' : '● Offline · local mode';
    badge.classList.toggle('connected', socket.connected);
  }
  const list = document.getElementById('contacts-list');
  if (list) list.innerHTML = views.contactsView(state, socket);
}

function updateUnread() {
  const count = state.messages.filter(message => message.toUserId === session?.user.id && message.status !== 'READ').length;
  const badge = document.getElementById('unread-badge');
  if (badge) { badge.hidden = !count; badge.textContent = count; }
}

function markAsRead(partnerId) {
  state.messages.forEach(message => {
    if (message.fromUserId === partnerId) message.status = 'READ';
  });
  socket.send('message:read', { toUserId: partnerId });
  updateUnread();
  save();
}

function scrollMessages() {
  const thread = document.getElementById('message-thread');
  if (thread) thread.scrollTop = thread.scrollHeight;
}

function appendMessage(message) {
  if (state.tab !== 'messages' || (message.fromUserId !== state.partnerId && message.toUserId !== state.partnerId)) return;
  const thread = document.getElementById('message-thread');
  if (!thread) return;
  thread.querySelector('.empty-state')?.setAttribute('hidden', '');
  thread.insertAdjacentHTML('beforeend', views.messageView(message, session.user.id));
  scrollMessages();
}

function handleSocketEvent(data) {
  if (!session) return;
  switch (data.type) {
    case 'auth:success':
      for (const [id, likes] of Object.entries(data.postLikes || {})) {
        const post = state.posts.find(post => post.id === id);
        if (post) { Object.assign(post, likes); updatePost(id); }
      }
      updateConnection();
      break;
    case 'presence:update':
    case 'connection:closed':
      updateConnection();
      break;
    case 'message:sent': {
      const message = state.messages.find(message => message.id === data.tempId);
      if (message) {
        Object.assign(message, data.message);
        const bubble = document.getElementById('message-thread')?.querySelector(`[data-message="${CSS.escape(data.tempId)}"]`);
        if (bubble) {
          bubble.dataset.message = message.id;
          const status = bubble.querySelector('[data-message-status]');
          if (status) { status.dataset.messageStatus = message.id; status.textContent = message.status; }
        }
      }
      break;
    }
    case 'message:new': {
      const message = data.message;
      if (!message || state.messages.some(existing => existing.id === message.id)) break;
      state.messages.push(message);
      if (state.tab === 'messages' && message.fromUserId === state.partnerId) markAsRead(state.partnerId);
      appendMessage(message);
      updateUnread();
      updateConnection();
      break;
    }
    case 'message:read_receipt':
      state.messages.forEach(message => {
        if (message.toUserId !== data.readByUserId) return;
        message.status = 'READ';
        const status = root.querySelector(`[data-message-status="${CSS.escape(message.id)}"]`);
        if (status) status.textContent = 'READ';
      });
      break;
    case 'typing:indicator': {
      const indicator = document.getElementById('typing-indicator');
      if (indicator && data.fromUserId === state.partnerId) indicator.hidden = !data.isTyping;
      return;
    }
    case 'post:like_update': {
      const post = state.posts.find(post => post.id === data.postId);
      if (post) {
        post.likes = data.likesCount;
        if (data.byUserId === session.user.id) post.liked = data.action === 'liked';
        updatePost(post.id);
      }
      break;
    }
    case 'post:broadcast': {
      const post = data.post;
      if (!post || state.posts.some(existing => existing.id === post.id)) break;
      state.posts.unshift(post);
      if (state.tab === 'feed') document.getElementById('post-stream')?.insertAdjacentHTML('afterbegin', views.postView(post));
      if (['search', 'explore'].includes(state.tab)) updateSearch();
      break;
    }
    case 'notification:new':
      if (!data.notification || state.notifications.some(item => item.id === data.notification.id)) break;
      state.notifications.unshift(data.notification);
      if (state.tab === 'notifications') renderView();
      toast(`${data.notification.name} ${data.notification.action}`);
      break;
    case 'error':
      toast(data.message || 'The gateway could not complete that action.', 'error');
      break;
  }
  save();
}

async function authenticate(form, action) {
  const controls = [...form.querySelectorAll('button, input')];
  const disabled = controls.map(control => control.disabled);
  const submit = form.querySelector('[type="submit"]');
  const label = submit.textContent;
  controls.forEach(control => { control.disabled = true; });
  submit.textContent = 'Please wait…';
  try {
    const result = await action();
    closeDialog();
    session = result;
    state = newState(session.user);
    profileDraft = null;
    step = 1;
    renderApp();
    socket.start(session);
    toast(`Welcome, ${session.user.name}!`, 'success');
  } catch (error) {
    const banner = document.getElementById('auth-error');
    if (banner) { banner.hidden = false; banner.textContent = error.message; }
    toast(error.message, 'error');
  } finally {
    controls.forEach((control, index) => { control.disabled = disabled[index]; });
    submit.textContent = label;
  }
}

function finishOnboarding() {
  const form = document.getElementById('onboarding-form');
  if (step === 1 && form) captureIdentity(form);
  if (step === 3 && form) profileDraft.privacy = new FormData(form).get('privacy') || 'public';
  updateProfile({ ...profileDraft, onboardingCompleted: true });
  renderApp();
  toast('Your profile is ready!', 'success');
}

function captureIdentity(form) {
  const data = new FormData(form);
  profileDraft.name = String(data.get('name') || '').trim() || session.user.name;
  profileDraft.username = String(data.get('username') || '').toLowerCase().replace(/[^a-z0-9_]/g, '') || 'creator';
  profileDraft.bio = String(data.get('bio') || '').trim();
}

function updateSearch() {
  const results = document.getElementById('search-results');
  if (results) results.innerHTML = views.searchResults(state);
}

function stopTyping() {
  clearTimeout(typingTimer);
  if (state?.partnerId) socket.send('typing:stop', { toUserId: state.partnerId });
}

function sendMessage(text, audio = '', partnerId = state.partnerId) {
  if (!text.trim() && !audio) return;
  const message = {
    id: makeId('msg'), fromUserId: session.user.id, toUserId: partnerId,
    senderName: session.user.name, text: text.trim(), audio,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), timestamp: Date.now(),
    status: socket.connected ? 'SENDING' : 'LOCAL'
  };
  state.messages.push(message);
  socket.send('message:send', { toUserId: partnerId, text: message.text, audio, tempId: message.id });
  appendMessage(message);
  state.chatDrafts[partnerId] = '';
  const input = document.getElementById('chat-input');
  if (input) input.value = '';
  stopTyping();
  recordActivity();
  save();
  if (!socket.connected) toast('Saved locally. Start the gateway to send live messages.');
}

async function startRecording() {
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    toast('Voice recording is unavailable in this browser.', 'error');
    return;
  }
  const request = ++recordingRequest;
  const userId = session.user.id;
  const partnerId = state.partnerId;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (request !== recordingRequest || session?.user.id !== userId || state.tab !== 'messages' || state.partnerId !== partnerId) {
      stream.getTracks().forEach(track => track.stop());
      return;
    }
    const chunks = [];
    const recording = new MediaRecorder(stream);
    recorder = recording;
    recording.startedAt = Date.now();
    recording.shouldSend = false;
    recording.addEventListener('dataavailable', event => { if (event.data.size) chunks.push(event.data); });
    recording.addEventListener('stop', async () => {
      stream.getTracks().forEach(track => track.stop());
      if (!recording.shouldSend || session?.user.id !== userId) return;
      const blob = new Blob(chunks, { type: recording.mimeType.split(';')[0] });
      try {
        const audio = await readFile(blob);
        if (session?.user.id === userId) sendMessage('Voice note', audio, partnerId);
      } catch { toast('Could not save the voice note.', 'error'); }
    });
    recording.start();
    document.getElementById('message-form').hidden = true;
    document.getElementById('voice-recorder').hidden = false;
    recordingTimer = setInterval(() => {
      const seconds = Math.floor((Date.now() - recording.startedAt) / 1000);
      const label = document.getElementById('recording-time');
      if (label) label.textContent = `Recording ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
      if (seconds >= 60) stopRecording(true);
    }, 250);
  } catch {
    toast('Microphone access was unavailable. You can still send a text message.', 'error');
  }
}

function stopRecording(send) {
  recordingRequest++;
  clearInterval(recordingTimer);
  if (recorder?.state === 'recording') { recorder.shouldSend = send; recorder.stop(); }
  recorder = null;
  const form = document.getElementById('message-form');
  const bar = document.getElementById('voice-recorder');
  if (form) form.hidden = false;
  if (bar) bar.hidden = true;
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

document.addEventListener('click', async event => {
  const target = event.target.closest('[data-action]');
  if (!target || target.disabled) return;
  const { action, id } = target.dataset;
  switch (action) {
    case 'auth-mode': authMode = authMode === 'signin' ? 'signup' : 'signin'; renderApp(); break;
    case 'password': {
      const input = document.getElementById('password');
      input.type = input.type === 'password' ? 'text' : 'password';
      target.setAttribute('aria-label', input.type === 'password' ? 'Show password' : 'Hide password');
      break;
    }
    case 'more-providers': {
      const expanded = target.getAttribute('aria-expanded') !== 'true';
      root.querySelectorAll('[data-extra-provider]').forEach(button => { button.hidden = !expanded; });
      target.setAttribute('aria-expanded', expanded);
      target.textContent = expanded ? 'View less' : 'View more';
      break;
    }
    case 'background':
      background = background === 'fibers' ? 'silk' : 'fibers';
      setBackground(background);
      try { localStorage.setItem('scp_background', JSON.stringify(background)); } catch { /* Visual preference is optional. */ }
      if (target.classList.contains('background-toggle')) target.querySelector('span').textContent = background === 'fibers' ? 'Ghost Fibers' : 'Silk Gradient';
      break;
    case 'help': openDialog('help', views.helpView()); break;
    case 'close-dialog': closeDialog(); break;
    case 'oauth':
      pendingOAuth = authService.createOAuthRequest(target.dataset.provider, authMode === 'signup');
      openDialog('oauth', views.oauthView(pendingOAuth));
      break;
    case 'avatar': {
      const form = target.closest('form');
      if (form) captureIdentity(form);
      profileDraft.avatar = avatars[Number(target.dataset.index)];
      if (dialogType === 'profile') openDialog('profile', views.editProfileView(profileDraft));
      else renderApp();
      break;
    }
    case 'topic':
      profileDraft.interests = profileDraft.interests.includes(id) ? profileDraft.interests.filter(topic => topic !== id) : [...profileDraft.interests, id];
      renderApp();
      break;
    case 'onboarding-back':
      if (step === 3) profileDraft.privacy = new FormData(document.getElementById('onboarding-form')).get('privacy');
      step--; renderApp(); break;
    case 'skip-onboarding': finishOnboarding(); break;
    case 'navigate': navigate(target.dataset.tab); break;
    case 'create-post': navigate('feed'); document.getElementById('post-composer-input')?.focus(); break;
    case 'menu': openDialog('menu', views.menuView()); break;
    case 'commands': openDialog('commands', views.commandsView()); break;
    case 'signout':
      stopRecording(false); stopTyping(); save(); socket.stop(); closeDialog();
      authService.clearSession(); session = null; profileDraft = null; authMode = 'signin';
      state = newState(); renderApp(); toast('You have been signed out.'); break;
    case 'like': {
      const post = state.posts.find(post => post.id === id);
      if (!post) break;
      post.liked = !post.liked;
      post.likes = Math.max(0, post.likes + (post.liked ? 1 : -1));
      socket.send('post:like', { postId: id, action: post.liked ? 'like' : 'unlike' });
      if (post.liked) recordActivity();
      updatePost(id); save(); break;
    }
    case 'comments': showComments(id); break;
    case 'share': {
      const post = state.posts.find(post => post.id === id);
      if (!post) break;
      try {
        await navigator.clipboard.writeText(`${post.author.name}: ${post.content}`);
        toast('Post copied to clipboard.', 'success');
      } catch { toast('Could not access the clipboard. Select and copy the post text.', 'error'); }
      break;
    }
    case 'follow':
      state.following = state.following.includes(id) ? state.following.filter(personId => personId !== id) : [...state.following, id];
      if (state.following.includes(id)) recordActivity();
      root.querySelectorAll('[data-action="follow"]').forEach(button => {
        const followed = state.following.includes(button.dataset.id);
        button.textContent = followed ? 'Connected' : 'Connect';
        button.classList.toggle('selected', followed);
        button.setAttribute('aria-pressed', followed);
      });
      save(); break;
    case 'search-topic':
      state.searchQuery = target.dataset.query;
      if (!['search', 'explore'].includes(state.tab)) navigate('search');
      else { document.getElementById('search-input').value = state.searchQuery; updateSearch(); }
      break;
    case 'partner':
      stopTyping(); stopRecording(false); state.partnerId = id; navigate('messages');
      document.getElementById('chat-input')?.focus(); break;
    case 'rsvp': {
      const item = state.events.find(item => item.id === id);
      item.rsvpd = !item.rsvpd;
      item.attendees += item.rsvpd ? 1 : -1;
      if (item.rsvpd) recordActivity();
      save(); renderView(); toast(item.rsvpd ? `RSVP confirmed for ${item.title}` : 'RSVP cancelled.'); break;
    }
    case 'edit-profile':
      profileDraft = makeProfileDraft(); openDialog('profile', views.editProfileView(profileDraft)); break;
    case 'remove-image': state.postImage = ''; renderView(); break;
    case 'reply': replyingTo = id; updateReplyBanner(); document.getElementById('comment-input')?.focus(); break;
    case 'cancel-reply': replyingTo = null; updateReplyBanner(); break;
    case 'emoji': {
      const input = document.getElementById('comment-input');
      input.value = (input.value + target.dataset.emoji).slice(0, 2000); input.focus(); break;
    }
    case 'like-comment': {
      const comment = state.comments[commentPostId]?.find(comment => comment.id === id);
      if (comment) { comment.liked = !comment.liked; comment.likes += comment.liked ? 1 : -1; save(); showComments(commentPostId, true); }
      break;
    }
    case 'delete-comment': {
      const comments = state.comments[commentPostId] || [];
      const parent = comments.find(comment => comment.id === target.dataset.parent);
      const list = parent ? parent.replies : comments;
      const index = list.findIndex(comment => comment.id === id && comment.author.id === session.user.id);
      if (index !== -1) {
        const [removed] = list.splice(index, 1);
        const post = state.posts.find(post => post.id === commentPostId);
        post.comments = Math.max(0, post.comments - 1 - (removed.replies?.length || 0));
        if (replyingTo === id) replyingTo = null;
        save(); updatePost(commentPostId); showComments(commentPostId, true);
      }
      break;
    }
    case 'record': await startRecording(); break;
    case 'send-recording': stopRecording(true); break;
    case 'cancel-recording': stopRecording(false); break;
  }
});

document.addEventListener('submit', async event => {
  const form = event.target;
  event.preventDefault();
  const data = new FormData(form);
  switch (form.id) {
    case 'auth-form': {
      if (form.dataset.mode === 'signin' && document.getElementById('password-group').hidden) {
        document.getElementById('password-group').hidden = false;
        const password = document.getElementById('password');
        password.disabled = false; password.required = true; password.focus();
        return;
      }
      const email = data.get('email');
      const password = data.get('password');
      await authenticate(form, () => form.dataset.mode === 'signup'
        ? authService.signUpWithEmail({ name: data.get('name'), email, password })
        : authService.signInWithEmail(email, password));
      break;
    }
    case 'oauth-form': {
      const pending = pendingOAuth;
      if (!pending) return;
      await authenticate(form, () => authService.completeOAuthFlow(pending.provider, { name: data.get('oauth-name'), email: data.get('oauth-email') }, pending.isSignUp));
      break;
    }
    case 'onboarding-form':
      if (step === 1) captureIdentity(form);
      if (step === 2 && profileDraft.interests.length < 3) return;
      if (step === 3) finishOnboarding();
      else { step++; renderApp(); }
      break;
    case 'reset-form': {
      const submit = form.querySelector('button');
      submit.disabled = true;
      try {
        await authService.requestPasswordReset(data.get('reset-email'));
        document.getElementById('reset-result').textContent = 'Demo reset request recorded. No email has been sent.';
      } catch (error) { toast(error.message, 'error'); }
      finally { submit.disabled = false; }
      break;
    }
    case 'post-form': {
      const content = String(data.get('content') || '').trim();
      if (!content && !state.postImage) return;
      const user = session.user;
      const post = { id: makeId('post'), author: { id: user.id, name: user.name, handle: user.username || 'user', avatar: user.avatar, role: user.role }, content, image: state.postImage, likes: 0, comments: 0, liked: false, timestamp: 'Just now', tags: user.interests || [], createdAt: Date.now() };
      state.posts.unshift(post); state.postDraft = ''; state.postImage = '';
      socket.send('post:new', { post }); recordActivity(); save(); renderView();
      toast(socket.connected ? 'Post published to the live feed!' : 'Post saved to your local feed.', 'success');
      break;
    }
    case 'message-form': sendMessage(String(data.get('message') || '')); break;
    case 'profile-form':
      captureIdentity(form); updateProfile(profileDraft); closeDialog(); renderApp(); toast('Profile updated.', 'success'); break;
    case 'comment-form': {
      const content = String(data.get('content') || '').trim();
      if (!content) return;
      const user = session.user;
      const comment = { id: makeId('comment'), author: { id: user.id, name: user.name, handle: user.username || 'user', avatar: user.avatar }, content, timestamp: 'Just now', likes: 0, liked: false, replies: [] };
      const comments = state.comments[commentPostId] ||= [];
      const parent = comments.find(comment => comment.id === replyingTo);
      if (parent) parent.replies.push(comment);
      else comments.push(comment);
      state.posts.find(post => post.id === commentPostId).comments++;
      replyingTo = null; recordActivity(); save(); updatePost(commentPostId); showComments(commentPostId);
      const list = document.getElementById('comments-list'); list.scrollTop = list.scrollHeight;
      break;
    }
  }
});

document.addEventListener('input', event => {
  const input = event.target;
  if (input.id === 'post-composer-input') {
    state.postDraft = input.value;
    document.querySelector('#post-form [type="submit"]').disabled = !input.value.trim() && !state.postImage;
  }
  if (input.id === 'chat-input') {
    state.chatDrafts[state.partnerId] = input.value;
    socket.send('typing:start', { toUserId: state.partnerId });
    clearTimeout(typingTimer); typingTimer = setTimeout(stopTyping, 1400);
  }
  if (input.id === 'search-input') { state.searchQuery = input.value; updateSearch(); }
  if (input.id === 'command-input') document.getElementById('command-results').innerHTML = views.commandResults(input.value);
  if (input.id === 'password' && authMode === 'signup') {
    const score = [input.value.length >= 8, /[0-9]/.test(input.value), /[A-Z]/.test(input.value), /[^A-Za-z0-9]/.test(input.value)].filter(Boolean).length;
    const strength = document.getElementById('password-strength');
    if (strength) strength.textContent = input.value ? `Strength: ${['Weak', 'Fair', 'Good', 'Strong'][Math.max(0, score - 1)]}` : '';
  }
  if (input.closest('#onboarding-form, #profile-form') && ['name', 'username', 'bio'].includes(input.name)) {
    if (input.name === 'username') input.value = input.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    profileDraft[input.name] = input.value;
    const preview = document.getElementById(`preview-${input.name === 'username' ? 'handle' : input.name}`);
    if (preview) preview.textContent = `${input.name === 'username' ? '@' : ''}${input.value}`;
  }
});

document.addEventListener('change', async event => {
  if (event.target.name === 'privacy') {
    profileDraft.privacy = event.target.value;
    root.querySelectorAll('.privacy-option').forEach(option => option.classList.toggle('selected', option.querySelector('input').checked));
  }
  if (event.target.id !== 'post-photo') return;
  const file = event.target.files[0];
  if (!file) return;
  if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type) || file.size > 2 * 1024 * 1024) {
    toast('Choose a PNG, JPEG, WebP, or GIF image smaller than 2 MB.', 'error');
    return;
  }
  const userId = session?.user.id;
  try {
    const image = await readFile(file);
    if (session?.user.id !== userId) return;
    state.postImage = image;
    if (state.tab === 'feed') renderView();
  } catch { toast('Could not read this image.', 'error'); }
});

document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k' && session?.user.onboardingCompleted) {
    event.preventDefault();
    if (dialogType === 'commands') closeDialog();
    else openDialog('commands', views.commandsView());
  }
  if (dialogType !== 'commands') return;
  const options = [...dialog.querySelectorAll('.command-option')];
  const index = options.indexOf(document.activeElement);
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    const next = event.key === 'ArrowDown' ? (index + 1) % options.length : (index - 1 + options.length) % options.length;
    options[next]?.focus();
  }
  if (event.key === 'Enter' && document.activeElement.id === 'command-input') { event.preventDefault(); options[0]?.click(); }
});

dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog();
});
document.addEventListener('error', event => {
  if (event.target instanceof HTMLImageElement && !event.target.src.endsWith('/logo.png')) event.target.src = './assets/logo.png';
}, true);
window.addEventListener('pagehide', () => { stopRecording(false); socket.stop(); });
window.addEventListener('pageshow', event => { if (event.persisted && session) socket.start(session); });

state = newState(session?.user);
setBackground(background);
renderApp();
if (session) socket.start(session);
