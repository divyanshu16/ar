import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { coupleData, getCountdown } from '../data/weddingData'
import WeddingRings from '../components/3d/WeddingRings'

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
        {/* 3D Wedding Rings Background */}
        <div className="hero-3d-container">
          <WeddingRings />
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
              <Link to="/events" className="btn btn-primary">
                View Events
              </Link>
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

      {/* Quick Info Section */}
      <section className="quick-info section mandala-bg">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="section-subtitle">Join us in celebration</p>
            <h2>A Royal Rajasthani Wedding</h2>
            <div className="ornament" />
          </motion.div>

          <div className="info-grid">
            <motion.div
              className="info-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <div className="info-icon">🎨</div>
              <h3>Mehendi & Sangeet</h3>
              <p>February 7th</p>
              <p className="info-detail">An evening of art, music, and dance</p>
            </motion.div>

            <motion.div
              className="info-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="info-icon">💛</div>
              <h3>Haldi Ceremony</h3>
              <p>February 8th Morning</p>
              <p className="info-detail">Blessings of turmeric and joy</p>
            </motion.div>

            <motion.div
              className="info-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="info-icon">💍</div>
              <h3>Wedding Ceremony</h3>
              <p>February 8th Evening</p>
              <p className="info-detail">Where two hearts become one</p>
            </motion.div>
          </div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            style={{ marginTop: 'var(--space-xl)' }}
          >
            <Link to="/events" className="btn btn-primary">
              View Full Schedule
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Hashtag Section */}
      <section className="hashtag-section">
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

        .hero-3d-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          opacity: 0.8;
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

        /* Quick Info Section */
        .quick-info {
          background: var(--cream);
          padding: var(--space-2xl) 0;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--space-lg);
          margin-top: var(--space-xl);
        }

        .info-card {
          background: var(--ivory);
          padding: var(--space-xl);
          border-radius: var(--radius-lg);
          text-align: center;
          box-shadow: var(--shadow-soft);
          transition: all var(--transition-medium);
          border: 1px solid rgba(212, 175, 55, 0.1);
        }

        .info-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-medium);
          border-color: rgba(212, 175, 55, 0.3);
        }

        .info-icon {
          font-size: 3rem;
          margin-bottom: var(--space-md);
        }

        .info-card h3 {
          font-family: var(--font-display);
          font-size: 1.5rem;
          color: var(--dark-brown);
          margin-bottom: var(--space-sm);
        }

        .info-card p {
          color: var(--gold-dark);
          font-weight: 500;
          margin: 0;
        }

        .info-detail {
          color: var(--warm-gray) !important;
          font-weight: 400 !important;
          font-size: 0.875rem;
          margin-top: var(--space-sm) !important;
        }

        /* Hashtag Section */
        .hashtag-section {
          padding: var(--space-2xl) 0;
          background: linear-gradient(
            135deg,
            var(--cream-dark) 0%,
            var(--gold-light) 100%
          );
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
        }
      `}</style>
    </motion.div>
  )
}

export default Home
