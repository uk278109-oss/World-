import { useEffect, useState } from 'react'
import {
  Radio, Waves, Map, MessageCircle, UserRound, Sparkles, Search,
  Bell, Navigation, Play, Users, Clock3, ArrowUpRight, Plus,
  X, LogIn, Download
} from 'lucide-react'
import { getCurrentUser } from './services/appwrite'

const tabs = [
  { id: 'now', label: 'NOW', icon: Radio },
  { id: 'flow', label: 'FLOW', icon: Waves },
  { id: 'scenes', label: 'SCENES', icon: Map },
  { id: 'talk', label: 'TALK', icon: MessageCircle },
  { id: 'space', label: 'SPACE', icon: UserRound }
]

const moments = [
  { type:'LIVE', title:'Night market is moving', place:'Istanbul, Türkiye', viewers:'1.8K', age:'now', tag:'street', gradient:'g1' },
  { type:'FLASH', title:'Sunset from the harbour', place:'Karachi, Pakistan', viewers:'842', age:'2m', tag:'sunset', gradient:'g2' },
  { type:'DROP', title:'A quiet rooftop session', place:'Seoul, South Korea', viewers:'316', age:'6m', tag:'music', gradient:'g3' }
]

function App() {
  const [tab, setTab] = useState('now')
  const [sparkOpen, setSparkOpen] = useState(false)
  const [install, setInstall] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    getCurrentUser().then(setUser)
    const handler = e => { e.preventDefault(); setInstall(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const installApp = async () => {
    if (!install) return
    install.prompt()
    await install.userChoice
    setInstall(null)
  }

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand" onClick={() => setTab('now')} aria-label="WORLD home">
          <span className="brand-mark"><span /></span>
          <span>WORLD</span>
        </button>
        <div className="top-actions">
          {install && <button className="icon-btn install-btn" onClick={installApp}><Download size={17}/><span>Install</span></button>}
          <button className="icon-btn"><Search size={20}/></button>
          <button className="icon-btn notification"><Bell size={20}/><i /></button>
        </div>
      </header>

      <main>
        {tab === 'now' && <Now />}
        {tab === 'flow' && <Flow />}
        {tab === 'scenes' && <Scenes />}
        {tab === 'talk' && <Talk user={user} />}
        {tab === 'space' && <Space user={user} />}
      </main>

      <button className="spark" onClick={() => setSparkOpen(true)}>
        <Sparkles size={21}/><span>SPARK</span>
      </button>

      <nav className="nav">
        {tabs.map(({id,label,icon:Icon}) => (
          <button key={id} className={tab === id ? 'nav-item active' : 'nav-item'} onClick={() => setTab(id)}>
            <Icon size={20}/><span>{label}</span>
          </button>
        ))}
      </nav>

      {sparkOpen && <Spark onClose={() => setSparkOpen(false)} />}
    </div>
  )
}

function SectionTitle({eyebrow, title, action}) {
  return <div className="section-title">
    <div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1></div>
    {action && <button className="text-btn">{action}<ArrowUpRight size={15}/></button>}
  </div>
}

function Now() {
  return <div className="page">
    <section className="hero">
      <div className="hero-copy">
        <span className="live-pill"><i/> HAPPENING NOW</span>
        <h1>Be where<br/><em>life is.</em></h1>
        <p>Discover moments unfolding around you — or anywhere in the WORLD.</p>
        <button className="primary"><Navigation size={17}/> Explore nearby</button>
      </div>
      <div className="orbital"><div className="orbit o1"/><div className="orbit o2"/><div className="orbital-core"><Radio size={28}/></div></div>
    </section>

    <SectionTitle eyebrow="LIVE LAYER" title="Right now" action="See all"/>
    <div className="moment-list">
      {moments.map((m,i)=><MomentCard key={i} {...m}/>)}
    </div>
  </div>
}

function MomentCard({type,title,place,viewers,age,gradient}) {
  return <article className={`moment ${gradient}`}>
    <div className="moment-shade"/>
    <div className="moment-top"><span className={type==='LIVE'?'live-pill':'type-pill'}>{type}</span><span className="age">{age}</span></div>
    <div className="moment-bottom">
      <div><h2>{title}</h2><p>{place}</p></div>
      <div className="viewers"><Users size={14}/>{viewers}</div>
    </div>
    <button className="play"><Play size={18} fill="currentColor"/></button>
  </article>
}

function Flow() {
  return <div className="page">
    <SectionTitle eyebrow="YOUR LAYER" title="Flow"/>
    <div className="filters"><button className="filter active">For you</button><button className="filter">Following</button><button className="filter">Rising</button></div>
    {moments.concat([{...moments[1], title:'Rain just started', place:'Tokyo, Japan', viewers:'1.2K', age:'11m', gradient:'g4'}]).map((m,i)=><MomentCard key={i} {...m}/>)}
  </div>
}

function Scenes() {
  return <div className="page">
    <SectionTitle eyebrow="PLACES + EVENTS" title="Scenes"/>
    <div className="scene-grid">
      {['Karachi nights','Istanbul after dark','Seoul creative district','Lisbon street life'].map((x,i)=>
        <div className={`scene-card sg${i+1}`} key={x}><div className="scene-content"><span>SCENE</span><h2>{x}</h2><p>{[18,42,27,13][i]} active now</p></div></div>
      )}
    </div>
  </div>
}

function Talk({user}) {
  return <div className="page">
    <SectionTitle eyebrow="CONVERSATIONS" title="Talk"/>
    <div className="talk-card"><div className="avatar">W</div><div><strong>Welcome to WORLD</strong><p>Public Scene chats and private conversations live here.</p></div></div>
    <div className="empty"><MessageCircle size={34}/><h2>Find your people.</h2><p>Join a Scene to start talking. {user ? `Signed in as ${user.name || user.email}.` : 'Sign in when you are ready.'}</p><button className="secondary"><LogIn size={16}/> Continue</button></div>
  </div>
}

function Space({user}) {
  return <div className="page">
    <SectionTitle eyebrow="YOUR WORLD" title="Space"/>
    <div className="profile-card"><div className="profile-avatar">{user?.name?.[0] || 'W'}</div><div><h2>{user?.name || 'Your Space'}</h2><p>{user ? user.email : 'Create your identity on WORLD'}</p></div><button className="icon-btn"><ArrowUpRight size={18}/></button></div>
    <div className="stats"><div><b>0</b><span>Connections</span></div><div><b>0</b><span>Scenes</span></div><div><b>0</b><span>Moments</span></div></div>
  </div>
}

function Spark({onClose}) {
  return <div className="modal-backdrop" onClick={onClose}>
    <div className="spark-sheet" onClick={e=>e.stopPropagation()}>
      <button className="close" onClick={onClose}><X size={20}/></button>
      <span className="spark-icon"><Sparkles size={23}/></span>
      <div className="eyebrow">CREATE A MOMENT</div>
      <h2>What is happening?</h2>
      <p>Share a short-lived signal with the WORLD.</p>
      <div className="spark-types"><button><Radio size={19}/><b>NOW</b><span>Live activity</span></button><button><Play size={19}/><b>FLASH</b><span>5–30 seconds</span></button><button><Clock3 size={19}/><b>DROP</b><span>30 sec–5 min</span></button></div>
      <button className="primary wide"><Plus size={17}/> Create moment</button>
    </div>
  </div>
}

export default App
