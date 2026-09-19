import { useEffect, useMemo, useState } from 'react'

const games = [
  { id: 'tap', name: 'Tap Rush', desc: 'Tap the target as many times as possible in 10 seconds.' },
  { id: 'reaction', name: 'Reaction', desc: 'Wait for the signal, then react as fast as you can.' },
  { id: 'memory', name: 'Memory Grid', desc: 'Remember the highlighted cells and repeat the pattern.' },
  { id: 'number', name: 'Number Rush', desc: 'Tap numbers in ascending order before time runs out.' },
  { id: 'color', name: 'Color Match', desc: 'Match the target label with the correct tile.' },
  { id: 'target', name: 'Target Hunt', desc: 'Find the moving target before it disappears.' },
  { id: 'grid', name: 'Grid Duel', desc: 'Claim as many cells as possible in the round.' },
  { id: 'paddle', name: 'Paddle', desc: 'Keep the ball alive with the paddle.' }
]

export default function WorldPlay() {
  const [selected, setSelected] = useState('tap')
  const game = useMemo(() => games.find(g => g.id === selected) || games[0], [selected])
  return <section className="page world-play-page">
    <div className="page-heading"><div><p className="eyebrow">WORLD PLAY</p><h1>Play</h1><p className="muted">Quick games. No fake rewards. Just play.</p></div></div>
    <div className="play-grid">{games.map(g => <button key={g.id} className={selected === g.id ? 'play-card active' : 'play-card'} onClick={() => setSelected(g.id)}><span className="play-glyph" aria-hidden="true"><i /></span><strong>{g.name}</strong><small>{g.desc}</small></button>)}</div>
    <div className="game-stage"><GameRenderer type={game.id} /></div>
  </section>
}

function GameRenderer({ type }) {
  if (type === 'tap') return <TapRush />
  if (type === 'reaction') return <Reaction />
  if (type === 'memory') return <MemoryGrid />
  if (type === 'number') return <NumberRush />
  if (type === 'color') return <ColorMatch />
  if (type === 'target') return <TargetHunt />
  if (type === 'grid') return <GridDuel />
  return <Paddle />
}

function TapRush() { const [score,setScore]=useState(0),[time,setTime]=useState(10),[run,setRun]=useState(false); useEffect(()=>{if(!run)return;const t=setInterval(()=>setTime(x=>x<=1?(clearInterval(t),setRun(false),0):x-1),1000);return()=>clearInterval(t)},[run]); const start=()=>{setScore(0);setTime(10);setRun(true)}; return <GameBox title="Tap Rush" score={score} time={time} action={start} label="Start"><button className="target-button" disabled={!run} onClick={()=>setScore(s=>s+1)}><span /></button></GameBox> }
function Reaction(){const [state,setState]=useState('idle'),[start,setStart]=useState(0),[best,setBest]=useState(null);const begin=()=>{setState('wait');const delay=900+Math.random()*2200;setTimeout(()=>{setStart(performance.now());setState('go')},delay)};return <GameBox title="Reaction" score={best ? `${best}ms` : '—'} action={begin} label="Start"><button className={`reaction-button ${state}`} onClick={()=>{if(state==='go'){const ms=Math.round(performance.now()-start);setBest(best==null?ms:Math.min(best,ms));setState('done')}else if(state==='wait'){setState('tooSoon')}}}>{state==='go'?'TAP':'WAIT'}</button></GameBox>}
function MemoryGrid(){const [pattern,setPattern]=useState([]),[input,setInput]=useState([]),[msg,setMsg]=useState('Press start');const start=()=>{const p=[...Array(4)].map(()=>Math.floor(Math.random()*9));setPattern(p);setInput([]);setMsg('Remember');setTimeout(()=>setMsg('Repeat'),900)};return <GameBox title="Memory Grid" score={pattern.length?pattern.length:'—'} action={start} label="Start"><div className="memory-grid">{Array.from({length:9},(_,i)=><button key={i} className={pattern.includes(i)&&input.length===0?'memory-cell lit':'memory-cell'} onClick={()=>{const n=[...input,i];setInput(n);if(pattern.slice(0,n.length).join()!==n.join())setMsg('Try again');else if(n.length===pattern.length)setMsg('Correct')}} /></div><p className="game-message">{msg}</p></GameBox>}
function NumberRush(){const [nums,setNums]=useState([]),[next,setNext]=useState(1);const start=()=>{setNums([...Array(9)].map((_,i)=>i+1).sort(()=>Math.random()-.5));setNext(1)};return <GameBox title="Number Rush" score={next>9?'Complete':next} action={start} label="Start"><div className="number-grid">{nums.map(n=><button key={n} disabled={n<next} onClick={()=>n===next&&setNext(x=>x+1)}>{n}</button>)}</div></GameBox>}
function ColorMatch(){const colors=['A','B','C','D'];const [target,setTarget]=useState('A'),[score,setScore]=useState(0);return <GameBox title="Color Match" score={score} action={()=>{setScore(0);setTarget(colors[Math.floor(Math.random()*4)])}} label="New"><div className="color-game"><b>Match: {target}</b><div>{colors.map(c=><button key={c} onClick={()=>{if(c===target){setScore(s=>s+1);setTarget(colors[Math.floor(Math.random()*4)])}}}>{c}</button>)}</div></div></GameBox>}
function TargetHunt(){const [hit,setHit]=useState(0),[pos,setPos]=useState({x:50,y:50});const move=()=>{setHit(h=>h+1);setPos({x:12+Math.random()*76,y:15+Math.random()*70})};return <GameBox title="Target Hunt" score={hit} action={()=>{setHit(0);move()}} label="Start"><div className="hunt-area"><button className="hunt-target" style={{left:`${pos.x}%`,top:`${pos.y}%`}} onClick={move}><span /></button></div></GameBox>}
function GridDuel(){const [claimed,setClaimed]=useState([]);return <GameBox title="Grid Duel" score={claimed.length} action={()=>setClaimed([])} label="Reset"><div className="duel-grid">{Array.from({length:16},(_,i)=><button key={i} className={claimed.includes(i)?'claimed':''} onClick={()=>setClaimed(a=>a.includes(i)?a:a.concat(i))}>{i+1}</button>)}</div></GameBox>}
function Paddle(){const [hits,setHits]=useState(0);return <GameBox title="Paddle" score={hits} action={()=>setHits(0)} label="Reset"><button className="paddle-area" onClick={()=>setHits(h=>h+1)}><span className="paddle-ball"/><span className="paddle-bar"/></button></GameBox>}
function GameBox({title,score,time,action,label,children}){return <div className="game-box"><div className="game-head"><div><h2>{title}</h2><p>Score <strong>{score}</strong>{time!==undefined&&<> · {time}s</>}</p></div><button onClick={action}>{label}</button></div>{children}</div>}
