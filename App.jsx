import { useEffect, useMemo, useState } from 'react'
import {
  Radio, Waves, Map, MessageCircle, UserRound, Sparkles, Search, Bell, Navigation, Users, Heart,
  Send, LogIn, LogOut, Plus, X, RefreshCw, Settings, Shield, SlidersHorizontal, Copyright, FileText,
  Video, Image as ImageIcon, Mic, Eye, EyeOff, ChevronRight, Flag, UserPlus, UserCheck, Check,
  Clock3, Globe2, MapPin, Play, MoreHorizontal, CircleDollarSign, Lock, CheckCircle2
} from 'lucide-react'
import {
  getCurrentUser, ensureUserDocument, getUserProfile, updateUserProfile, listMoments, listUsers,
  listNotifications, listUserMoments, createMoment, joinMoment, reactToMoment, addComment, listComments,
  followUser, unfollowUser, isFollowing, listActivity, login, register, logout, uploadMedia, createReport
} from './services/appwrite'
import { AdBanner320, AdBanner300 } from './ads/Ads'
import worldSymbol from '/world-symbol.jpg'
import worldWordmark from '/world-wordmark.jpg'
import WorldPlay from './games/WorldPlay'

const tabs = [
  { id: 'now', label: 'NOW', icon: Radio }, { id: 'flow', label: 'FLOW', icon: Waves },
  { id: 'scenes', label: 'SCENES', icon: Map }, { id: 'talk', label: 'TALK', icon: MessageCircle },
  { id: 'space', label: 'SPACE', icon: UserRound }, { id: 'play', label: 'PLAY', icon: Play }
]
const categories = ['do', 'play', 'people', 'event']
const defaultSettings = { privateAccount: false, ghostMode: false, notifyJoins: true, notifyReactions: true, notifyComments: true, personalizedDiscovery: true, originalContent: true }

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [tab, setTab] = useState('now'), [user, setUser] = useState(null), [moments, setMoments] = useState([])
  const [profiles, setProfiles] = useState({}), [loading, setLoading] = useState(true), [refreshing, setRefreshing] = useState(false)
  const [authOpen, setAuthOpen] = useState(false), [createOpen, setCreateOpen] = useState(false), [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false), [settingsOpen, setSettingsOpen] = useState(false), [notice, setNotice] = useState('')

  const load = async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const current = await getCurrentUser(); setUser(current)
      if (current) await ensureUserDocument(current)
      const ms = await listMoments(); setMoments(ms)
      const ids = [...new Set(ms.map(m => m.ownerId).filter(Boolean))], ps = {}
      await Promise.all(ids.map(async id => { try { ps[id] = await getUserProfile(id) } catch {} }))
      setProfiles(ps)
    } catch (e) { setNotice(e?.message || 'WORLD could not load live data.') }
    finally { if (!silent) setLoading(false) }
  }
  useEffect(() => { load() }, [])
  useEffect(() => { const t = window.setTimeout(() => setShowSplash(false), 2300); return () => window.clearTimeout(t) }, [])

  const requireUser = () => { if (!user) { setAuthOpen(true); return false } return true }
  const refresh = async () => { setRefreshing(true); try { await load(); setNotice('WORLD refreshed.') } finally { setRefreshing(false) } }
  const join = async id => { if (!requireUser()) return; try { await joinMoment(id, user.$id); setNotice('You joined this Moment.'); await load(true) } catch (e) { setNotice(e?.message || 'Join failed.') } }
  const react = async id => { if (!requireUser()) return; try { await reactToMoment(id, user.$id); setNotice('Reaction added.'); await load(true) } catch (e) { setNotice(e?.message || 'Reaction failed.') } }
  const comment = async (id, text) => { if (!requireUser()) return; try { await addComment(id, user.$id, text); setNotice('Comment added.'); await load(true) } catch (e) { setNotice(e?.message || 'Comment failed.') } }

  return <div className="app">
    {showSplash && <WorldSplash />}
    <header className="topbar">
      <button className="brand" onClick={() => setTab('now')} aria-label="WORLD home"><img src={worldWordmark} alt="WORLD" className="brand-logo" /></button>
      <div className="top-actions">
        <button className="icon-btn" onClick={refresh} title="Refresh"><RefreshCw className={refreshing ? 'spin' : ''} size={18}/></button>
        <button className="icon-btn" onClick={() => setSearchOpen(true)} title="Search"><Search size={19}/></button>
        <button className="icon-btn" onClick={() => setNotificationsOpen(true)} title="Notifications"><Bell size={19}/></button>
      </div>
    </header>
    {notice && <div className="notice"><span>{notice}</span><button onClick={() => setNotice('')}><X size={15}/></button></div>}
    <main>
      {tab === 'now' && <Now moments={moments} profiles={profiles} loading={loading} onJoin={join} onReact={react} onComment={comment} onCreate={() => requireUser() && setCreateOpen(true)} />}
      {tab === 'flow' && <Feed moments={moments} profiles={profiles} onJoin={join} onReact={react} onComment={comment} />}
      {tab === 'scenes' && <Scenes moments={moments} profiles={profiles} />}
      {tab === 'talk' && <Talk moments={moments} profiles={profiles} user={user} onAuth={() => setAuthOpen(true)} onComment={comment} />}
      {tab === 'play' && <WorldPlay />}
      {tab === 'space' && <Space user={user} onAuth={() => setAuthOpen(true)} onLogout={async () => { await logout(); setUser(null); setNotice('Signed out.'); }} onSettings={() => setSettingsOpen(true)} />}
    </main>
    <button className="spark" onClick={() => requireUser() && setCreateOpen(true)}><Sparkles size={20}/><span>SPARK</span></button>
    <nav className="nav">{tabs.map(({ id, label, icon: Icon }) => <button key={id} className={tab === id ? 'nav-item active' : 'nav-item'} onClick={() => setTab(id)}><Icon size={20}/><span>{label}</span></button>)}</nav>
    {authOpen && <Auth onClose={() => setAuthOpen(false)} onDone={async u => { setUser(u); setAuthOpen(false); await load() }} />}
    {searchOpen && <SearchPanel moments={moments} profiles={profiles} onClose={() => setSearchOpen(false)} onOpenMoment={id => { setSearchOpen(false); setTab('now'); setTimeout(() => document.getElementById(`moment-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50) }} />}
    {notificationsOpen && <NotificationsPanel user={user} onClose={() => setNotificationsOpen(false)} />}
    {settingsOpen && <SettingsPanel user={user} onClose={() => setSettingsOpen(false)} />}
    {createOpen && <CreateMoment user={user} onClose={() => setCreateOpen(false)} onDone={async () => { setCreateOpen(false); await load(); setNotice('Moment created and live.'); }} />}
  </div>
}

function WorldSplash() {
  return <div className="world-splash" aria-hidden="true">
    <div className="splash-glow" />
    <div className="splash-logo-wrap">
      <img src={worldSymbol} alt="WORLD" className="splash-logo" />
    </div>
    <div className="splash-word">WORLD</div>
    <div className="splash-line" />
    <div className="splash-tag">BE THERE</div>
  </div>
}

function Title({ eyebrow, title, action }) { return <div className="section-title"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1></div>{action}</div> }

function Now({ moments, profiles, loading, onJoin, onReact, onComment, onCreate }) {
  return <div className="page">
    <section className="hero"><div className="hero-copy"><span className="live-pill"><i/> HAPPENING NOW</span><h1>Be where<br/><em>life is.</em></h1><p>Discover real Moments happening now — around you or anywhere in the WORLD.</p><button className="primary" onClick={() => document.getElementById('live-layer')?.scrollIntoView({ behavior: 'smooth' })}><Navigation size={17}/> Explore live</button></div><div className="orbital"><div className="orbit o1"/><div className="orbit o2"/><div className="orbital-core"><Globe2 size={28}/></div></div></section>
    <div id="live-layer"><Title eyebrow="LIVE LAYER" title="Right now"/><div className="moment-list">{loading ? <div className="loading">Loading live Moments…</div> : moments.length ? moments.map((m, i) => <div key={m.$id}><MomentCard id={`moment-${m.$id}`} m={m} profile={profiles[m.ownerId]} onJoin={onJoin} onReact={onReact} onComment={onComment}/>{i === 1 && <AdBanner320/>}</div>) : <EmptyLive onCreate={onCreate}/>}</div></div>
  </div>
}
function EmptyLive({ onCreate }) { return <div className="empty"><Radio size={34}/><h2>No live Moments yet.</h2><p>WORLD shows real activity from real users. Create the first Moment instead of seeing fake activity.</p><button className="primary" onClick={onCreate}><Plus size={17}/> Create Moment</button></div> }
function Feed({ moments, profiles, onJoin, onReact, onComment }) { return <div className="page"><Title eyebrow="LIVE FEED" title="Flow"/><div className="feed-list">{moments.length ? moments.map((m, i) => <div key={m.$id}><MomentCard m={m} profile={profiles[m.ownerId]} onJoin={onJoin} onReact={onReact} onComment={onComment}/>{i === 0 && <AdBanner300/>}</div>) : <div className="empty"><Waves size={34}/><h2>Your Flow is waiting.</h2><p>Only real Moments appear here.</p></div>}</div></div> }

function MomentCard({ m, profile, onJoin, onReact, onComment, id }) {
  const [text, setText] = useState(''), [watch, setWatch] = useState(false), [menu, setMenu] = useState(false)
  const initials = (profile?.displayName || 'W').trim().slice(0, 1).toUpperCase()
  return <article id={id} className="moment">
    <div className="moment-bg" style={m.imageUrl ? { backgroundImage: `url(${m.imageUrl})` } : undefined}/><div className="moment-shade"/>
    <div className="moment-top"><span className="live-pill"><i/> {String(m.category || 'NOW').toUpperCase()}</span><span className="age"><Clock3 size={11}/> {timeAgo(m.$createdAt)}</span></div>
    <div className="moment-bottom">
      <div className="moment-author"><div className="avatar">{initials}</div><span>{profile?.displayName || 'WORLD User'} <small>@{profile?.username || 'world'}</small></span><button className="mini-icon" onClick={() => setMenu(!menu)}><MoreHorizontal size={16}/></button></div>
      {menu && <MomentMenu moment={m} onClose={() => setMenu(false)} />}
      <h2>{m.title}</h2><p>{m.description || 'Live Moment'}</p>
      <div className="card-actions"><button onClick={() => setWatch(true)}><Play size={14}/> Watch</button><button onClick={() => onJoin(m.$id)}><Users size={14}/> {m.participantsCount || 0} Join</button><button onClick={() => onReact(m.$id)}><Heart size={14}/> {m.reactionsCount || 0}</button><span className="count"><MessageCircle size={14}/> {m.commentsCount || 0}</span></div>
      <div className="comment-box"><input value={text} onChange={e => setText(e.target.value)} placeholder="Say something…" maxLength={500}/><button onClick={() => { if (text.trim()) { onComment(m.$id, text.trim()); setText('') } }}><Send size={14}/></button></div>
    </div>
    {watch && <MomentWatch moment={m} profile={profile} onClose={() => setWatch(false)} />}
  </article>
}
function MomentMenu({ moment, onClose }) { return <div className="moment-menu"><div><MapPin size={13}/> {moment.visibility?.toUpperCase() || 'NEARBY'}</div><button onClick={onClose}>Close</button></div> }

function MomentWatch({ moment, profile, onClose }) {
  const [comments, setComments] = useState([]), [loading, setLoading] = useState(true)
  useEffect(() => { listComments(moment.$id).then(setComments).catch(() => setComments([])).finally(() => setLoading(false)) }, [moment.$id])
  return <div className="modal-backdrop" onClick={onClose}><div className="sheet watch-sheet" onClick={e => e.stopPropagation()}><button className="close" onClick={onClose}><X size={19}/></button><div className="eyebrow">LIVE MOMENT</div><h2>{moment.title}</h2><div className="watch-meta"><span>{profile?.displayName || 'WORLD User'}</span><span>·</span><span>{moment.participantsCount || 0} joined</span></div>{moment.imageUrl && <img className="watch-media" src={moment.imageUrl} alt="Moment"/>}<p className="watch-copy">{moment.description || 'No description.'}</p><div className="comment-head"><b>Conversation</b><span>{moment.commentsCount || 0}</span></div>{loading ? <div className="loading compact">Loading…</div> : comments.length ? comments.map(c => <div className="comment-row" key={c.$id}><div className="avatar small">W</div><div><b>WORLD User</b><p>{c.text}</p><small>{timeAgo(c.createdAt || c.$createdAt)}</small></div></div>) : <div className="empty compact"><p>No comments yet.</p></div>}</div></div>
}

function SearchPanel({ moments, profiles, onClose, onOpenMoment }) {
  const [q, setQ] = useState(''), [users, setUsers] = useState([])
  useEffect(() => { let live = true; if (q.trim()) listUsers(q).then(x => live && setUsers(x)).catch(() => live && setUsers([])); else setUsers([]); return () => { live = false } }, [q])
  const results = useMemo(() => moments.filter(m => `${m.title} ${m.description || ''} ${m.category || ''}`.toLowerCase().includes(q.toLowerCase())).slice(0, 12), [moments, q])
  return <div className="modal-backdrop" onClick={onClose}><div className="sheet search-sheet" onClick={e => e.stopPropagation()}><button className="close" onClick={onClose}><X size={19}/></button><div className="eyebrow">DISCOVER</div><h2>Search WORLD</h2><input autoFocus className="field" value={q} onChange={e => setQ(e.target.value)} placeholder="Search Moments, people, categories…"/>{q && results.map(m => <button className="search-result" key={m.$id} onClick={() => onOpenMoment(m.$id)}><b>{m.title}</b><small>{profiles[m.ownerId]?.displayName || 'WORLD User'} · {m.category} · {timeAgo(m.$createdAt)}</small></button>)}{q && users.map(u => <div className="search-result" key={`u-${u.$id}`}><b>{u.displayName || u.username}</b><small>@{u.username}</small></div>)}{q && !results.length && !users.length && <div className="empty compact"><p>No matching live data.</p></div>}{!q && <div className="empty compact"><Search size={25}/><p>Search the live WORLD layer.</p></div>}</div></div>
}

function NotificationsPanel({ user, onClose }) {
  const [items, setItems] = useState([]), [loading, setLoading] = useState(true)
  useEffect(() => { if (!user) { setLoading(false); return } listNotifications(user.$id).then(setItems).catch(() => setItems([])).finally(() => setLoading(false)) }, [user?.$id])
  return <div className="modal-backdrop" onClick={onClose}><div className="sheet" onClick={e => e.stopPropagation()}><button className="close" onClick={onClose}><X size={19}/></button><div className="eyebrow">ACTIVITY</div><h2>Notifications</h2>{!user ? <div className="empty compact"><p>Sign in to see your notifications.</p></div> : loading ? <div className="loading compact">Loading…</div> : items.length ? items.map((x, i) => <div className="activity-row" key={`${x.$id}-${i}`}><Bell size={15}/><div><b>{x._type === 'joined' ? 'Someone joined your Moment' : x._type === 'reacted' ? 'Someone reacted to your Moment' : 'Someone commented on your Moment'}</b><small>{x.momentTitle || x.text || x.type || 'New activity'} · {timeAgo(x.createdAt || x.$createdAt)}</small></div></div>) : <div className="empty compact"><p>No notifications yet.</p></div>}</div></div>
}

function Scenes({ moments, profiles }) {
  const groups = categories.map(c => ({ category: c, items: moments.filter(m => m.category === c) })).filter(x => x.items.length)
  return <div className="page"><Title eyebrow="REAL ACTIVITY" title="Scenes"/><p className="page-intro">Scenes are built from real live Moments. Nothing is seeded as fake activity.</p>{groups.length ? <div className="scene-grid">{groups.map(g => <section className="scene-card" key={g.category}><div><span>SCENE · {g.items.length} LIVE</span><h2>{g.category.toUpperCase()}</h2><div className="scene-items">{g.items.slice(0, 4).map(m => <div key={m.$id}><b>{m.title}</b><small>{profiles[m.ownerId]?.displayName || 'WORLD User'} · {timeAgo(m.$createdAt)}</small></div>)}</div></div></section>)}</div> : <div className="empty"><Map size={34}/><h2>No real Scenes yet.</h2><p>Scenes appear automatically when users create live Moments.</p></div>}</div>
}

function Talk({ moments, profiles, user, onAuth, onComment }) {
  const [text, setText] = useState(''), [selected, setSelected] = useState(moments[0]?.$id || '')
  useEffect(() => { if (!selected && moments[0]) setSelected(moments[0].$id) }, [moments, selected])
  const active = moments.find(m => m.$id === selected) || moments[0]
  return <div className="page"><Title eyebrow="LIVE CONVERSATIONS" title="Talk"/><div className="talk-card"><MessageCircle size={22}/><div><b>Talk around real Moments</b><p>Conversations belong to live activity — no fake rooms.</p></div></div>{active ? <section className="talk-panel"><div className="talk-select"><select className="field" value={active.$id} onChange={e => setSelected(e.target.value)}>{moments.map(m => <option key={m.$id} value={m.$id}>{m.title}</option>)}</select></div><div className="talk-title"><b>{active.title}</b><span>{active.participantsCount || 0} joined</span></div><div className="comment-box large"><input value={text} onChange={e => setText(e.target.value)} placeholder={user ? 'Join the conversation…' : 'Sign in to talk…'}/><button onClick={() => { if (!user) return onAuth(); if (text.trim()) { onComment(active.$id, text.trim()); setText('') } }}><Send size={15}/></button></div></section> : <div className="empty"><MessageCircle size={34}/><h2>No live conversation yet.</h2><p>When real Moments appear, Talk becomes active.</p>{!user && <button className="secondary" onClick={onAuth}><LogIn size={16}/> Sign in</button>}</div>}</div>
}

function Space({ user, onAuth, onLogout, onSettings }) {
  const [profile, setProfile] = useState(null), [editing, setEditing] = useState(false), [moments, setMoments] = useState([]), [activity, setActivity] = useState([]), [busy, setBusy] = useState(false), [notice, setNotice] = useState('')
  const load = async () => { if (!user) return; try { const [p, m, a] = await Promise.all([getUserProfile(user.$id), listUserMoments(user.$id), listActivity(user.$id)]); setProfile(p); setMoments(m); setActivity(a) } catch (e) { setNotice(e?.message || 'Profile load failed') } }
  useEffect(() => { load() }, [user?.$id])
  if (!user) return <div className="page"><Title eyebrow="YOUR WORLD" title="Space"/><div className="empty"><UserRound size={34}/><h2>Your identity starts here.</h2><p>Sign in to create Moments, follow people and manage your WORLD settings.</p><button className="primary" onClick={onAuth}><LogIn size={16}/> Sign in</button></div></div>
  const p = profile || { displayName: user.name || 'WORLD User', username: user.email?.split('@')[0] || 'world', bio: '', followersCount: 0, followingCount: 0, momentsCount: 0, visibility: 'public' }
  return <div className="page"><Title eyebrow="YOUR WORLD" title="Space" action={<button className="secondary" onClick={onSettings}><Settings size={15}/> Settings</button>}/>
    <div className="profile-hero"><div className="profile-avatar large">{(p.displayName || 'W')[0].toUpperCase()}</div><div className="profile-main"><h2>{p.displayName}</h2><div className="handle">@{p.username}</div><p>{p.bio || 'No bio yet.'}</p><div className="stats"><span><b>{p.momentsCount || moments.length || 0}</b> Moments</span><span><b>{p.followersCount || 0}</b> Followers</span><span><b>{p.followingCount || 0}</b> Following</span></div></div><button className="secondary" onClick={() => setEditing(true)}>Edit profile</button></div>
    {notice && <div className="mini-notice">{notice}</div>}
    <CreatorDashboard profile={p} />
    <div className="space-grid"><section><div className="subhead"><b>Your Moments</b><span>{moments.length}</span></div>{moments.length ? moments.map(m => <div className="mini-moment" key={m.$id}><div><b>{m.title}</b><small>{m.category} · {timeAgo(m.$createdAt)}</small></div><span>{m.status}</span></div>) : <div className="empty compact"><p>No Moments created yet.</p></div>}</section><section><div className="subhead"><b>Your activity</b><span>{activity.length}</span></div>{activity.length ? activity.map(a => <div className="activity-row" key={a.$id}><span>{a._type === 'joins' ? <Users size={15}/> : a._type === 'reactions' ? <Heart size={15}/> : <MessageCircle size={15}/>}</span><div><b>{a._type === 'joins' ? 'Joined a Moment' : a._type === 'reactions' ? 'Reacted to a Moment' : 'Commented on a Moment'}</b><small>{a.text || a.type || 'WORLD activity'} · {timeAgo(a.createdAt || a.$createdAt)}</small></div></div>) : <div className="empty compact"><p>Your real activity will appear here.</p></div>}</section></div>
    <button className="secondary signout" onClick={onLogout}><LogOut size={15}/> Sign out</button>
    {editing && <EditProfile profile={p} busy={busy} onClose={() => setEditing(false)} onSave={async data => { setBusy(true); try { await updateUserProfile(user.$id, data); setEditing(false); await load(); setNotice('Profile updated.') } catch (e) { setNotice(e?.message || 'Update failed') } finally { setBusy(false) } }} />}
  </div>
}

function CreatorDashboard({ profile }) {
  const checks = [
    ['Verified account', true], ['Original content enabled', true], ['No serious policy violations', true],
    ['Consistent activity', Number(profile.momentsCount || 0) >= 3], ['Audience threshold', Number(profile.followersCount || 0) >= 1000]
  ]
  const done = checks.filter(x => x[1]).length
  return <section className="creator-card"><div className="creator-top"><div><div className="eyebrow">CREATOR</div><h2>Monetization</h2><p>USA-only launch policy. Eligibility is reviewed; approval and earnings are not guaranteed.</p></div><CircleDollarSign size={28}/></div><div className="creator-progress"><span style={{ width: `${Math.round(done / checks.length * 100)}%` }}/></div><div className="creator-checks">{checks.map(([label, ok]) => <div key={label}><span className={ok ? 'check ok' : 'check'}>{ok ? <Check size={13}/> : <Clock3 size={13}/>}</span><b>{label}</b><small>{ok ? 'Complete' : 'Not yet'}</small></div>)}</div><div className="creator-foot"><span><CheckCircle2 size={15}/> Original content required</span><span><Shield size={15}/> Policy & fraud review</span><span><Globe2 size={15}/> United States only at launch</span></div></section>
}

function EditProfile({ profile, onClose, onSave, busy }) { const [displayName, setDisplayName] = useState(profile.displayName || ''), [username, setUsername] = useState(profile.username || ''), [bio, setBio] = useState(profile.bio || ''), [visibility, setVisibility] = useState(profile.visibility || 'public'), [error, setError] = useState(''); const submit = e => { e.preventDefault(); if (!/^[a-zA-Z0-9_.-]{3,30}$/.test(username)) return setError('Username: 3–30 letters, numbers, _ . or -'); setError(''); onSave({ displayName: displayName.trim(), username: username.trim().toLowerCase(), bio: bio.trim(), visibility }) }; return <div className="modal-backdrop" onClick={onClose}><form className="sheet" onClick={e => e.stopPropagation()} onSubmit={submit}><button type="button" className="close" onClick={onClose}><X size={19}/></button><div className="eyebrow">PROFILE</div><h2>Edit identity</h2><input className="field" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Display name" maxLength="100" required/><input className="field" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" maxLength="30" required/><textarea className="field area" value={bio} onChange={e => setBio(e.target.value)} placeholder="Short bio" maxLength="500"/><select className="field" value={visibility} onChange={e => setVisibility(e.target.value)}><option value="public">PUBLIC</option><option value="friends">FRIENDS</option><option value="private">PRIVATE</option></select>{error && <div className="error">{error}</div>}<button className="primary wide" disabled={busy}>{busy ? 'Saving…' : 'Save profile'}</button></form></div> }

function SettingsPanel({ user, onClose }) {
  const key = user ? `world-settings-${user.$id}` : 'world-settings-guest'
  const [settings, setSettings] = useState(() => { try { return { ...defaultSettings, ...JSON.parse(localStorage.getItem(key) || '{}') } } catch { return defaultSettings } })
  const toggle = k => setSettings(s => { const n = { ...s, [k]: !s[k] }; localStorage.setItem(key, JSON.stringify(n)); return n })
  const [section, setSection] = useState('account')
  const rows = {
    account: [['Account', 'Email, profile and sign-in', UserRound], ['Privacy & Safety', 'Control who can discover you', Shield], ['Content', 'Media and content preferences', SlidersHorizontal], ['Notifications', 'Choose activity alerts', Bell], ['Discovery', 'Personalized live discovery', Sparkles], ['Original Content', 'Creator and originality settings', CheckCircle2], ['Copyright', 'Rights, reports and takedowns', Copyright], ['Moderation', 'Reports, blocks and safety', Flag]]
  }
  const menu = rows.account
  return <div className="modal-backdrop" onClick={onClose}><div className="sheet settings-sheet" onClick={e => e.stopPropagation()}><button className="close" onClick={onClose}><X size={19}/></button><div className="eyebrow">WORLD CONTROL</div><h2>Settings</h2><div className="settings-body"><div className="settings-menu">{menu.map(([label, sub, Icon]) => <button className={section === label.toLowerCase().replaceAll(' ', '-') ? 'selected' : ''} key={label} onClick={() => setSection(label.toLowerCase().replaceAll(' ', '-'))}><Icon size={17}/><span><b>{label}</b><small>{sub}</small></span><ChevronRight size={15}/></button>)}</div><div className="settings-content"><SettingsSection section={section} settings={settings} toggle={toggle} user={user}/></div></div></div></div>
}
function SettingsSection({ section, settings, toggle, user }) {
  if (section === 'account') return <div><h3>Account</h3><p className="muted">{user?.email}</p><div className="setting-note"><Lock size={16}/><span>Password login is enabled. Keep your account credentials private.</span></div></div>
  if (section === 'privacy-&-safety') return <div><h3>Privacy & Safety</h3><SettingToggle label="Private account" desc="Only approved people can discover your profile." value={settings.privateAccount} onClick={() => toggle('privateAccount')}/><SettingToggle label="Ghost mode" desc="Reduce your public presence in the live layer." value={settings.ghostMode} onClick={() => toggle('ghostMode')}/></div>
  if (section === 'content') return <div><h3>Content</h3><div className="setting-note"><Video size={16}/><span>WORLD supports real Moment media. Users control what they publish and should only upload content they have rights to use.</span></div></div>
  if (section === 'notifications') return <div><h3>Notifications</h3><SettingToggle label="Joins" desc="When someone joins your Moment." value={settings.notifyJoins} onClick={() => toggle('notifyJoins')}/><SettingToggle label="Reactions" desc="When someone reacts to your Moment." value={settings.notifyReactions} onClick={() => toggle('notifyReactions')}/><SettingToggle label="Comments" desc="When someone comments on your Moment." value={settings.notifyComments} onClick={() => toggle('notifyComments')}/></div>
  if (section === 'discovery') return <div><h3>Discovery</h3><SettingToggle label="Personalized discovery" desc="Use your activity to tailor the live layer on this device." value={settings.personalizedDiscovery} onClick={() => toggle('personalizedDiscovery')}/></div>
  if (section === 'original-content') return <div><h3>Original Content</h3><SettingToggle label="Original-content preference" desc="Creator monetization requires original or properly licensed content." value={settings.originalContent} onClick={() => toggle('originalContent')}/><div className="setting-note"><CheckCircle2 size={16}/><span>Do not repost copyrighted material without permission.</span></div></div>
  if (section === 'copyright') return <div><h3>Copyright</h3><div className="setting-note"><Copyright size={16}/><span>Use the report system for content you believe infringes your rights. Keep evidence and ownership records.</span></div></div>
  return <div><h3>Moderation</h3><div className="setting-note"><Flag size={16}/><span>Report harmful or abusive Moments. WORLD can use reports for moderation review.</span></div></div>
}
function SettingToggle({ label, desc, value, onClick }) { return <button className="setting-toggle" onClick={onClick}><span><b>{label}</b><small>{desc}</small></span><span className={value ? 'switch on' : 'switch'}><i/></span></button> }

function Auth({ onClose, onDone }) { const [mode, setMode] = useState('login'), [name, setName] = useState(''), [email, setEmail] = useState(''), [password, setPassword] = useState(''), [error, setError] = useState(''), [busy, setBusy] = useState(false); const submit = async e => { e.preventDefault(); setError(''); setBusy(true); try { if (mode === 'login') await login(email, password); else await register(email, password, name); const u = await getCurrentUser(); await onDone(u) } catch (err) { setError(err?.message || 'Authentication failed') } finally { setBusy(false) } }; return <div className="modal-backdrop" onClick={onClose}><form className="sheet" onClick={e => e.stopPropagation()} onSubmit={submit}><button type="button" className="close" onClick={onClose}><X size={19}/></button><div className="eyebrow">WORLD ACCOUNT</div><h2>{mode === 'login' ? 'Welcome back' : 'Join WORLD'}</h2><p>Use Email + Password to access the real live layer.</p>{mode === 'register' && <input className="field" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required/>}<input className="field" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required/><input className="field" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" minLength="8" required/>{error && <div className="error">{error}</div>}<button className="primary wide" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button><button type="button" className="switch" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Create a new account' : 'Already have an account? Sign in'}</button></form></div> }

function CreateMoment({ user, onClose, onDone }) {
  const [title, setTitle] = useState(''), [description, setDescription] = useState(''), [category, setCategory] = useState('do'), [visibility, setVisibility] = useState('nearby'), [expires, setExpires] = useState('2'), [file, setFile] = useState(null), [busy, setBusy] = useState(false), [error, setError] = useState('')
  const submit = async e => { e.preventDefault(); setBusy(true); setError(''); try { let imageUrl = ''; if (file) imageUrl = await uploadMedia(file); await createMoment(user.$id, { title, description, category, visibility, imageUrl, expiresAt: new Date(Date.now() + Number(expires) * 60 * 60 * 1000).toISOString() }); await onDone() } catch (err) { setError(err?.message || 'Could not create Moment. Check Appwrite permissions and collection IDs.') } finally { setBusy(false) } }
  return <div className="modal-backdrop" onClick={onClose}><form className="sheet create-sheet" onClick={e => e.stopPropagation()} onSubmit={submit}><button type="button" className="close" onClick={onClose}><X size={19}/></button><div className="eyebrow">CREATE</div><h2>Make a Moment</h2><p>Publish something real that is happening now. It expires automatically.</p><input className="field" value={title} onChange={e => setTitle(e.target.value)} placeholder="What is happening?" maxLength="200" required/><textarea className="field area" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe it…" maxLength="2000"/><div className="create-row"><select className="field" value={category} onChange={e => setCategory(e.target.value)}>{categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}</select><select className="field" value={visibility} onChange={e => setVisibility(e.target.value)}><option value="nearby">NEARBY</option><option value="city">CITY</option><option value="world">WORLD</option><option value="friends">FRIENDS</option></select></div><select className="field" value={expires} onChange={e => setExpires(e.target.value)}><option value="0.5">30 MINUTES</option><option value="2">2 HOURS</option><option value="24">24 HOURS</option></select><label className="upload-field"><ImageIcon size={17}/><span>{file ? file.name : 'Add image / video / audio'}</span><input type="file" accept="image/*,video/*,audio/*" onChange={e => setFile(e.target.files?.[0] || null)}/></label>{file && <div className="media-note"><FileText size={14}/> {file.type || 'Media'} · {(file.size / 1024 / 1024).toFixed(1)} MB</div>}{error && <div className="error">{error}</div>}<button className="primary wide" disabled={busy}><Plus size={17}/>{busy ? 'Publishing…' : 'Publish Moment'}</button></form></div>
}

function timeAgo(date) { if (!date) return 'now'; const min = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 60000)); if (min < 1) return 'now'; if (min < 60) return `${min}m`; const h = Math.floor(min / 60); if (h < 24) return `${h}h`; return `${Math.floor(h / 24)}d` }
