import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { Float } from '@react-three/drei'
import { coupleData } from '../data/weddingData'
import FloatingElements from '../components/3d/FloatingElements'
import { Diya } from '../components/3d/Diya'
import Canvas3D from '../components/3d/Canvas3D'

const DRIVE_LINK = 'https://drive.google.com/drive/folders/1ScpRbnIGQF9x_Xf72ks8i8JRGEA8EZ8R?usp=sharing'

function Gallery() {
  return (
    <motion.div
      className="gallery-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="gallery-hero">
        {/* 3D Background */}
        <div className="gallery-hero-3d">
          <FloatingElements variant="mandala" />
        </div>

        {/* Decorative Diyas on Hero */}
        <div className="gallery-hero-diyas gallery-hero-diyas-left">
          <Canvas3D camera={{ position: [0, 1, 3], fov: 50 }}>
            <ambientLight intensity={0.3} />
            <pointLight position={[0, 2, 2]} intensity={0.5} color="#FF8C00" />
            <Float speed={1.5} floatIntensity={0.3}>
              <Diya position={[0, 0, 0]} scale={1.2} flameIntensity={1.5} />
            </Float>
          </Canvas3D>
        </div>
        <div className="gallery-hero-diyas gallery-hero-diyas-right">
          <Canvas3D camera={{ position: [0, 1, 3], fov: 50 }}>
            <ambientLight intensity={0.3} />
            <pointLight position={[0, 2, 2]} intensity={0.5} color="#FF8C00" />
            <Float speed={1.5} floatIntensity={0.3}>
              <Diya position={[0, 0, 0]} scale={1.2} flameIntensity={1.5} />
            </Float>
          </Canvas3D>
        </div>

        <motion.div
          className="gallery-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="section-subtitle">Captured moments</p>
          <h1>Share Your Moments</h1>
          <div className="ornament ornament-lg" />
          <p className="gallery-intro">
            We would love to see the wedding through your eyes! Upload your favourite photos and videos
            from the celebrations to our shared album.
          </p>
        </motion.div>
      </section>

      {/* Upload CTA Section */}
      <section className="upload-section">
        <div className="container text-center">
          <motion.div
            className="upload-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="upload-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>

            <h2 className="upload-title">Upload Photos & Videos</h2>
            <p className="upload-description">
              Tap the button below to open our shared Google Drive folder. You can upload photos,
              videos, and any memories from the wedding celebrations.
            </p>

            <motion.a
              href={DRIVE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="upload-cta-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Upload to Google Drive
            </motion.a>

            <p className="upload-note">
              The folder is open to everyone — no sign-in required!
            </p>
          </motion.div>

          <motion.div
            className="hashtag-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="hashtag-label">Don't forget to tag your posts</p>
            <h3 className="hashtag gradient-text">{coupleData.hashtag}</h3>
          </motion.div>
        </div>
      </section>

      <style>{`
        .gallery-page {
          overflow-x: hidden;
        }

        /* Gallery Hero */
        .gallery-hero {
          min-height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: calc(var(--space-2xl) + 60px) var(--space-lg) var(--space-xl);
          background: linear-gradient(
            180deg,
            var(--cream) 0%,
            var(--cream-dark) 100%
          );
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .gallery-hero-3d {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          opacity: 0.6;
          pointer-events: none;
        }

        /* Decorative Diyas on Hero */
        .gallery-hero-diyas {
          position: absolute;
          width: 150px;
          height: 200px;
          z-index: 1;
          pointer-events: none;
        }

        .gallery-hero-diyas-left {
          left: 5%;
          top: 50%;
          transform: translateY(-50%);
        }

        .gallery-hero-diyas-right {
          right: 5%;
          top: 50%;
          transform: translateY(-50%);
        }

        .gallery-hero-content {
          max-width: 700px;
          position: relative;
          z-index: 1;
        }

        .gallery-hero-content h1 {
          font-family: var(--font-display);
          font-size: clamp(2rem, 5vw, 3.5rem);
          margin-bottom: var(--space-md);
        }

        .gallery-intro {
          font-family: var(--font-display);
          font-size: 1.125rem;
          font-style: italic;
          color: var(--warm-gray);
          margin-bottom: var(--space-lg);
        }

        /* Upload Section */
        .upload-section {
          padding: var(--space-2xl) 0;
          background: var(--cream);
        }

        .upload-card {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: var(--radius-lg);
          padding: var(--space-2xl) var(--space-xl);
          box-shadow: var(--shadow-soft);
          border: 1px solid var(--gold-light);
        }

        .upload-icon {
          color: var(--gold);
          margin-bottom: var(--space-lg);
        }

        .upload-title {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 3vw, 2rem);
          color: var(--text-dark);
          margin-bottom: var(--space-md);
        }

        .upload-description {
          color: var(--warm-gray);
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: var(--space-xl);
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }

        .upload-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-md) var(--space-2xl);
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
          color: white;
          font-family: var(--font-body);
          font-size: 1.125rem;
          font-weight: 600;
          border: none;
          border-radius: var(--radius-full);
          text-decoration: none;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4);
          transition: box-shadow var(--transition-fast);
        }

        .upload-cta-btn:hover {
          box-shadow: 0 6px 30px rgba(212, 175, 55, 0.6);
        }

        .upload-note {
          margin-top: var(--space-lg);
          font-size: 0.875rem;
          color: var(--warm-gray);
          font-style: italic;
        }

        .hashtag-section {
          margin-top: var(--space-2xl);
          padding-top: var(--space-xl);
          border-top: 1px solid var(--gold-light);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hashtag-label {
          color: var(--warm-gray);
          margin-bottom: var(--space-sm);
          font-size: 0.95rem;
        }

        .hashtag-section .hashtag {
          font-family: var(--font-display);
          font-size: 2rem;
        }

        @media (max-width: 768px) {
          .gallery-hero-diyas {
            display: none;
          }

          .upload-card {
            padding: var(--space-xl) var(--space-lg);
          }
        }
      `}</style>
    </motion.div>
  )
}

export default Gallery
