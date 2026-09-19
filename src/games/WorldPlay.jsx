import { useEffect, useState } from 'react'

const games = [
  {
    id: 'tap',
    name: 'Tap Rush',
    desc: 'Tap the target as many times as possible in 10 seconds.',
  },
  {
    id: 'reaction',
    name: 'Reaction',
    desc: 'Wait for the signal, then react as fast as you can.',
  },
  {
    id: 'memory',
    name: 'Memory Grid',
    desc: 'Remember the highlighted cells and repeat the pattern.',
  },
  {
    id: 'number',
    name: 'Number Rush',
    desc: 'Tap numbers in ascending order.',
  },
  {
    id: 'color',
    name: 'Color Match',
    desc: 'Match the target label with the correct tile.',
  },
  {
    id: 'target',
    name: 'Target Hunt',
    desc: 'Find the moving target.',
  },
  {
    id: 'grid',
    name: 'Grid Duel',
    desc: 'Claim as many cells as possible.',
  },
  {
    id: 'paddle',
    name: 'Paddle',
    desc: 'Keep the ball alive with the paddle.',
  },
]

export default function WorldPlay() {
  const [selected, setSelected] = useState('tap')

  const game = games.find((item) => item.id === selected) || games[0]

  return (
    <section className="page world-play-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">WORLD PLAY</p>
          <h1>Play</h1>
          <p className="muted">
            Quick games. No fake rewards. Just play.
          </p>
        </div>
      </div>

      <div className="play-grid">
        {games.map((item) => (
          <button
            key={item.id}
            type="button"
            className={
              selected === item.id
                ? 'play-card active'
                : 'play-card'
            }
            onClick={() => setSelected(item.id)}
          >
            <span className="play-glyph" aria-hidden="true">
              <i />
            </span>

            <strong>{item.name}</strong>
            <small>{item.desc}</small>
          </button>
        ))}
      </div>

      <div className="game-stage">
        <GameRenderer type={game.id} />
      </div>
    </section>
  )
}

function GameRenderer({ type }) {
  switch (type) {
    case 'tap':
      return <TapRush />

    case 'reaction':
      return <Reaction />

    case 'memory':
      return <MemoryGrid />

    case 'number':
      return <NumberRush />

    case 'color':
      return <ColorMatch />

    case 'target':
      return <TargetHunt />

    case 'grid':
      return <GridDuel />

    case 'paddle':
    default:
      return <Paddle />
  }
}

function TapRush() {
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(10)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setTime((value) => {
        if (value <= 1) {
          window.clearInterval(timer)
          setRunning(false)
          return 0
        }

        return value - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [running])

  const start = () => {
    setScore(0)
    setTime(10)
    setRunning(true)
  }

  return (
    <GameBox
      title="Tap Rush"
      score={score}
      time={time}
      action={start}
      label="Start"
    >
      <button
        type="button"
        className="target-button"
        disabled={!running}
        onClick={() => setScore((value) => value + 1)}
        aria-label="Tap target"
      >
        <span />
      </button>
    </GameBox>
  )
}

function Reaction() {
  const [state, setState] = useState('idle')
  const [startedAt, setStartedAt] = useState(0)
  const [best, setBest] = useState(null)

  useEffect(() => {
    let timer

    if (state === 'wait') {
      const delay = 900 + Math.random() * 2200

      timer = window.setTimeout(() => {
        setStartedAt(performance.now())
        setState('go')
      }, delay)
    }

    return () => {
      if (timer) {
        window.clearTimeout(timer)
      }
    }
  }, [state])

  const begin = () => {
    setState('wait')
  }

  const handleTap = () => {
    if (state === 'go') {
      const result = Math.round(
        performance.now() - startedAt
      )

      setBest((value) =>
        value == null ? result : Math.min(value, result)
      )

      setState('done')
      return
    }

    if (state === 'wait') {
      setState('tooSoon')
      return
    }

    setState('wait')
  }

  let label = 'TAP'

  if (state === 'wait') {
    label = 'WAIT'
  }

  if (state === 'tooSoon') {
    label = 'TOO SOON'
  }

  return (
    <GameBox
      title="Reaction"
      score={best == null ? '—' : `${best}ms`}
      action={begin}
      label="Start"
    >
      <button
        type="button"
        className={`reaction-button ${state}`}
        onClick={handleTap}
      >
        {label}
      </button>
    </GameBox>
  )
}

function MemoryGrid() {
  const [pattern, setPattern] = useState([])
  const [input, setInput] = useState([])
  const [message, setMessage] = useState('Press start')
  const [showPattern, setShowPattern] = useState(false)

  const start = () => {
    const nextPattern = []

    while (nextPattern.length < 4) {
      const value = Math.floor(Math.random() * 9)

      if (!nextPattern.includes(value)) {
        nextPattern.push(value)
      }
    }

    setPattern(nextPattern)
    setInput([])
    setMessage('Remember')
    setShowPattern(true)

    window.setTimeout(() => {
      setShowPattern(false)
      setMessage('Repeat')
    }, 900)
  }

  const choose = (index) => {
    if (
      showPattern ||
      pattern.length === 0 ||
      input.length >= pattern.length
    ) {
      return
    }

    const nextInput = [...input, index]

    setInput(nextInput)

    const correct =
      pattern[nextInput.length - 1] === index

    if (!correct) {
      setMessage('Try again')
      return
    }

    if (nextInput.length === pattern.length) {
      setMessage('Correct')
    }
  }

  return (
    <GameBox
      title="Memory Grid"
      score={pattern.length ? pattern.length : '—'}
      action={start}
      label="Start"
    >
      <div className="memory-grid">
        {Array.from({ length: 9 }, (_, index) => {
          const lit =
            showPattern && pattern.includes(index)

          return (
            <button
              key={index}
              type="button"
              className={
                lit
                  ? 'memory-cell lit'
                  : 'memory-cell'
              }
              onClick={() => choose(index)}
              aria-label={`Memory cell ${index + 1}`}
            />
          )
        })}
      </div>

      <p className="game-message">{message}</p>
    </GameBox>
  )
}

function NumberRush() {
  const [numbers, setNumbers] = useState([])
  const [next, setNext] = useState(1)

  const start = () => {
    const shuffled = Array.from(
      { length: 9 },
      (_, index) => index + 1
    ).sort(() => Math.random() - 0.5)

    setNumbers(shuffled)
    setNext(1)
  }

  const choose = (number) => {
    if (number === next) {
      setNext((value) => value + 1)
    }
  }

  return (
    <GameBox
      title="Number Rush"
      score={next > 9 ? 'Complete' : next}
      action={start}
      label="Start"
    >
      <div className="number-grid">
        {numbers.map((number) => (
          <button
            key={number}
            type="button"
            disabled={number < next}
            onClick={() => choose(number)}
          >
            {number}
          </button>
        ))}
      </div>
    </GameBox>
  )
}

function ColorMatch() {
  const colors = ['A', 'B', 'C', 'D']

  const [target, setTarget] = useState('A')
  const [score, setScore] = useState(0)

  const nextTarget = () => {
    setTarget(
      colors[Math.floor(Math.random() * colors.length)]
    )
  }

  const reset = () => {
    setScore(0)
    nextTarget()
  }

  const choose = (color) => {
    if (color === target) {
      setScore((value) => value + 1)
      nextTarget()
    }
  }

  return (
    <GameBox
      title="Color Match"
      score={score}
      action={reset}
      label="New"
    >
      <div className="color-game">
        <b>Match: {target}</b>

        <div>
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => choose(color)}
            >
              {color}
            </button>
          ))}
        </div>
      </div>
    </GameBox>
  )
}

function TargetHunt() {
  const [hits, setHits] = useState(0)
  const [position, setPosition] = useState({
    x: 50,
    y: 50,
  })

  const move = () => {
    setHits((value) => value + 1)

    setPosition({
      x: 12 + Math.random() * 76,
      y: 15 + Math.random() * 70,
    })
  }

  const start = () => {
    setHits(0)

    setPosition({
      x: 50,
      y: 50,
    })
  }

  return (
    <GameBox
      title="Target Hunt"
      score={hits}
      action={start}
      label="Start"
    >
      <div className="hunt-area">
        <button
          type="button"
          className="hunt-target"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
          }}
          onClick={move}
          aria-label="Moving target"
        >
          <span />
        </button>
      </div>
    </GameBox>
  )
}

function GridDuel() {
  const [claimed, setClaimed] = useState([])

  const claim = (index) => {
    setClaimed((current) =>
      current.includes(index)
        ? current
        : [...current, index]
    )
  }

  return (
    <GameBox
      title="Grid Duel"
      score={claimed.length}
      action={() => setClaimed([])}
      label="Reset"
    >
      <div className="duel-grid">
        {Array.from({ length: 16 }, (_, index) => (
          <button
            key={index}
            type="button"
            className={
              claimed.includes(index)
                ? 'claimed'
                : ''
            }
            onClick={() => claim(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </GameBox>
  )
}

function Paddle() {
  const [hits, setHits] = useState(0)

  return (
    <GameBox
      title="Paddle"
      score={hits}
      action={() => setHits(0)}
      label="Reset"
    >
      <button
        type="button"
        className="paddle-area"
        onClick={() => setHits((value) => value + 1)}
        aria-label="Keep the ball alive"
      >
        <span className="paddle-ball" />
        <span className="paddle-bar" />
      </button>
    </GameBox>
  )
}

function GameBox({
  title,
  score,
  time,
  action,
  label,
  children,
}) {
  return (
    <div className="game-box">
      <div className="game-head">
        <div>
          <h2>{title}</h2>

          <p>
            Score <strong>{score}</strong>

            {time !== undefined && (
              <> · {time}s</>
            )}
          </p>
        </div>

        <button type="button" onClick={action}>
          {label}
        </button>
      </div>

      {children}
    </div>
  )
                                             }
