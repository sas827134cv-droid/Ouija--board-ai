import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [displayedAnswer, setDisplayedAnswer] = useState('')
  const [candles, setCandles] = useState(3)
  const [ghostMood, setGhostMood] = useState('normal') // normal, angry, irritated
  const [questionCount, setQuestionCount] = useState(0)
  const [showWarning, setShowWarning] = useState(false)
  const [warningMessage, setWarningMessage] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [ghostName, setGhostName] = useState('')
  const [showGhost, setShowGhost] = useState(false)
  const [screenShake, setScreenShake] = useState(false)
  const [bloodDrip, setBloodDrip] = useState(false)
  const [fog, setFog] = useState(false)
  const [currentLetter, setCurrentLetter] = useState('')
  const [letterIndex, setLetterIndex] = useState(0)
  const [randomGhostSpawn, setRandomGhostSpawn] = useState(false)
  const [ghostPosition, setGhostPosition] = useState({ x: 50, y: 50 })
  
  const audioRef = useRef(null)
  const screamRef = useRef(null)
  const cryRef = useRef(null)

  const ghostNames = [
    'BLOODY MARY', 'THE WEEPING WIDOW', 'SHADOW DEMON', 
    'VENGEFUL SPIRIT', 'THE HANGED MAN', 'CURSED CHILD',
    'DARK ENTITY', 'THE TORMENTED SOUL'
  ]

  const warnings = {
    normal: [
      '⚠️ The spirits grow restless...',
      '⚠️ Something watches from the shadows...',
      '⚠️ The air grows cold...'
    ],
    angry: [
      '🔥 THE SPIRIT IS ENRAGED! 🔥',
      '💀 DANGER! THE ENTITY AWAKENS! 💀',
      '⚡ BEWARE! DARK FORCES GATHER! ⚡'
    ],
    irritated: [
      '😡 YOU ANGER THE SPIRITS!',
      '👻 THE GHOST SCREAMS IN FURY!',
      '🩸 BLOOD WILL BE SPILLED!'
    ]
  }

  useEffect(() => {
    // Determine mood based on candles and questions
    if (candles === 1) {
      setGhostMood('angry')
      setFog(true)
    } else if (candles === 2) {
      setGhostMood('irritated')
    } else {
      setGhostMood('normal')
      setFog(false)
    }

    // Random flickering
    if (questionCount > 3 && Math.random() > 0.7) {
      setScreenShake(true)
      setTimeout(() => setScreenShake(false), 500)
    }
  }, [candles, questionCount])

  useEffect(() => {
    if (ghostMood === 'angry' && candles === 1) {
      setShowGhost(true)
      if (cryRef.current) {
        cryRef.current.play().catch(() => {})
      }
      setTimeout(() => setShowGhost(false), 3000)
    }
  }, [ghostMood, candles])

  // Random ghost spawn effect
  useEffect(() => {
    const spawnGhost = () => {
      const randomX = Math.random() * 80 + 10 // 10% to 90%
      const randomY = Math.random() * 80 + 10
      setGhostPosition({ x: randomX, y: randomY })
      setRandomGhostSpawn(true)
      
      setTimeout(() => {
        setRandomGhostSpawn(false)
      }, 2000)
    }

    // Spawn ghost randomly every 15-30 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        spawnGhost()
      }
    }, Math.random() * 15000 + 15000)

    return () => clearInterval(interval)
  }, [])

  const typewriterEffect = (text) => {
    // Ensure text is a string and not undefined
    const safeText = String(text || 'The spirits are silent...')
    setDisplayedAnswer('')
    setLetterIndex(0)
    let index = 0
    let intervalId = null
    
    intervalId = setInterval(() => {
      if (index < safeText.length) {
        const char = safeText[index]
        setCurrentLetter(char)
        setDisplayedAnswer(prev => {
          // Only add valid characters
          if (char !== undefined && char !== null) {
            return prev + char
          }
          return prev
        })
        index++
      } else {
        if (intervalId) {
          clearInterval(intervalId)
          intervalId = null
        }
        setCurrentLetter('')
      }
    }, 50)
  }

  const showWarningPopup = (mood) => {
    const messages = warnings[mood]
    const message = messages[Math.floor(Math.random() * messages.length)]
    setWarningMessage(message)
    setShowWarning(true)
    
    if (mood === 'angry' && audioRef.current) {
      audioRef.current.play().catch(() => {})
    }
    
    if (mood === 'irritated' && screamRef.current) {
      screamRef.current.play().catch(() => {})
    }
    
    setTimeout(() => setShowWarning(false), 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim() || gameOver) return

    setLoading(true)
    setDisplayedAnswer('')
    setQuestionCount(prev => prev + 1)

    // Lose a candle randomly
    if (questionCount > 2 && Math.random() > 0.6) {
      const newCandles = candles - 1
      setCandles(newCandles)
      
      if (newCandles === 0) {
        setGameOver(true)
        const randomGhost = ghostNames[Math.floor(Math.random() * ghostNames.length)]
        setGhostName(randomGhost)
        setBloodDrip(true)
        if (screamRef.current) {
          screamRef.current.play().catch(() => {})
        }
        setLoading(false)
        return
      }
      
      showWarningPopup(newCandles === 1 ? 'angry' : 'irritated')
      setScreenShake(true)
      setTimeout(() => setScreenShake(false), 500)
      
      if (newCandles === 1) {
        setBloodDrip(true)
        setTimeout(() => setBloodDrip(false), 5000)
      }
    }

    try {
      const response = await fetch('http://localhost:3000/ask-spirit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question,
          persona: ghostMood === 'angry' ? 'angry' : 'mysterious'
        })
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      
      const data = await response.json()
      
      // Ensure we have a valid answer string
      let spiritAnswer = 'The spirits remain silent...'
      if (data && typeof data.answer === 'string' && data.answer.trim()) {
        spiritAnswer = data.answer.trim()
      }
      
      console.log('Received answer:', JSON.stringify(spiritAnswer))
      console.log('Answer length:', spiritAnswer.length)
      console.log('Answer type:', typeof spiritAnswer)
      
      typewriterEffect(spiritAnswer)
    } catch (error) {
      typewriterEffect('The spirits are silent...')
    } finally {
      setLoading(false)
    }
  }

  const resetGame = () => {
    setCandles(3)
    setQuestionCount(0)
    setGameOver(false)
    setGhostMood('normal')
    setBloodDrip(false)
    setFog(false)
    setQuestion('')
    setDisplayedAnswer('')
    const randomGhost = ghostNames[Math.floor(Math.random() * ghostNames.length)]
    setGhostName(randomGhost)
  }

  return (
    <div className={`spirit-board ${screenShake ? 'shake' : ''} ${ghostMood}`}>
      {/* Animated Horror Background */}
      <div className="horror-background">
        {/* Skulls - More spread out */}
        <div className="floating-skull skull1">💀</div>
        <div className="floating-skull skull2">☠️</div>
        <div className="floating-skull skull3">💀</div>
        <div className="floating-skull skull4">☠️</div>
        <div className="floating-skull skull5">💀</div>
        
        {/* Eyes - Watching from different corners */}
        <div className="floating-eyes eyes1">👁️👁️</div>
        <div className="floating-eyes eyes2">👁️👁️</div>
        <div className="floating-eyes eyes3">👁️👁️</div>
        <div className="floating-eyes eyes4">👁️👁️</div>
        
        {/* Ghosts - More transparent ghosts */}
        <div className="floating-ghost bg-ghost1">👻</div>
        <div className="floating-ghost bg-ghost2">👻</div>
        <div className="floating-ghost bg-ghost3">👻</div>
        <div className="floating-ghost bg-ghost4">👻</div>
        
        {/* Bats - Flying across */}
        <div className="floating-bat bat1">🦇</div>
        <div className="floating-bat bat2">🦇</div>
        <div className="floating-bat bat3">🦇</div>
        <div className="floating-bat bat4">🦇</div>
        <div className="floating-bat bat5">🦇</div>
        
        {/* Spiders hanging */}
        <div className="hanging-spider spider1">🕷️</div>
        <div className="hanging-spider spider2">🕷️</div>
        <div className="hanging-spider spider3">🕷️</div>
        
        {/* Floating hands */}
        <div className="floating-hand hand1">🖐️</div>
        <div className="floating-hand hand2">✋</div>
        
        {/* Floating candles */}
        <div className="floating-candle candle1">🕯️</div>
        <div className="floating-candle candle2">🕯️</div>
        <div className="floating-candle candle3">🕯️</div>
        
        {/* Mist/Smoke particles */}
        <div className="smoke-particle particle1">💨</div>
        <div className="smoke-particle particle2">💨</div>
        <div className="smoke-particle particle3">💨</div>
        <div className="smoke-particle particle4">💨</div>
      </div>

      {/* Random Ghost Spawn */}
      {randomGhostSpawn && (
        <div 
          className="random-ghost-spawn" 
          style={{ 
            left: `${ghostPosition.x}%`, 
            top: `${ghostPosition.y}%` 
          }}
        >
          <div className="spawn-ghost">👻</div>
          <div className="ghost-scream-text">BOO!</div>
        </div>
      )}
      
      {/* Fog Effect */}
      {fog && (
        <>
          <div className="fog fog1"></div>
          <div className="fog fog2"></div>
        </>
      )}
      
      {/* Blood Drip */}
      {bloodDrip && (
        <div className="blood-container">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="blood-drip" style={{left: `${i * 5}%`, animationDelay: `${Math.random() * 2}s`}}></div>
          ))}
        </div>
      )}

      {/* Ghost Apparition */}
      {showGhost && (
        <div className="ghost-apparition">
          <div className="ghost-face">👻</div>
          <div className="ghost-scream">LEAVE THIS PLACE!</div>
        </div>
      )}

      {/* Warning Popup */}
      {showWarning && (
        <div className={`warning-popup ${ghostMood}`}>
          {warningMessage}
        </div>
      )}

      <div className="container">
        {/* Candles (Lives) */}
        <div className="candles-container">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`candle ${i < candles ? 'lit' : 'out'}`}>
              {i < candles ? '🕯️' : '💀'}
            </div>
          ))}
        </div>

        <h1 className="title">🕯️ SpiritBoard AI 🕯️</h1>
        <p className="subtitle">Dare to ask the spirits...</p>
        
        {!gameOver ? (
          <>
            <form onSubmit={handleSubmit} className="question-form">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What do you seek to know?"
                className="question-input"
                disabled={loading}
              />
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Summoning...' : 'Ask the Spirits'}
              </button>
            </form>

            <div className={`ouija-board ${ghostMood}`}>
              <div className="board-texture"></div>
              
              <div className="board-top">
                <span className="board-text">YES</span>
                <div className="moon">🌙</div>
                <div className="sun">☀️</div>
                <span className="board-text">NO</span>
              </div>
              
              <div className="board-letters">
                <div className="letter-row">
                  {['A','B','C','D','E','F','G','H','I','J','K','L','M'].map(letter => (
                    <span key={letter} className={`letter ${currentLetter === letter ? 'active' : ''}`}>{letter}</span>
                  ))}
                </div>
                <div className="letter-row">
                  {['N','O','P','Q','R','S','T','U','V','W','X','Y','Z'].map(letter => (
                    <span key={letter} className={`letter ${currentLetter === letter ? 'active' : ''}`}>{letter}</span>
                  ))}
                </div>
              </div>
              
              <div className="board-numbers">
                {['1','2','3','4','5','6','7','8','9','0'].map(num => (
                  <span key={num} className={`number ${currentLetter === num ? 'active' : ''}`}>{num}</span>
                ))}
              </div>
              
              <div className="board-bottom">
                <span className="board-text goodbye">GOODBYE</span>
              </div>

              {loading && (
                <div className="planchette-moving">
                  <div className="planchette">👁️</div>
                </div>
              )}
            </div>

            {displayedAnswer && (
              <div className={`answer-container ${ghostMood}`}>
                <p className="answer">{displayedAnswer}</p>
              </div>
            )}
          </>
        ) : (
          <div className="game-over">
            <div className="ghost-name-reveal">
              <h2 className="ghost-title">YOU HAVE AWAKENED...</h2>
              <div className="rusty-board">
                <div className="blood-stain"></div>
                <h1 className="ghost-name">{ghostName}</h1>
                <div className="blood-splatter"></div>
              </div>
              <p className="ghost-message">Your candles have burned out... The darkness consumes you...</p>
              <button className="new-spirit-btn" onClick={resetGame}>
                💀 SUMMON NEW SPIRIT 💀
              </button>
            </div>
          </div>
        )}

        <p className="disclaimer">⚠️ For entertainment purposes only</p>
      </div>

      {/* Hidden Audio Elements */}
      <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHAU2jdXvzn0vBSh+zPDajzsKElyx6OyrWBQLSKHf8sFuIwUug8/y2Ik2CBhku+zooVARC0yl4fG5ZRwFNo3V7859LwUofsz" preload="auto"></audio>
      <audio ref={screamRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHAU2jdXvzn0vBSh+zPDajzsKElyx6OyrWBQLSKHf8sFuIwUug8/y2Ik2CBhku+zooVARC0yl4fG5ZRwFNo3V7859LwUofsz" preload="auto"></audio>
      <audio ref={cryRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHAU2jdXvzn0vBSh+zPDajzsKElyx6OyrWBQLSKHf8sFuIwUug8/y2Ik2CBhku+zooVARC0yl4fG5ZRwFNo3V7859LwUofsz" preload="auto"></audio>
    </div>
  )
}

export default App
