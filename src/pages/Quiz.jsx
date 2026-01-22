import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles, Stars } from '@react-three/drei'
import Canvas3D from '../components/3d/Canvas3D'
import { useRef } from 'react'
import confetti from 'canvas-confetti'
import { quizQuestions, coupleData } from '../data/weddingData'
import FloatingElements from '../components/3d/FloatingElements'
import { Diya, DiyaArrangement } from '../components/3d/Diya'
import { SacredFireScene, FireGroup } from '../components/3d/SacredFire'

// 3D Confetti burst effect
function triggerConfetti() {
  const count = 200
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#D4AF37', '#FF9933', '#E8A4B8', '#FFCC00', '#FDF8F0']
  }

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    })
  }

  fire(0.25, { spread: 26, startVelocity: 55 })
  fire(0.2, { spread: 60 })
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
  fire(0.1, { spread: 120, startVelocity: 45 })
}

// 3D Trophy
function Trophy3D() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <Float speed={1} floatIntensity={0.3}>
      <group ref={groupRef} scale={0.8}>
        {/* Cup */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.6, 0.4, 1, 32]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Base */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.3, 0.5, 0.4, 32]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Stem */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.5, 16]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Handles */}
        <mesh position={[0.7, 0.5, 0]} rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[0.2, 0.05, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[-0.7, 0.5, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <torusGeometry args={[0.2, 0.05, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </Float>
  )
}

// Question mark 3D
function QuestionMark3D() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    }
  })

  return (
    <Float speed={2} floatIntensity={0.5}>
      <group ref={groupRef}>
        <mesh>
          <torusGeometry args={[0.5, 0.15, 16, 32, Math.PI * 1.5]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.5, -0.3, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.5, -0.8, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  )
}

// 3D Scene with Indian wedding elements
function QuizScene({ showTrophy }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#FFF8DC" />
      <pointLight position={[-5, -5, 5]} intensity={0.4} color="#D4AF37" />

      {showTrophy ? <Trophy3D /> : <QuestionMark3D />}

      <Sparkles
        count={80}
        scale={8}
        size={2}
        speed={0.3}
        color={showTrophy ? '#FFD700' : '#D4AF37'}
        opacity={0.5}
      />
    </>
  )
}

// Intro scene with diyas for festive welcome
function IntroScene() {
  return (
    <>
      <ambientLight intensity={0.4} color="#FFA07A" />
      <pointLight position={[3, 3, 3]} intensity={0.6} color="#FF8C00" />
      <pointLight position={[-3, 3, -3]} intensity={0.4} color="#FFD700" />

      {/* Central sacred fire (smaller, atmospheric) */}
      <group position={[0, -0.5, 0]} scale={0.6}>
        <FireGroup intensity={0.8} />
      </group>

      {/* Surrounding diyas */}
      <Diya position={[-1.5, -0.8, 0.5]} scale={0.7} flameIntensity={1} rotationY={Math.PI / 4} />
      <Diya position={[1.5, -0.8, 0.5]} scale={0.7} flameIntensity={1} rotationY={-Math.PI / 4} />

      <Sparkles
        count={100}
        scale={6}
        size={2}
        speed={0.3}
        color="#FFD700"
        opacity={0.6}
      />
    </>
  )
}

// Gameplay scene with floating diyas for atmosphere
function GameplayScene() {
  return (
    <>
      <ambientLight intensity={0.5} color="#FFF8DC" />
      <pointLight position={[4, 4, 4]} intensity={0.6} color="#FF8C00" />
      <pointLight position={[-4, 4, -4]} intensity={0.4} color="#D4AF37" />

      {/* Corner diyas for ambiance */}
      <Float speed={1.5} floatIntensity={0.3}>
        <Diya position={[-2.5, 0, -1]} scale={0.5} flameIntensity={0.9} rotationY={Math.PI / 3} />
      </Float>
      <Float speed={1.8} floatIntensity={0.25}>
        <Diya position={[2.5, 0.2, -1]} scale={0.5} flameIntensity={0.9} rotationY={-Math.PI / 3} />
      </Float>
      <Float speed={1.3} floatIntensity={0.35}>
        <Diya position={[0, -0.5, -2]} scale={0.6} flameIntensity={1} rotationY={0} />
      </Float>

      <Sparkles
        count={60}
        scale={8}
        size={1.5}
        speed={0.2}
        color="#D4AF37"
        opacity={0.4}
      />
    </>
  )
}

// Celebration scene with sacred fire and diyas
function CelebrationScene() {
  return (
    <>
      <ambientLight intensity={0.3} color="#FFA07A" />
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#FFD700" />
      <spotLight position={[0, 8, 5]} angle={0.4} penumbra={1} intensity={0.6} color="#FF8C00" />

      {/* Central sacred fire for celebration */}
      <group position={[0, -1, 0]} scale={0.7}>
        <SacredFireScene intensity={1.2} showKund={false} />
      </group>

      {/* Celebratory diya arrangement */}
      <group position={[0, -1.2, 0]}>
        <DiyaArrangement count={6} radius={2.2} pattern="circle" centerDiya={false} scale={0.5} />
      </group>

      <Sparkles
        count={150}
        scale={10}
        size={3}
        speed={0.5}
        color="#FFD700"
        opacity={0.7}
      />
      <Sparkles
        count={80}
        scale={8}
        size={2}
        speed={0.3}
        color="#FF6600"
        opacity={0.5}
      />
    </>
  )
}

// Witty feedback messages
const correctMessages = [
  "Arre wah! You definitely deserve extra gulab jamun at the wedding!",
  "Shaadi mein aapka VIP seat pakka!",
  "Perfect! Are you secretly their wedding planner?",
  "Bohot khoob! The couple would be proud!",
  "You're on fire! Just like the sacred Agni!",
  "Sahi jawab! Someone's been paying attention!",
  "Genius! You must be their favorite guest!",
  "Incredible! Did you hack into their WhatsApp?",
]

const wrongMessages = [
  "Oops! Looks like someone skipped the mehendi gossip sessions!",
  "Wrong! Maybe spend less time at the buffet, more time with the couple?",
  "Galat! Don't worry, you'll learn more at the sangeet!",
  "Nice try! But the pandit would be disappointed...",
  "Uh oh! Did you RSVP to the wrong wedding?",
  "Wrong answer! Time to slide into their DMs more often!",
  "Missed it! Were you too busy dancing at their roka?",
  "Incorrect! Quick, pretend you knew that all along!",
]

const getRandomMessage = (isCorrect) => {
  const messages = isCorrect ? correctMessages : wrongMessages
  return messages[Math.floor(Math.random() * messages.length)]
}

// Quiz Progress Component
function QuizProgress({ current, total }) {
  const progress = ((current) / total) * 100

  return (
    <div className="quiz-progress">
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <span className="progress-text">Question {current} of {total}</span>
    </div>
  )
}

// Quiz Question Component
function QuizQuestion({ question, questionIndex, onAnswer, selectedAnswer, feedback }) {
  return (
    <motion.div
      className="quiz-question"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="question-text">{question.question}</h2>

      <div className="options-grid">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index
          const isCorrect = question.correctAnswer === index
          const showResult = selectedAnswer !== undefined

          return (
            <motion.button
              key={index}
              className={`option-btn ${isSelected ? 'selected' : ''} ${showResult && isCorrect ? 'correct' : ''} ${showResult && isSelected && !isCorrect ? 'wrong' : ''}`}
              onClick={() => selectedAnswer === undefined && onAnswer(index)}
              whileHover={selectedAnswer === undefined ? { scale: 1.02 } : {}}
              whileTap={selectedAnswer === undefined ? { scale: 0.98 } : {}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              disabled={selectedAnswer !== undefined}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
              {showResult && isCorrect && <span className="option-icon">✓</span>}
              {showResult && isSelected && !isCorrect && <span className="option-icon">✗</span>}
            </motion.button>
          )
        })}
      </div>

    </motion.div>
  )
}

// Feedback Popup Component
function FeedbackPopup({ feedback, onDismiss }) {
  if (!feedback) return null

  return (
    <AnimatePresence>
      <motion.div
        className="feedback-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onDismiss}
      >
        <motion.div
          className={`feedback-popup ${feedback.isCorrect ? 'correct' : 'wrong'}`}
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -30 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.span
            className="feedback-emoji"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', damping: 10 }}
          >
            {feedback.isCorrect ? '🎉' : '😅'}
          </motion.span>
          <motion.h3
            className="feedback-title"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {feedback.isCorrect ? 'Correct!' : 'Oops!'}
          </motion.h3>
          <motion.p
            className="feedback-message"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {feedback.message}
          </motion.p>
          <motion.div
            className="feedback-decoration"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Quiz Results Component
function QuizResults({ score, total, onRestart }) {
  const percentage = Math.round((score / total) * 100)

  useEffect(() => {
    if (percentage >= 60) {
      triggerConfetti()
    }
  }, [percentage])

  const getMessage = () => {
    if (percentage === 100) return "Perfect! You know them better than they know themselves!"
    if (percentage >= 80) return "Amazing! You're definitely in the inner circle!"
    if (percentage >= 60) return "Great job! You know them pretty well!"
    if (percentage >= 40) return "Not bad! There's always more to learn!"
    return "Time to spend more time with the couple!"
  }

  return (
    <motion.div
      className="quiz-results"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="results-3d">
        <Canvas3D
          camera={{ position: [0, 0, 4], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <QuizScene showTrophy={true} />
        </Canvas3D>
      </div>

      <div className="results-content">
        <h2>Quiz Complete!</h2>

        <div className="score-display">
          <span className="score-number">{score}</span>
          <span className="score-divider">/</span>
          <span className="score-total">{total}</span>
        </div>

        <div className="score-percentage">{percentage}%</div>

        <p className="results-message">{getMessage()}</p>

        <div className="results-actions">
          <motion.button
            className="btn btn-primary"
            onClick={onRestart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

function Quiz() {
  const [gameState, setGameState] = useState('intro') // 'intro', 'playing', 'results'
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)

  const handleStart = () => {
    setGameState('playing')
    setCurrentQuestion(0)
    setAnswers([])
    setScore(0)
    setFeedback(null)
  }

  const goToNextQuestion = useCallback(() => {
    if (!feedback) return // Prevent double-trigger
    setFeedback(null)
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setGameState('results')
    }
  }, [feedback, currentQuestion])

  const handleAnswer = useCallback((answerIndex) => {
    const newAnswers = [...answers, answerIndex]
    setAnswers(newAnswers)

    const isCorrect = answerIndex === quizQuestions[currentQuestion].correctAnswer
    if (isCorrect) {
      setScore((prev) => prev + 1)
    }

    // Show instant feedback
    setFeedback({
      isCorrect,
      message: getRandomMessage(isCorrect)
    })

    // Move to next question after showing feedback
    setTimeout(() => {
      goToNextQuestion()
    }, 5000) // Show feedback for 5 seconds
  }, [answers, currentQuestion])

  return (
    <motion.div
      className="quiz-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Intro State */}
      {gameState === 'intro' && (
        <section className="quiz-intro">
          <div className="quiz-intro-3d">
            <Canvas3D
              camera={{ position: [0, 0, 4], fov: 50 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
              style={{ background: 'transparent' }}
            >
              <IntroScene />
            </Canvas3D>
          </div>

          {/* Decorative diyas on sides */}
          <div className="intro-diya intro-diya-left">
            <Canvas3D
              camera={{ position: [0, 0.5, 2], fov: 45 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
              style={{ background: 'transparent' }}
            >
              <ambientLight intensity={0.4} />
              <Float speed={1.5} floatIntensity={0.3}>
                <Diya position={[0, 0, 0]} scale={1.2} flameIntensity={1.2} />
              </Float>
            </Canvas3D>
          </div>
          <div className="intro-diya intro-diya-right">
            <Canvas3D
              camera={{ position: [0, 0.5, 2], fov: 45 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
              style={{ background: 'transparent' }}
            >
              <ambientLight intensity={0.4} />
              <Float speed={1.5} floatIntensity={0.3}>
                <Diya position={[0, 0, 0]} scale={1.2} flameIntensity={1.2} />
              </Float>
            </Canvas3D>
          </div>

          <motion.div
            className="quiz-intro-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p className="section-subtitle">Test your knowledge</p>
            <h1>How Well Do You Know {coupleData.groomName} & {coupleData.brideName}?</h1>
            <div className="ornament ornament-lg" />
            <p className="quiz-description">
              Think you know everything about our favorite couple?
              Take this fun quiz to find out! {quizQuestions.length} questions
              about their journey together.
            </p>

            <motion.button
              className="btn btn-primary btn-large"
              onClick={handleStart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Quiz
            </motion.button>
          </motion.div>
        </section>
      )}

      {/* Playing State */}
      {gameState === 'playing' && (
        <section className="quiz-game">
          {/* 3D Mandala Background during gameplay */}
          <div className="quiz-game-3d">
            <FloatingElements variant="default" />
          </div>

          {/* Floating diyas for atmosphere */}
          <div className="gameplay-diyas">
            <Canvas3D
              camera={{ position: [0, 0, 5], fov: 50 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
              style={{ background: 'transparent' }}
            >
              <GameplayScene />
            </Canvas3D>
          </div>

          <div className="container">
            <QuizProgress
              current={currentQuestion + 1}
              total={quizQuestions.length}
            />

            <AnimatePresence mode="wait">
              <QuizQuestion
                key={currentQuestion}
                question={quizQuestions[currentQuestion]}
                questionIndex={currentQuestion}
                onAnswer={handleAnswer}
                selectedAnswer={answers[currentQuestion]}
                feedback={feedback}
              />
            </AnimatePresence>
          </div>

          {/* Feedback Popup */}
          <FeedbackPopup feedback={feedback} onDismiss={goToNextQuestion} />
        </section>
      )}

      {/* Results State */}
      {gameState === 'results' && (
        <section className="quiz-results-section">
          {/* 3D Hearts Background for celebration */}
          <div className="results-3d-bg">
            <FloatingElements variant="hearts" />
          </div>

          {/* Celebration fire and diyas */}
          <div className="celebration-fire">
            <Canvas3D
              camera={{ position: [0, 1, 5], fov: 50 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
              style={{ background: 'transparent' }}
            >
              <CelebrationScene />
            </Canvas3D>
          </div>

          <div className="container">
            <QuizResults
              score={score}
              total={quizQuestions.length}
              onRestart={handleStart}
            />
          </div>
        </section>
      )}

      <style>{`
        .quiz-page {
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* Quiz Intro */
        .quiz-intro {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: calc(var(--space-2xl) + 60px) var(--space-lg) var(--space-xl);
          background: linear-gradient(
            180deg,
            var(--cream) 0%,
            var(--cream-dark) 100%
          );
          text-align: center;
        }

        .quiz-intro-3d {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.8;
          pointer-events: none;
        }

        /* Decorative diyas on intro */
        .intro-diya {
          position: absolute;
          width: 150px;
          height: 200px;
          pointer-events: none;
          opacity: 0.9;
          z-index: 5;
        }

        .intro-diya-left {
          left: 5%;
          bottom: 15%;
        }

        .intro-diya-right {
          right: 5%;
          bottom: 15%;
        }

        .quiz-intro-content {
          position: relative;
          z-index: 20;
          max-width: 700px;
        }

        .quiz-intro-content h1 {
          font-family: var(--font-display);
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          margin-bottom: var(--space-md);
        }

        .quiz-description {
          font-family: var(--font-display);
          font-size: 1.125rem;
          font-style: italic;
          color: var(--warm-gray);
          margin-bottom: var(--space-xl);
        }

        .btn-large {
          padding: var(--space-md) var(--space-2xl);
          font-size: 1rem;
        }

        /* Quiz Game */
        .quiz-game {
          min-height: 100vh;
          padding: calc(var(--space-2xl) + 60px) var(--space-lg) var(--space-xl);
          background: var(--cream);
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .quiz-game-3d {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          opacity: 0.4;
          pointer-events: none;
        }

        /* Gameplay diyas for atmosphere */
        .gameplay-diyas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          opacity: 0.6;
          pointer-events: none;
        }

        .quiz-game .container {
          max-width: 700px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        /* Progress Bar */
        .quiz-progress {
          margin-bottom: var(--space-xl);
        }

        .progress-bar {
          height: 8px;
          background: var(--light-gray);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-bottom: var(--space-sm);
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--gold), var(--gold-dark));
          border-radius: var(--radius-full);
        }

        .progress-text {
          font-size: 0.875rem;
          color: var(--warm-gray);
        }

        /* Question */
        .quiz-question {
          background: var(--ivory);
          padding: var(--space-xl);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-soft);
        }

        .question-text {
          font-family: var(--font-display);
          font-size: clamp(1.25rem, 3vw, 1.75rem);
          color: var(--dark-brown);
          margin-bottom: var(--space-xl);
          text-align: center;
        }

        .options-grid {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .option-btn {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md) var(--space-lg);
          background: var(--cream);
          border: 2px solid var(--light-gray);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: left;
        }

        .option-btn:hover {
          border-color: var(--gold);
          background: var(--gold-light);
        }

        .option-btn.selected {
          border-color: var(--gold);
          background: var(--gold);
        }

        .option-btn.selected .option-letter,
        .option-btn.selected .option-text {
          color: var(--cream);
        }

        .option-letter {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: var(--gold-light);
          border-radius: 50%;
          font-weight: 600;
          color: var(--gold-dark);
          flex-shrink: 0;
        }

        .option-text {
          font-size: 1rem;
          color: var(--charcoal);
          flex: 1;
        }

        .option-icon {
          font-size: 1.25rem;
          font-weight: bold;
          margin-left: auto;
        }

        .option-btn.correct {
          border-color: #22c55e;
          background: rgba(34, 197, 94, 0.15);
        }

        .option-btn.correct .option-icon {
          color: #22c55e;
        }

        .option-btn.wrong {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.15);
        }

        .option-btn.wrong .option-icon {
          color: #ef4444;
        }

        .option-btn:disabled {
          cursor: not-allowed;
        }

        /* Feedback Popup Overlay */
        .feedback-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          backdrop-filter: blur(4px);
        }

        .feedback-popup {
          background: #FFFEF9;
          padding: var(--space-xl) var(--space-2xl);
          border-radius: var(--radius-lg);
          text-align: center;
          max-width: 450px;
          width: 90%;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
          position: relative;
          overflow: hidden;
        }

        .feedback-popup.correct {
          border: 3px solid #22c55e;
          background: linear-gradient(180deg, #FFFEF9 0%, #f0fdf4 100%);
        }

        .feedback-popup.wrong {
          border: 3px solid #ef4444;
          background: linear-gradient(180deg, #FFFEF9 0%, #fef2f2 100%);
        }

        .feedback-emoji {
          font-size: 4rem;
          display: block;
          margin-bottom: var(--space-md);
        }

        .feedback-title {
          font-family: var(--font-display);
          font-size: 1.75rem;
          margin: 0 0 var(--space-sm);
        }

        .feedback-popup.correct .feedback-title {
          color: #16a34a;
        }

        .feedback-popup.wrong .feedback-title {
          color: #dc2626;
        }

        .feedback-message {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-style: italic;
          color: var(--dark-brown);
          margin: 0;
          line-height: 1.5;
        }

        .feedback-decoration {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .feedback-popup.correct .feedback-decoration {
          background: linear-gradient(90deg, #22c55e, #86efac, #22c55e);
        }

        .feedback-popup.wrong .feedback-decoration {
          background: linear-gradient(90deg, #ef4444, #fca5a5, #ef4444);
        }

        /* Results */
        .quiz-results-section {
          min-height: 100vh;
          padding: calc(var(--space-2xl) + 60px) var(--space-lg) var(--space-xl);
          background: linear-gradient(
            180deg,
            var(--cream) 0%,
            var(--gold-light) 100%
          );
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .results-3d-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          opacity: 0.5;
          pointer-events: none;
        }

        /* Celebration fire for results */
        .celebration-fire {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          opacity: 0.7;
          pointer-events: none;
        }

        .quiz-results-section .container {
          position: relative;
          z-index: 10;
        }

        .quiz-results {
          max-width: 500px;
          margin: 0 auto;
          text-align: center;
        }

        .results-3d {
          height: 200px;
          margin-bottom: var(--space-lg);
        }

        .results-content h2 {
          font-family: var(--font-display);
          font-size: 2.5rem;
          color: var(--dark-brown);
          margin-bottom: var(--space-lg);
        }

        .score-display {
          display: flex;
          justify-content: center;
          align-items: baseline;
          gap: var(--space-sm);
          margin-bottom: var(--space-sm);
        }

        .score-number {
          font-family: var(--font-display);
          font-size: 5rem;
          font-weight: 500;
          color: var(--gold);
          line-height: 1;
        }

        .score-divider {
          font-size: 3rem;
          color: var(--warm-gray);
        }

        .score-total {
          font-family: var(--font-display);
          font-size: 2rem;
          color: var(--warm-gray);
        }

        .score-percentage {
          font-size: 1.5rem;
          color: var(--gold-dark);
          margin-bottom: var(--space-lg);
        }

        .results-message {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-style: italic;
          color: var(--dark-brown);
          margin-bottom: var(--space-xl);
        }

        .results-actions {
          display: flex;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .quiz-intro {
            min-height: auto;
            padding-top: calc(var(--space-2xl) + 80px);
            padding-bottom: var(--space-2xl);
          }

          .intro-diya {
            width: 100px;
            height: 150px;
          }

          .intro-diya-left {
            left: 2%;
            bottom: 10%;
          }

          .intro-diya-right {
            right: 2%;
            bottom: 10%;
          }

          .quiz-game {
            padding-top: calc(var(--space-xl) + 80px);
          }

          .gameplay-diyas {
            opacity: 0.4;
          }

          .celebration-fire {
            opacity: 0.5;
          }

          .quiz-question {
            padding: var(--space-lg);
          }

          .score-number {
            font-size: 4rem;
          }
        }

        @media (max-width: 480px) {
          .intro-diya {
            display: none;
          }
        }
      `}</style>
    </motion.div>
  )
}

export default Quiz
