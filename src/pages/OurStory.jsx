import { useRef, Suspense } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles, Stars, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { loveStoryMilestones, coupleData } from '../data/weddingData'
import FloatingElements from '../components/3d/FloatingElements'
import { Kalash } from '../components/3d/Kalash'
import Canvas3D from '../components/3d/Canvas3D'

// 3D Heart for timeline
function Heart3D({ color = '#E8A4B8', scale = 1 }) {
  const meshRef = useRef()

  const heartShape = new THREE.Shape()
  const x = 0, y = 0
  heartShape.moveTo(x + 0.25, y + 0.25)
  heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y)
  heartShape.bezierCurveTo(x - 0.35, y, x - 0.35, y + 0.35, x - 0.35, y + 0.35)
  heartShape.bezierCurveTo(x - 0.35, y + 0.55, x - 0.2, y + 0.77, x + 0.25, y + 0.95)
  heartShape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.85, y + 0.55, x + 0.85, y + 0.35)
  heartShape.bezierCurveTo(x + 0.85, y + 0.35, x + 0.85, y, x + 0.5, y)
  heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
      meshRef.current.scale.setScalar(scale * (1 + Math.sin(state.clock.elapsedTime * 2) * 0.05))
    }
  })

  return (
    <Float speed={2} floatIntensity={0.3}>
      <mesh ref={meshRef} rotation={[0, 0, Math.PI]} scale={scale}>
        <extrudeGeometry
          args={[heartShape, { depth: 0.2, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 }]}
        />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </mesh>
    </Float>
  )
}

// 3D Scene for timeline header with Kalash
function TimelineScene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#FFF8DC" />
      <pointLight position={[-5, 3, 5]} intensity={0.5} color="#FFD700" />
      <spotLight
        position={[0, 10, 5]}
        angle={0.3}
        penumbra={1}
        intensity={0.8}
        color="#FFF8DC"
      />

      {/* Heart on the left */}
      <group position={[-2.5, 0, 0]}>
        <Heart3D color="#D4AF37" scale={1.2} />
      </group>

      {/* Kalash in the center - symbol of abundance and good fortune */}
      <Suspense fallback={null}>
        <group position={[0, -1.5, 0]}>
          <Kalash position={[0, 0, 0]} scale={0.8} color="#B87333" />
        </group>
      </Suspense>

      {/* Heart on the right */}
      <group position={[2.5, 0, 0]}>
        <Heart3D color="#D4AF37" scale={1.2} />
      </group>

      <Sparkles count={80} scale={8} size={2} speed={0.3} color="#D4AF37" opacity={0.5} />
      <Sparkles count={40} scale={6} size={1.5} speed={0.4} color="#FFD700" opacity={0.4} />

      <Environment preset="studio" />
    </>
  )
}

// Timeline Item Component
function TimelineItem({ milestone, index }) {
  const isEven = index % 2 === 0

  return (
    <motion.div
      className={`timeline-item ${isEven ? 'left' : 'right'}`}
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      <div className="timeline-content">
        <div className="timeline-icon">{milestone.icon}</div>
        <span className="timeline-year">{milestone.year}</span>
        <h3 className="timeline-title">{milestone.title}</h3>
        <p className="timeline-description">{milestone.description}</p>
      </div>
      <div className="timeline-dot">
        <div className="timeline-dot-inner" />
      </div>
    </motion.div>
  )
}

function OurStory() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <motion.div
      className="our-story-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="story-hero">
        <div className="story-hero-3d">
          <Canvas3D
            camera={{ position: [0, 0, 5], fov: 50 }}
          >
            <TimelineScene />
          </Canvas3D>
        </div>

        <motion.div
          className="story-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="section-subtitle">The journey of</p>
          <h1>{coupleData.groomName} <span className="text-gold">&</span> {coupleData.brideName}</h1>
          <div className="ornament ornament-lg" />
          <p className="story-intro">
            Every love story is beautiful, but ours is our favorite.
            Here's how our journey together began and led us to forever.
          </p>
          <p className="kalash-blessing">
            May the sacred Kalash bless our union with abundance and prosperity
          </p>
        </motion.div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section" ref={containerRef}>
        <div className="container">
          <div className="timeline">
            {/* Animated line */}
            <div className="timeline-line">
              <motion.div
                className="timeline-line-progress"
                style={{ height: lineHeight }}
              />
            </div>

            {/* Milestones */}
            {loveStoryMilestones.map((milestone, index) => (
              <TimelineItem
                key={milestone.id}
                milestone={milestone}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="quote-section">
        {/* 3D Mandala Background */}
        <div className="quote-3d-bg">
          <FloatingElements variant="mandala" />
        </div>
        <motion.div
          className="container text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <blockquote className="love-quote">
            "I have found the one whom my soul loves."
          </blockquote>
          <cite>- Song of Solomon 3:4</cite>
        </motion.div>
      </section>

      <style>{`
        .our-story-page {
          overflow-x: hidden;
        }

        /* Story Hero */
        .story-hero {
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: calc(var(--space-2xl) + 60px) var(--space-lg) var(--space-2xl);
          background: linear-gradient(
            180deg,
            var(--cream) 0%,
            var(--cream-dark) 100%
          );
          text-align: center;
        }

        .story-hero-3d {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.85;
          pointer-events: none;
        }

        /* Kalash styling for Indian wedding aesthetic */
        .story-hero-3d canvas {
          filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.3));
        }

        .story-hero-content {
          position: relative;
          z-index: 10;
          max-width: 700px;
        }

        .story-hero-content h1 {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 6vw, 4rem);
          margin-bottom: var(--space-md);
        }

        .story-intro {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-style: italic;
          color: var(--warm-gray);
          max-width: 500px;
          margin: 0 auto;
        }

        .kalash-blessing {
          font-family: var(--font-display);
          font-size: 0.95rem;
          color: var(--gold-dark);
          margin-top: var(--space-md);
          opacity: 0.85;
          letter-spacing: 0.5px;
        }

        /* Timeline Section */
        .timeline-section {
          padding: var(--space-2xl) 0;
          background: var(--cream);
        }

        .timeline {
          position: relative;
          max-width: 900px;
          margin: 0 auto;
          padding: var(--space-xl) 0;
        }

        .timeline-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--light-gray);
          transform: translateX(-50%);
        }

        .timeline-line-progress {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          background: linear-gradient(180deg, var(--gold), var(--gold-dark));
          border-radius: 2px;
        }

        .timeline-item {
          position: relative;
          width: 50%;
          padding: var(--space-lg);
          display: flex;
          align-items: center;
        }

        .timeline-item.left {
          padding-right: calc(var(--space-xl) + 20px);
          text-align: right;
          justify-content: flex-end;
        }

        .timeline-item.right {
          margin-left: 50%;
          padding-left: calc(var(--space-xl) + 20px);
          text-align: left;
        }

        .timeline-content {
          background: var(--ivory);
          padding: var(--space-xl);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-soft);
          max-width: 350px;
          position: relative;
          border: 1px solid rgba(212, 175, 55, 0.1);
          transition: all var(--transition-medium);
        }

        .timeline-content:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-medium);
          border-color: rgba(212, 175, 55, 0.3);
        }

        .timeline-icon {
          font-size: 2.5rem;
          margin-bottom: var(--space-md);
        }

        .timeline-year {
          display: inline-block;
          background: linear-gradient(135deg, var(--gold), var(--gold-dark));
          color: var(--cream);
          padding: var(--space-xs) var(--space-md);
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: var(--space-sm);
        }

        .timeline-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          color: var(--dark-brown);
          margin-bottom: var(--space-sm);
        }

        .timeline-description {
          color: var(--warm-gray);
          font-size: 0.9375rem;
          line-height: 1.6;
          margin: 0;
        }

        .timeline-dot {
          position: absolute;
          width: 20px;
          height: 20px;
          background: var(--cream);
          border: 3px solid var(--gold);
          border-radius: 50%;
          z-index: 10;
        }

        .timeline-item.left .timeline-dot {
          right: -10px;
        }

        .timeline-item.right .timeline-dot {
          left: -10px;
        }

        .timeline-dot-inner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          background: var(--gold);
          border-radius: 50%;
        }

        /* Quote Section */
        .quote-section {
          padding: var(--space-2xl) 0;
          background: linear-gradient(
            135deg,
            var(--cream-dark) 0%,
            var(--gold-light) 50%,
            var(--cream-dark) 100%
          );
          position: relative;
          overflow: hidden;
        }

        .quote-3d-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          opacity: 0.5;
          pointer-events: none;
        }

        .quote-section .container {
          position: relative;
          z-index: 1;
        }

        .love-quote {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          font-style: italic;
          color: var(--dark-brown);
          margin: 0 0 var(--space-md);
          line-height: 1.4;
        }

        .quote-section cite {
          font-family: var(--font-body);
          font-size: 1rem;
          color: var(--gold-dark);
          font-style: normal;
        }

        @media (max-width: 768px) {
          .timeline-line {
            left: 30px;
          }

          .timeline-item {
            width: 100%;
            padding-left: 70px !important;
            padding-right: var(--space-md) !important;
            text-align: left !important;
            justify-content: flex-start !important;
          }

          .timeline-item.right {
            margin-left: 0;
          }

          .timeline-item.left .timeline-dot,
          .timeline-item.right .timeline-dot {
            left: 21px;
            right: auto;
          }

          .timeline-content {
            max-width: 100%;
          }

          .story-hero {
            min-height: 60vh;
          }
        }
      `}</style>
    </motion.div>
  )
}

export default OurStory
