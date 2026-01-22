import { motion } from 'framer-motion'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles, Stars } from '@react-three/drei'
import { useRef, useMemo, Suspense } from 'react'
import * as THREE from 'three'
import { events, coupleData } from '../data/weddingData'
import FloatingElements from '../components/3d/FloatingElements'
import { Diya, DiyaArrangement } from '../components/3d/Diya'
import Canvas3D from '../components/3d/Canvas3D'

// 3D Marigold for Events page
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

function Events() {
  return (
    <motion.div
      className="events-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="events-hero">
        <div className="events-hero-3d">
          <Canvas3D
            camera={{ position: [0, 2, 6], fov: 50 }}
            shadows
          >
            <EventsScene />
          </Canvas3D>
        </div>

        <motion.div
          className="events-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="section-subtitle">Join us for</p>
          <h1>Functions & Ceremonies</h1>
          <div className="ornament ornament-lg" />
          <p className="events-intro">
            Two days of celebration, traditions, and joy as we begin our forever together.
          </p>
        </motion.div>
      </section>

      {/* Schedule Section */}
      <section className="schedule-section mandala-bg">
        <div className="container">
          {/* Day 1 */}
          <motion.div
            className="day-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>Day One</h2>
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
            <h2>Day Two</h2>
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
      <section className="venue-section">
        {/* 3D Hearts Background */}
        <div className="venue-3d-bg">
          <FloatingElements variant="hearts" />
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
                Alwar Motel and Resorts<br />
                Alwar, Rajasthan
              </p>
              <p className="venue-note">
                All ceremonies will be held at this beautiful venue.
                Please check individual event details for specific locations within the resort.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        .events-page {
          overflow-x: hidden;
        }

        /* Events Hero */
        .events-hero {
          min-height: 65vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: calc(var(--space-2xl) + 60px) var(--space-lg) var(--space-xl);
          background: linear-gradient(
            180deg,
            var(--cream) 0%,
            #FDF5E6 30%,
            var(--cream-dark) 100%
          );
          text-align: center;
          overflow: hidden;
        }

        .events-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            ellipse at center bottom,
            rgba(255, 140, 0, 0.08) 0%,
            rgba(255, 215, 0, 0.05) 40%,
            transparent 70%
          );
          pointer-events: none;
        }

        .events-hero-3d {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.85;
          pointer-events: none;
          z-index: 1;
        }

        .events-hero-content {
          position: relative;
          z-index: 10;
          max-width: 700px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          padding: var(--space-xl) var(--space-2xl);
          border-radius: var(--radius-lg);
          box-shadow: 0 8px 32px rgba(212, 175, 55, 0.15);
          border: 1px solid rgba(212, 175, 55, 0.2);
        }

        .events-hero-content h1 {
          font-family: var(--font-display);
          font-size: clamp(2rem, 5vw, 3.5rem);
          margin-bottom: var(--space-md);
        }

        .events-intro {
          font-family: var(--font-display);
          font-size: 1.125rem;
          font-style: italic;
          color: var(--warm-gray);
        }

        /* Schedule Section */
        .schedule-section {
          padding: var(--space-xl) 0 var(--space-2xl);
          background: var(--cream);
        }

        .day-header {
          text-align: center;
          margin: var(--space-2xl) 0 var(--space-xl);
        }

        .day-header:first-of-type {
          margin-top: 0;
        }

        .day-header h2 {
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

        @media (max-width: 768px) {
          .events-grid {
            grid-template-columns: 1fr;
          }

          .events-hero {
            min-height: 55vh;
          }

          .events-hero-content {
            padding: var(--space-lg) var(--space-md);
            margin: 0 var(--space-sm);
          }

          .event-card {
            padding: var(--space-lg);
          }
        }
      `}</style>
    </motion.div>
  )
}

export default Events
