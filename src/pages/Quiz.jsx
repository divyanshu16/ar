import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import { useRef } from 'react'
import confetti from 'canvas-confetti'
import { quizQuestions, coupleData } from '../data/weddingData'

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

// 3D Scene
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
function QuizQuestion({ question, questionIndex, onAnswer, selectedAnswer }) {
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
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            className={`option-btn ${selectedAnswer === index ? 'selected' : ''}`}
            onClick={() => onAnswer(index)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <span className="option-letter">{String.fromCharCode(65 + index)}</span>
            <span className="option-text">{option}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
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
        <Canvas
          camera={{ position: [0, 0, 4], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <QuizScene showTrophy={true} />
        </Canvas>
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

  const handleStart = () => {
    setGameState('playing')
    setCurrentQuestion(0)
    setAnswers([])
    setScore(0)
  }

  const handleAnswer = useCallback((answerIndex) => {
    const newAnswers = [...answers, answerIndex]
    setAnswers(newAnswers)

    const isCorrect = answerIndex === quizQuestions[currentQuestion].correctAnswer
    if (isCorrect) {
      setScore((prev) => prev + 1)
    }

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
      } else {
        setGameState('results')
      }
    }, 500)
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
            <Canvas
              camera={{ position: [0, 0, 4], fov: 50 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
              style={{ background: 'transparent' }}
            >
              <QuizScene showTrophy={false} />
            </Canvas>
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
              />
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Results State */}
      {gameState === 'results' && (
        <section className="quiz-results-section">
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
          opacity: 0.5;
          pointer-events: none;
        }

        .quiz-intro-content {
          position: relative;
          z-index: 10;
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
        }

        .quiz-game .container {
          max-width: 700px;
          margin: 0 auto;
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

          .quiz-game {
            padding-top: calc(var(--space-xl) + 80px);
          }

          .quiz-question {
            padding: var(--space-lg);
          }

          .score-number {
            font-size: 4rem;
          }
        }
      `}</style>
    </motion.div>
  )
}

export default Quiz
