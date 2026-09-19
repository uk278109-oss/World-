import { useEffect, useMemo, useState, useRef } from 'react'

const games = [
  { id: 'tap', name: 'Tap Rush', desc: '10s me jitna ho sake tap karo.', icon: '👆', color: '#00E5FF' },
  { id: 'reaction', name: 'Reaction', desc: 'Signal ka wait karo, tez react karo.', icon: '⚡', color: '#FFD600' },
  { id: 'memory', name: 'Memory Grid', desc: 'Pattern yaad rakho aur repeat karo.', icon: '🧠', color: '#7C4DFF' },
  { id: 'number', name: 'Number Rush', desc: 'Numbers ko 1 se 9 tak order me tap karo.', icon: '🔢', color: '#00E676' },
  { id: 'color', name: 'Color Match', desc: 'Sahi color tile ko match karo.', icon: '🎨', color: '#FF4081' },
  { id: 'target', name: 'Target Hunt', desc: 'Moving target ko dhundo.', icon: '🎯', color: '#FF6D00' },
  { id: 'grid', name: 'Grid Duel', desc: 'Zyada se zyada cells claim karo.', icon: '⚔️', color: '#18FFFF' },
  { id: 'paddle', name: 'Paddle', desc: 'Ball ko girne mat do.', icon: '🏓', color: '#69F0AE' }
]

export default function WorldPlay() {
  const [selected, setSelected] = useState('tap')
  const game = useMemo(() => games.find(g => g.id === selected) || games[0], [selected])
  return (
    <section className="page world-play-page" style={{paddingBottom:'100px'}}>
      <div className="page-heading" style={{padding:'16px'}}>
        <p className="eyebrow" style={{opacity:0.6, fontSize:12, letterSpacing:2}}>WORLD PLAY</p>
        <h1 style={{fontSize:28, fontWeight:800}}>Playground</h1>
        <p className="muted" style={{opacity:0.7}}>Quick games. No fake rewards. Just play.</p>
      </div>

      <div className="play-grid" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, padding:'0 16px'}}>
        {games.map(g => (
          <button
            key={g.id}
            onClick={() => setSelected(g.id)}
            style={{
              background: selected === g.id? `linear-gradient(135deg, ${g.color}22, #111)` : '#111',
              border: selected === g.id? `2px solid ${g.color}` : '1px solid #222',
              borderRadius:16, padding:16, textAlign:'left', transition:'0.2s'
            }}
          >
            <div style={{fontSize:28, marginBottom:8}}>{g.icon}</div>
            <strong style={{display:'block', color:'#fff', fontSize:14}}>{g.name}</strong>
            <small style={{color:'#888', fontSize:11, lineHeight:1.2, display:'block', marginTop:4}}>{g.desc}</small>
          </button>
        ))}
      </div>

      <div className="game-stage" style={{marginTop:24, padding:'0 16px'}}>
        <GameRenderer type={game.id} color={game.color} />
      </div>
    </section>
  )
}

function GameRenderer({ type, color }) {
  if (type === 'tap') return <TapRush color={color} />
  if (type === 'reaction') return <Reaction color={color} />
  if (type === 'memory') return <MemoryGrid color={color} />
  if (type === 'number') return <NumberRush color={color} />
  if (type === 'color') return <ColorMatch color={color} />
  if (type === 'target') return <TargetHunt color={color} />
  if (type === 'grid') return <GridDuel color={color} />
  return <Paddle color={color} />
}

function GameBox({ title, score, time, action, label, color, children }) {
  return (
    <div style={{background:'#0F0F0F', border:'1px solid #222', borderRadius:20, overflow:'hidden'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px', borderBottom:'1px solid #222'}}>
        <div>
          <h2 style={{margin:0, fontSize:20, fontWeight:800}}>{title}</h2>
          <p style={{margin:'4px 0 0', fontSize:13, color:'#888'}}>Score <strong style={{color:'#fff'}}>{score}</strong> {time!==undefined && <span>· {time}s</span>}</p>
        </div>
        <button onClick={action} style={{background:color, color:'#000', border:'none', borderRadius:99, padding:'10px 18px', fontWeight:800, cursor:'pointer'}}>{label}</button>
      </div>
      <div style={{padding:20}}>{children}</div>
    </div>
  )
}

function TapRush({color}) {
  const [score,setScore]=useState(0),[time,setTime]=useState(10),[run,setRun]=useState(false),[pop,setPop]=useState(false);
  useEffect(()=>{if(!run)return;const t=setInterval(()=>setTime(x=>{if(x<=1){clearInterval(t);setRun(false);return 0}return x-1}),1000);return()=>clearInterval(t)},[run]);
  return <GameBox title="Tap Rush" score={score} time={time} action={()=>{setScore(0);setTime(10);setRun(true)}} label={run?'Running':'Start'} color={color}>
    <div style={{display:'grid', placeItems:'center', height:200}}>
      <button
        disabled={!run}
        onClick={()=>{setScore(s=>s+1);setPop(true);setTimeout(()=>setPop(false),100)}}
        style={{width:120, height:120, borderRadius:'50%', background: run? color : '#222', border:'4px solid #fff1', fontSize:32, transform: pop? 'scale(0.9)' : 'scale(1)', transition:'0.1s', cursor:'pointer'}}
      >👆</button>
    </div>
  </GameBox>
}

function Reaction({color}){
  const [state,setState]=useState('idle'),[start,setStart]=useState(0),[best,setBest]=useState(null);
  const begin=()=>{setState('wait');const delay=900+Math.random()*2200;setTimeout(()=>{setStart(performance.now());setState('go')},delay)};
  return <GameBox title="Reaction Test" score={best? `${best}ms` : '—'} action={begin} label="Start" color={color}>
    <button
      onClick={()=>{if(state==='go'){const ms=Math.round(performance.now()-start);setBest(best==null?ms:Math.min(best,ms));setState('done')}else if(state==='wait'){setState('tooSoon')}}}
      style={{width:'100%', height:160, borderRadius:16, border:'none', fontSize:24, fontWeight:900, background: state==='wait'?'#FF1744' : state==='go'? color : '#222', color: state==='wait'||state==='go'? '#000' : '#fff', cursor:'pointer'}}
    >{state==='idle'?'READY':state==='wait'?'WAIT...':state==='go'?'TAP NOW!':state==='tooSoon'?'TOO SOON!':'DONE'}</button>
  </GameBox>
}

function MemoryGrid({color}){
  const [pattern,setPattern]=useState([]),[input,setInput]=useState([]),[msg,setMsg]=useState('Press Start');
  const start=()=>{const p=[...Array(4)].map(()=>Math.floor(Math.random()*9));setPattern(p);setInput([]);setMsg('Remember...');setTimeout(()=>setMsg('Your turn!'),900)};
  return <GameBox title="Memory Grid" score={pattern.length||'—'} action={start} label="Start" color={color}>
    <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10}}>
      {Array.from({length:9},(_,i)=>(
        <button key={i}
          onClick={()=>{
            if(input.length>=pattern.length) return;
            const n=[...input,i]; setInput(n);
            if(pattern.slice(0,n.length).join()!==n.join()) setMsg('❌ Try Again');
            else if(n.length===pattern.length) setMsg('✅ Correct!')
          }}
          style={{aspectRatio:'1', borderRadius:12, border:'1px solid #222', background: pattern.includes(i) && input.length===0? color : '#1A1A1A', boxShadow: pattern.includes(i) && input.length===0? `0 0 20px ${color}` : 'none', transition:'0.2s'}}
        />
      ))}
    </div>
    <p style={{textAlign:'center', marginTop:12, color:'#aaa'}}>{msg}</p>
  </GameBox>
}

function NumberRush({color}){
  const [nums,setNums]=useState([]),[next,setNext]=useState(1);
  const start=()=>{setNums([...Array(9)].map((_,i)=>i+1).sort(()=>Math.random()-.5));setNext(1)};
  return <GameBox title="Number Rush" score={next>9?'Done!':next} action={start} label="Start" color={color}>
    <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10}}>
      {nums.map(n=>(
        <button key={n} disabled={n<next} onClick={()=>n===next&&setNext(x=>x+1)}
          style={{height:60, borderRadius:12, border:'1px solid #222', background: n<next? '#111' : '#1E1E1E', color: n<next? '#444' : '#fff', fontSize:20, fontWeight:700, textDecoration: n<next?'line-through':'none'}}>
          {n}
        </button>
      ))}
    </div>
  </GameBox>
}

function ColorMatch({color}){
  const COLORS=[
    {name:'Red', hex:'#FF3D00'}, {name:'Blue', hex:'#2979FF'},
    {name:'Green', hex:'#00E676'}, {name:'Yellow', hex:'#FFEA00'}
  ];
  const [target,setTarget]=useState(COLORS[0]),[score,setScore]=useState(0);
  const newTarget=()=>setTarget(COLORS[Math.floor(Math.random()*COLORS.length)]);
  return <GameBox title="Color Match" score={score} action={()=>{setScore(0);newTarget()}} label="New" color={color}>
    <div style={{textAlign:'center'}}>
      <p style={{marginBottom:16}}>Match this: <b style={{color:target.hex, fontSize:18}}>{target.name.toUpperCase()}</b></p>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
        {COLORS.map(c=>(
          <button key={c.name} onClick={()=>{if(c.name===target.name){setScore(s=>s+1);newTarget()}}}
            style={{height:70, borderRadius:12, background:c.hex, border:'none', cursor:'pointer'}} />
        ))}
      </div>
    </div>
  </GameBox>
}

function TargetHunt({color}){
  const [hit,setHit]=useState(0),[pos,setPos]=useState({x:50,y:50});
  const move=()=>{setHit(h=>h+1);setPos({x:10+Math.random()*70,y:10+Math.random()*60})};
  return <GameBox title="Target Hunt" score={hit} action={()=>{setHit(0);move()}} label="Start" color={color}>
    <div style={{position:'relative', height:200, background:'#111', borderRadius:16, overflow:'hidden', border:'1px solid #222'}}>
      <button onClick={move} style={{position:'absolute', left:`${pos.x}%`, top:`${pos.y}%`, width:50, height:50, borderRadius:'50%', background:color, border:'3px solid #fff', boxShadow:`0 0 20px ${color}`, transform:'translate(-50%,-50%)', transition:'0.3s'}}>🎯</button>
    </div>
  </GameBox>
}

function GridDuel({color}){
  const [claimed,setClaimed]=useState([]);
  return <GameBox title="Grid Duel" score={claimed.length} action={()=>setClaimed([])} label="Reset" color={color}>
    <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8}}>
      {Array.from({length:16},(_,i)=>(
        <button key={i} onClick={()=>setClaimed(a=>a.includes(i)?a: [...a,i])}
          style={{aspectRatio:'1', borderRadius:10, border:'1px solid #222', background: claimed.includes(i)? color : '#151515', color: claimed.includes(i)?'#000':'#666', fontWeight:700}}>
          {i+1}
        </button>
      ))}
    </div>
  </GameBox>
}

function Paddle({color}){
  const [hits,setHits]=useState(0);
  return <GameBox title="Paddle" score={hits} action={()=>setHits(0)} label="Reset" color={color}>
    <div onClick={()=>setHits(h=>h+1)} style={{height:220, background:'#111', borderRadius:16, border:'1px solid #222', position:'relative', display:'grid', placeItems:'center', cursor:'pointer'}}>
      <div style={{width:16, height:16, background:'#fff', borderRadius:'50%'}}/>
      <div style={{position:'absolute', bottom:20, width:100, height:10, background:color, borderRadius:10}}/>
      <p style={{position:'absolute', bottom:40, color:'#666', fontSize:12}}>Tap to hit</p>
    </div>
  </GameBox>
      }
