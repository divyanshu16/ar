import { motion } from 'framer-motion'
import { Float } from '@react-three/drei'
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
      {/* Hero Section with Upload CTA */}
      <section className="gallery-hero">
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
          <div className="ornament ornament-sm" />
          <p className="gallery-intro">
            We would love to see the wedding through your eyes! Upload your favourite photos and videos
            from the celebrations to our shared album.
          </p>

          {/* Upload CTA integrated into hero */}
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

          <p className="upload-signin-hint">
            For best experience, sign in with Google if prompted or simply use the Google Drive app :)
          </p>
        </motion.div>
      </section>

      {/* Hashtag Section */}
      <section className="hashtag-section-wrapper">
        <div className="container text-center">
          <motion.div
            className="hashtag-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="hashtag-label">Don't forget to tag your posts</p>
            <h3 className="hashtag gradient-text">#CodemeetsClause</h3>
          </motion.div>
        </div>
      </section>

      <style>{`
        .gallery-page {
          overflow-x: hidden;
        }

        /* Gallery Hero - Compact layout with CTA above the fold */
        .gallery-hero {
          min-height: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: calc(var(--space-xl) + 60px) var(--space-lg) var(--space-lg);
          background: linear-gradient(
            180deg,
            var(--cream) 0%,
            var(--cream-dark) 100%
          );
          text-align: center;
          position: relative;
          overflow: hidden;
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
          font-size: clamp(1.75rem, 4vw, 2.75rem);
          margin-bottom: var(--space-sm);
        }

        .gallery-intro {
          font-family: var(--font-display);
          font-size: 1rem;
          font-style: italic;
          color: var(--warm-gray);
          margin-bottom: var(--space-lg);
          max-width: 500px;
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

        .upload-signin-hint {
          margin-top: var(--space-md);
          margin-top: var(--space-sm);
          font-size: 0.8rem;
          color: var(--gold-dark);
          font-weight: 500;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Hashtag Section */
        .hashtag-section-wrapper {
          padding: var(--space-xl) 0;
          background: var(--cream);
        }

        .hashtag-section {
          max-width: 600px;
          margin: 0 auto;
          padding-top: var(--space-lg);
          border-top: 1px solid var(--gold-light);
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

          .gallery-hero {
            padding: calc(var(--space-lg) + 60px) var(--space-md) var(--space-md);
          }

          .upload-cta-btn {
            padding: var(--space-sm) var(--space-xl);
            font-size: 1rem;
          }
        }
      `}</style>
    </motion.div>
  )
}

export default Gallery
