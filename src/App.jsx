import { useEffect, useState } from 'react'
import { Radio, Waves, Map, MessageCircle, UserRound, Sparkles, Search, Bell, Navigation, Users, Heart, Send, LogIn, LogOut, Plus, X, RefreshCw } from 'lucide-react'
import { getCurrentUser, ensureUserDocument, listMoments, createMoment, joinMoment, reactToMoment, addComment, login, register, logout } from './services/appwrite'

const tabs = [
  { id: 'now', label: 'NOW', icon: Radio },
  { id: 'flow', label: 'FLOW', icon: Waves },
  { id: 'scenes', label: 'SCENES', icon: Map },
  { id: 'talk', label: 'TALK', icon: MessageCircle },
  { id: 'space', label: 'SPACE', icon: UserRound }
]

export default function App() {
  const [tab, setTab] = useState('now')
  const [user, setUser] = useState(null)
  const [moments, setMoments] = useState([])
  const [authOpen, setAuthOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const current = await getCurrentUser()
      setUser(current)
      if (current) await ensureUserDocument(current)
      setMoments(await listMoments())
    } catch (e) {
      setNotice(e?.message || 'Appwrite connection error')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const requireUser = () => { if (!user) { setAuthOpen(true); return false } return true }
  const join = async id => { if (!requireUser()) return; try { await joinMoment(id, user.$id); setNotice('You joined the Moment.'); await load() } catch (e) { setNotice(e?.message || 'Join failed') } }
  const react = async id => { if (!requireUser()) return; try { await reactToMoment(id, user.$id); setNotice('Reaction added.'); await load() } catch (e) { setNotice(e?.message || 'Reaction failed') } }
  const comment = async (id, text) => { if (!requireUser()) return; try { await addComment(id, user.$id, text); setNotice('Comment added.'); await load() } catch (e) { setNotice(e?.message || 'Comment failed') } }

  return <div className="app">
    <header className="topbar">
      <button className="brand" onClick={() => setTab('now')}><span className="brand-mark"><span /></span><b>WORLD</b></button>
      <div className="top-actions"><button className="icon-btn" onClick={load} title="Refresh"><RefreshCw size={18}/></button><button className="icon-btn" title="Search"><Search size={19}/></button><button className="icon-btn" title="Notifications"><Bell size={19}/></button></div>
    </header>
    {notice && <div className="notice">{notice}<button onClick={() => setNotice('')}><X size={15}/></button></div>}
    <main>
      {tab === 'now' && <Now moments={moments} loading={loading} onJoin={join} onReact={react} onComment={comment} onCreate={() => requireUser() && setCreateOpen(true)} />}
      {tab === 'flow' && <Feed moments={moments} onJoin={join} onReact={react} onComment={comment} />}
      {tab === 'scenes' && <Scenes />}
      {tab === 'talk' && <Talk user={user} onAuth={() => setAuthOpen(true)} />}
      {tab === 'space' && <Space user={user} onAuth={() => setAuthOpen(true)} onLogout={async () => { await logout(); setUser(null); setNotice('Signed out.'); }} />}
    </main>
    <button className="spark" onClick={() => requireUser() && setCreateOpen(true)}><Sparkles size={20}/><span>SPARK</span></button>
    <nav className="nav">{tabs.map(({id,label,icon:Icon}) => <button key={id} className={tab === id ? 'nav-item active' : 'nav-item'} onClick={() => setTab(id)}><Icon size={20}/><span>{label}</span></button>)}</nav>
    {authOpen && <Auth onClose={() => setAuthOpen(false)} onDone={async u => { setUser(u); setAuthOpen(false); await load() }} />}
    {createOpen && <CreateMoment user={user} onClose={() => setCreateOpen(false)} onDone={async () => { setCreateOpen(false); await load(); setNotice('Moment created.') }} />}
  </div>
}

function Title({eyebrow, title}) { return <div className="section-title"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1></div></div> }

function Now({moments, loading, onJoin, onReact, onComment, onCreate}) {
  return <div className="page"><section className="hero"><div className="hero-copy"><span className="live-pill"><i/> HAPPENING NOW</span><h1>Be where<br/><em>life is.</em></h1><p>Discover what is happening around you — or anywhere in the WORLD.</p><button className="primary" onClick={() => document.getElementById('live-layer')?.scrollIntoView({behavior:'smooth'})}><Navigation size={17}/> Explore live</button></div><div className="orbital"><div className="orbit o1"/><div className="orbit o2"/><div className="orbital-core"><Radio size={28}/></div></div></section><div id="live-layer"><Title eyebrow="LIVE LAYER" title="Right now"/><div className="moment-list">{loading ? <div className="loading">Loading Moments…</div> : moments.length ? moments.map(m => <MomentCard key={m.$id} m={m} onJoin={onJoin} onReact={onReact} onComment={onComment}/>) : <div className="empty"><Radio size={34}/><h2>No live Moments yet.</h2><p>Be the first person to create one.</p><button className="primary" onClick={onCreate}><Plus size={17}/> Create Moment</button></div>}</div></div></div>
}

function Feed({moments, onJoin, onReact, onComment}) { return <div className="page"><Title eyebrow="LIVE FEED" title="Flow"/>{moments.length ? moments.map(m => <MomentCard key={m.$id} m={m} onJoin={onJoin} onReact={onReact} onComment={onComment}/>) : <div className="empty"><Waves size={34}/><h2>Your Flow is waiting.</h2><p>New Moments will appear here.</p></div>}</div> }

function MomentCard({m, onJoin, onReact, onComment}) {
  const [text, setText] = useState('')
  return <article className="moment"><div className="moment-bg"/><div className="moment-shade"/><div className="moment-top"><span className="live-pill">{m.category || 'NOW'}</span><span className="age">{timeAgo(m.$createdAt)}</span></div><div className="moment-bottom"><h2>{m.title}</h2><p>{m.description || 'Live Moment'}</p><div className="card-actions"><button onClick={() => onJoin(m.$id)}><Users size={14}/> {m.participantsCount || 0} Join</button><button onClick={() => onReact(m.$id)}><Heart size={14}/> {m.reactionsCount || 0}</button></div><div className="comment-box"><input value={text} onChange={e => setText(e.target.value)} placeholder="Say something…"/><button onClick={() => { if (text.trim()) { onComment(m.$id, text.trim()); setText('') } }}><Send size={14}/></button></div></div></article>
}

function timeAgo(date) { if (!date) return 'now'; const min = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 60000)); return min < 1 ? 'now' : min < 60 ? `${min}m` : `${Math.floor(min/60)}h` }
function Scenes() { return <div className="page"><Title eyebrow="PLACES + EVENTS" title="Scenes"/><div className="scene-grid">{['Karachi nights','Istanbul after dark','Seoul creative district','Lisbon street life'].map((x,i)=><div className={`scene-card s${i}`} key={x}><div><span>SCENE</span><h2>{x}</h2><p>Discover what is happening</p></div></div>)}</div></div> }
function Talk({user,onAuth}) { return <div className="page"><Title eyebrow="CONVERSATIONS" title="Talk"/><div className="talk-card"><div className="avatar">W</div><div><b>Welcome to WORLD</b><p>Join Moments and Scenes to start talking.</p></div></div><div className="empty"><MessageCircle size={34}/><h2>Find your people.</h2><p>{user ? 'You are signed in.' : 'Sign in to participate in conversations.'}</p>{!user&&<button className="secondary" onClick={onAuth}><LogIn size={16}/> Continue</button>}</div></div> }
function Space({user,onAuth,onLogout}) { return <div className="page"><Title eyebrow="YOUR WORLD" title="Space"/><div className="profile-card"><div className="profile-avatar">{user?.name?.[0]?.toUpperCase() || 'W'}</div><div><h2>{user?.name || 'Your Space'}</h2><p>{user?.email || 'Create your identity on WORLD'}</p></div>{user?<button className="secondary" onClick={onLogout}><LogOut size={15}/> Sign out</button>:<button className="secondary" onClick={onAuth}><LogIn size={15}/> Sign in</button>}</div></div> }

function Auth({onClose,onDone}) { const [mode,setMode]=useState('login'),[name,setName]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false); const submit=async e=>{e.preventDefault();setError('');setBusy(true);try{if(mode==='login')await login(email,password);else await register(email,password,name);const u=await getCurrentUser();await onDone(u)}catch(err){setError(err?.message||'Authentication failed')}finally{setBusy(false)}};return <div className="modal-backdrop" onClick={onClose}><form className="sheet" onClick={e=>e.stopPropagation()} onSubmit={submit}><button type="button" className="close" onClick={onClose}><X size={19}/></button><div className="eyebrow">WORLD ACCOUNT</div><h2>{mode==='login'?'Welcome back':'Join WORLD'}</h2><p>Sign in to create and join live Moments.</p>{mode==='register'&&<input className="field" value={name} onChange={e=>setName(e.target.value)} placeholder="Name" required/>}<input className="field" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required/><input className="field" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" minLength="8" required/>{error&&<div className="error">{error}</div>}<button className="primary wide" disabled={busy}>{busy?'Please wait…':mode==='login'?'Sign in':'Create account'}</button><button type="button" className="switch" onClick={()=>setMode(mode==='login'?'register':'login')}>{mode==='login'?'Create a new account':'Already have an account? Sign in'}</button></form></div> }

function CreateMoment({user,onClose,onDone}) { const [title,setTitle]=useState(''),[description,setDescription]=useState(''),[category,setCategory]=useState('do'),[visibility,setVisibility]=useState('nearby'),[busy,setBusy]=useState(false),[error,setError]=useState('');const submit=async e=>{e.preventDefault();setBusy(true);setError('');try{await createMoment(user.$id,{title,description,category,visibility});await onDone()}catch(err){setError(err?.message||'Could not create Moment')}finally{setBusy(false)}};return <div className="modal-backdrop" onClick={onClose}><form className="sheet" onClick={e=>e.stopPropagation()} onSubmit={submit}><button type="button" className="close" onClick={onClose}><X size={19}/></button><div className="eyebrow">CREATE A MOMENT</div><h2>What is happening?</h2><p>Share a temporary signal with the WORLD.</p><input className="field" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Moment title" maxLength="200" required/><textarea className="field area" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Describe it…" maxLength="2000"/><select className="field" value={category} onChange={e=>setCategory(e.target.value)}><option value="do">DO</option><option value="play">PLAY</option><option value="people">PEOPLE</option><option value="event">EVENT</option></select><select className="field" value={visibility} onChange={e=>setVisibility(e.target.value)}><option value="nearby">NEARBY</option><option value="city">CITY</option><option value="world">WORLD</option><option value="friends">FRIENDS</option></select>{error&&<div className="error">{error}</div>}<button className="primary wide" disabled={busy}><Plus size={17}/>{busy?'Creating…':'Create Moment'}</button></form></div> }
