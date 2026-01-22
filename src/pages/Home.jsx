import { useEffect, useState, Suspense, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import { coupleData, getCountdown, events } from '../data/weddingData'
import FloatingElements from '../components/3d/FloatingElements'
import Canvas3D from '../components/3d/Canvas3D'
import SacredFire from '../components/3d/SacredFire'
import { DiyaArrangement } from '../components/3d/Diya'

// Smooth scroll function for anchor navigation
const scrollToSection = (e, sectionId) => {
  e.preventDefault()
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
}

// Countdown Component
function Countdown() {
  const [countdown, setCountdown] = useState(getCountdown())

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const timeUnits = [
    { label: 'Days', value: countdown.days },
    { label: 'Hours', value: countdown.hours },
    { label: 'Minutes', value: countdown.minutes },
    { label: 'Seconds', value: countdown.seconds }
  ]

  return (
    <div className="countdown">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          className="countdown-unit"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + index * 0.1 }}
        >
          <span className="countdown-value">{String(unit.value).padStart(2, '0')}</span>
          <span className="countdown-label">{unit.label}</span>
        </motion.div>
      ))}
    </div>
  )
}

// 3D Marigold for Events section
function Marigold3D({ position = [0, 0, 0], scale = 1 }) {
  const groupRef = useRef()
  const petalCount = 20

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Float speed={1.5} floatIntensity={0.3}>
      <group ref={groupRef} position={position} scale={scale}>
        <mesh>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#FF6600" roughness={0.7} />
        </mesh>
        {Array.from({ length: petalCount }, (_, i) => {
          const angle = (i / petalCount) * Math.PI * 2
          const layer = Math.floor(i / 10)
          const radius = 0.35 + layer * 0.15
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                layer * 0.08,
                Math.sin(angle) * radius
              ]}
              rotation={[0, angle, Math.PI / 5]}
            >
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#FF9933' : '#FFCC00'}
                roughness={0.5}
              />
            </mesh>
          )
        })}
      </group>
    </Float>
  )
}

// 3D Scene for Events with Diyas in Rangoli Pattern
function EventsScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#FFF8DC" />
      <pointLight position={[-5, -5, 5]} intensity={0.4} color="#FF9933" />
      <pointLight position={[0, 3, 2]} intensity={0.5} color="#FF8C00" />

      {/* Marigolds for color variety */}
      <Marigold3D position={[-3, 1.5, -1]} scale={0.8} />
      <Marigold3D position={[3, 1.2, -0.5]} scale={0.7} />

      {/* Diya Arrangement in Rangoli Pattern - symbolizes light and prosperity */}
      <Suspense fallback={null}>
        <group position={[0, -0.5, 0]} scale={0.6}>
          <DiyaArrangement
            count={8}
            radius={2.5}
            pattern="rangoli"
            centerDiya={true}
            scale={1}
          />
        </group>
      </Suspense>

      {/* Golden sparkles */}
      <Sparkles count={100} scale={10} size={2} speed={0.3} color="#FFD700" opacity={0.5} />
      <Sparkles count={60} scale={8} size={1.5} speed={0.2} color="#FF9933" opacity={0.4} />
    </>
  )
}

// Event Card Component
function EventCard({ event, index }) {
  return (
    <motion.div
      className="event-card"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      style={{ '--event-color': event.color }}
    >
      <div className="event-icon">{event.icon}</div>

      <div className="event-header">
        <h3 className="event-name">{event.name}</h3>
        <div className="event-date-badge" style={{ background: event.gradient }}>
          {event.dateDisplay}
        </div>
      </div>

      <div className="event-details">
        <div className="event-detail">
          <span className="detail-icon">🕐</span>
          <span className="detail-text">{event.time}</span>
        </div>

        <div className="event-detail">
          <span className="detail-icon">📍</span>
          <span className="detail-text">{event.venue}</span>
        </div>

        <div className="event-detail dress-code">
          <span className="detail-icon">👗</span>
          <div className="detail-text">
            <strong>Dress Code:</strong> {event.dressCode}
            {event.dressCodeNote && (
              <span className="dress-note">({event.dressCodeNote})</span>
            )}
          </div>
        </div>

        <div className="event-detail">
          <span className="detail-icon">🍽️</span>
          <span className="detail-text">Followed by {event.followedBy}</span>
        </div>
      </div>

      <p className="event-description">{event.description}</p>

      <div className="event-accent" style={{ background: event.gradient }} />
    </motion.div>
  )
}

// Decorative Paisley SVG
function PaisleyDecor({ className = '' }) {
  return (
    <svg
      className={`paisley-decor ${className}`}
      viewBox="0 0 100 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 10C30 10 15 30 15 55C15 80 30 100 50 130C70 100 85 80 85 55C85 30 70 10 50 10Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="1" fill="none" />
      <path
        d="M50 35C45 45 45 55 50 65C55 55 55 45 50 35Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  )
}

function Home() {
  return (
    <motion.div
      className="home-page"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      variants={containerVariants}
    >
      {/* Hero Section */}
      <section className="hero">
        {/* Sacred Fire Background - Agni is central to Hindu wedding ceremonies */}
        <div className="hero-sacred-fire">
          <Suspense fallback={null}>
            <SacredFire intensity={0.8} showKund={false} />
          </Suspense>
        </div>

        {/* Decorative Elements */}
        <PaisleyDecor className="hero-paisley left" />
        <PaisleyDecor className="hero-paisley right" />

        {/* Content */}
        <div className="hero-content">
          <motion.div className="hero-text" variants={itemVariants}>
            <p className="wedding-invite-text">Together with their families</p>

            <motion.h1
              className="couple-names"
              variants={itemVariants}
            >
              <span className="name">{coupleData.groomName}</span>
              <span className="ampersand">&</span>
              <span className="name">{coupleData.brideName}</span>
            </motion.h1>

            <motion.p className="wedding-tagline" variants={itemVariants}>
              {coupleData.tagline}
            </motion.p>

            <motion.div className="ornament ornament-lg" variants={itemVariants} />

            <motion.div className="wedding-date-section" variants={itemVariants}>
              <p className="save-the-date">Request the pleasure of your company</p>
              <h2 className="wedding-date">February 7-8, 2026</h2>
              <p className="wedding-venue">
                {coupleData.venue.name}<br />
                {coupleData.venue.city}, {coupleData.venue.state}
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Countdown />
            </motion.div>

            <motion.div className="hero-cta" variants={itemVariants}>
              <a
                href="#events"
                className="btn btn-primary"
                onClick={(e) => scrollToSection(e, 'events')}
              >
                View Events
              </a>
              <Link to="/our-story" className="btn btn-secondary">
                Our Story
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <span>Scroll to explore</span>
          <motion.div
            className="scroll-arrow"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ↓
          </motion.div>
        </motion.div>
      </section>

      {/* Events Section with 3D Diyas */}
      <section id="events" className="events-section">
        {/* 3D Diyas Background */}
        <div className="events-3d-bg">
          <Canvas3D
            camera={{ position: [0, 2, 6], fov: 50 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
          >
            <EventsScene />
          </Canvas3D>
        </div>

        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="section-subtitle">Join us for</p>
            <h2>Functions & Ceremonies</h2>
            <div className="ornament ornament-lg" />
            <p className="events-intro">
              Two days of celebration, traditions, and joy as we begin our forever together.
            </p>
          </motion.div>

          {/* Day 1 */}
          <motion.div
            className="day-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="day-title">Day One</h3>
            <p className="day-date">Saturday, February 7th, 2026</p>
          </motion.div>

          <div className="events-grid">
            {events
              .filter(event => event.date === '2026-02-07')
              .map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
          </div>

          {/* Day 2 */}
          <motion.div
            className="day-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="day-title">Day Two</h3>
            <p className="day-date">Sunday, February 8th, 2026</p>
          </motion.div>

          <div className="events-grid">
            {events
              .filter(event => event.date === '2026-02-08')
              .map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
          </div>
        </div>
      </section>

      {/* Venue Section */}
      <section id="venue" className="venue-section">
        {/* 3D Hearts Background */}
        <div className="venue-3d-bg">
          <Suspense fallback={null}>
            <FloatingElements variant="hearts" />
          </Suspense>
        </div>
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="section-subtitle">The Venue</p>
            <h2>{coupleData.venue.name}</h2>
            <div className="ornament" />
          </motion.div>

          <motion.div
            className="venue-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="venue-info">
              <p className="venue-address">
                <span className="venue-icon">📍</span>
                {coupleData.venue.name}<br />
                {coupleData.venue.city}, {coupleData.venue.state}
              </p>
              <p className="venue-note">
                All ceremonies will be held at this beautiful venue.
                Please check individual event details for specific locations within the resort.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hashtag Section */}
      <section className="hashtag-section">
        {/* 3D Floating Hearts Background */}
        <div className="section-3d-bg hashtag-3d">
          <Suspense fallback={null}>
            <FloatingElements variant="hearts" />
          </Suspense>
        </div>
        <motion.div
          className="container text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="hashtag-label">Share your moments with us</p>
          <h2 className="hashtag gradient-text">{coupleData.hashtag}</h2>
        </motion.div>
      </section>

      <style>{`
        .home-page {
          overflow-x: hidden;
        }

        /* Hero Section */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: var(--space-2xl) var(--space-lg);
          background: linear-gradient(
            135deg,
            var(--cream) 0%,
            var(--cream-dark) 50%,
            var(--gold-light) 100%
          );
          overflow: hidden;
        }

        /* Sacred Fire Background */
        .hero-sacred-fire {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -40%);
          width: 600px;
          height: 600px;
          z-index: 1;
          opacity: 0.55;
          pointer-events: none;
          filter: blur(1px);
        }

        .section-3d-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          opacity: 0.4;
          pointer-events: none;
        }

        .hashtag-3d {
          opacity: 0.5;
        }

        .hero-paisley {
          position: absolute;
          width: 150px;
          height: auto;
          color: var(--gold);
          opacity: 0.15;
          z-index: 0;
        }

        .hero-paisley.left {
          left: 5%;
          top: 20%;
          transform: rotate(-15deg);
        }

        .hero-paisley.right {
          right: 5%;
          bottom: 20%;
          transform: rotate(15deg) scaleX(-1);
        }

        .hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          max-width: 800px;
        }

        .wedding-invite-text {
          font-family: var(--font-display);
          font-style: italic;
          font-size: 1.25rem;
          color: var(--warm-gray);
          margin-bottom: var(--space-md);
        }

        .couple-names {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-sm);
          margin-bottom: var(--space-md);
        }

        .couple-names .name {
          font-family: var(--font-display);
          font-size: clamp(3rem, 10vw, 6rem);
          font-weight: 400;
          color: var(--dark-brown);
          line-height: 1;
        }

        .couple-names .ampersand {
          font-family: var(--font-display);
          font-size: clamp(2rem, 6vw, 3.5rem);
          color: var(--gold);
          font-style: italic;
        }

        .wedding-tagline {
          font-family: var(--font-display);
          font-style: italic;
          font-size: 1.5rem;
          color: var(--gold-dark);
          margin-bottom: var(--space-lg);
        }

        .save-the-date {
          font-family: var(--font-body);
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.875rem;
          color: var(--warm-gray);
          margin-bottom: var(--space-sm);
        }

        .wedding-date {
          font-family: var(--font-display);
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          color: var(--dark-brown);
          margin-bottom: var(--space-sm);
        }

        .wedding-venue {
          font-family: var(--font-body);
          color: var(--warm-gray);
          line-height: 1.8;
        }

        /* Countdown */
        .countdown {
          display: flex;
          justify-content: center;
          gap: var(--space-lg);
          margin: var(--space-xl) 0;
        }

        .countdown-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 70px;
        }

        .countdown-value {
          font-family: var(--font-display);
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 500;
          color: var(--gold-dark);
          line-height: 1;
          background: linear-gradient(135deg, var(--gold-dark), var(--gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .countdown-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--warm-gray);
          margin-top: var(--space-xs);
        }

        /* Hero CTA */
        .hero-cta {
          display: flex;
          gap: var(--space-md);
          justify-content: center;
          flex-wrap: wrap;
        }

        /* Scroll Indicator */
        .scroll-indicator {
          position: absolute;
          bottom: var(--space-xl);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-sm);
          color: var(--warm-gray);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .scroll-arrow {
          font-size: 1.25rem;
          color: var(--gold);
        }

        /* Events Section */
        .events-section {
          padding: var(--space-2xl) 0;
          background: var(--cream);
          position: relative;
          overflow: hidden;
        }

        .events-section .container {
          position: relative;
          z-index: 1;
        }

        .events-3d-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 400px;
          opacity: 0.7;
          pointer-events: none;
          z-index: 0;
        }

        .events-intro {
          font-family: var(--font-display);
          font-size: 1.125rem;
          font-style: italic;
          color: var(--warm-gray);
          max-width: 600px;
          margin: var(--space-md) auto 0;
        }

        .day-header {
          text-align: center;
          margin: var(--space-2xl) 0 var(--space-xl);
        }

        .day-header:first-of-type {
          margin-top: var(--space-xl);
        }

        .day-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3rem);
          color: var(--gold-dark);
          margin-bottom: var(--space-sm);
        }

        .day-date {
          font-family: var(--font-body);
          font-size: 1.125rem;
          color: var(--warm-gray);
          margin: 0;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: var(--space-xl);
          max-width: 1000px;
          margin: 0 auto;
        }

        /* Event Card */
        .event-card {
          background: var(--ivory);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-soft);
          border: 1px solid rgba(212, 175, 55, 0.1);
          transition: all var(--transition-medium);
        }

        .event-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-medium);
        }

        .event-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .event-icon {
          font-size: 3rem;
          margin-bottom: var(--space-md);
        }

        .event-header {
          margin-bottom: var(--space-lg);
        }

        .event-name {
          font-family: var(--font-display);
          font-size: 2rem;
          color: var(--dark-brown);
          margin: 0 0 var(--space-sm);
        }

        .event-date-badge {
          display: inline-block;
          color: white;
          padding: var(--space-xs) var(--space-md);
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .event-details {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          margin-bottom: var(--space-lg);
        }

        .event-detail {
          display: flex;
          align-items: flex-start;
          gap: var(--space-sm);
        }

        .detail-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .detail-text {
          color: var(--charcoal);
          font-size: 0.9375rem;
          line-height: 1.5;
        }

        .dress-code .detail-text {
          display: flex;
          flex-direction: column;
        }

        .dress-note {
          font-size: 0.8125rem;
          color: var(--warm-gray);
          font-style: italic;
          margin-top: 2px;
        }

        .event-description {
          color: var(--warm-gray);
          font-size: 0.9375rem;
          font-style: italic;
          margin: 0;
          padding-top: var(--space-md);
          border-top: 1px solid var(--light-gray);
        }

        /* Venue Section */
        .venue-section {
          padding: var(--space-2xl) 0;
          background: linear-gradient(
            135deg,
            var(--cream-dark) 0%,
            var(--gold-light) 100%
          );
          position: relative;
          overflow: hidden;
        }

        .venue-3d-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          opacity: 0.5;
          pointer-events: none;
        }

        .venue-section .container {
          position: relative;
          z-index: 1;
        }

        .venue-card {
          max-width: 600px;
          margin: 0 auto;
          background: var(--ivory);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
          box-shadow: var(--shadow-soft);
          text-align: center;
        }

        .venue-address {
          font-family: var(--font-display);
          font-size: 1.25rem;
          color: var(--dark-brown);
          margin: 0 0 var(--space-md);
          line-height: 1.6;
        }

        .venue-icon {
          display: block;
          font-size: 2rem;
          margin-bottom: var(--space-sm);
        }

        .venue-note {
          color: var(--warm-gray);
          font-size: 0.9375rem;
          margin: 0;
        }

        /* Hashtag Section */
        .hashtag-section {
          padding: var(--space-2xl) 0;
          background: linear-gradient(
            135deg,
            var(--cream-dark) 0%,
            var(--gold-light) 100%
          );
          position: relative;
          overflow: hidden;
        }

        .hashtag-section .container {
          position: relative;
          z-index: 1;
        }

        .hashtag-label {
          font-family: var(--font-body);
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.875rem;
          color: var(--warm-gray);
          margin-bottom: var(--space-md);
        }

        .hashtag {
          font-family: var(--font-display);
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .hero {
            padding: var(--space-xl) var(--space-md);
          }

          .hero-paisley {
            width: 80px;
            opacity: 0.1;
          }

          .hero-sacred-fire {
            width: 350px;
            height: 350px;
            opacity: 0.4;
            transform: translate(-50%, -35%);
          }

          .countdown {
            gap: var(--space-md);
          }

          .countdown-unit {
            min-width: 50px;
          }

          .hero-cta {
            flex-direction: column;
            align-items: center;
          }

          .hero-cta .btn {
            width: 100%;
            max-width: 250px;
          }

          .events-grid {
            grid-template-columns: 1fr;
          }

          .events-3d-bg {
            height: 300px;
            opacity: 0.5;
          }

          .event-card {
            padding: var(--space-lg);
          }
        }
      `}</style>
    </motion.div>
  )
}

export default Home
