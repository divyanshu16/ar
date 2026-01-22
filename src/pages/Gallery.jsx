import { useState, useRef, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles, Image as DreiImage, Environment, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { coupleData, galleryImages } from '../data/weddingData'
import FloatingElements from '../components/3d/FloatingElements'
import { Diya, DiyaArrangement } from '../components/3d/Diya'
import { Kalash } from '../components/3d/Kalash'
import Canvas3D from '../components/3d/Canvas3D'

// 3D Photo Frame Component
function PhotoFrame3D({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, onClick, isSelected }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current && !isSelected) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.1
    }
  })

  return (
    <Float speed={2} floatIntensity={isSelected ? 0 : 0.3}>
      <group
        ref={groupRef}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={onClick}
      >
        {/* Frame */}
        <mesh>
          <boxGeometry args={[2.2, 2.8, 0.1]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Inner frame */}
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[1.9, 2.5, 0.05]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Photo placeholder */}
        <mesh position={[0, 0, 0.08]}>
          <planeGeometry args={[1.7, 2.3]} />
          <meshStandardMaterial color="#F5EBD9" />
        </mesh>
      </group>
    </Float>
  )
}

// 3D Gallery Scene with Indian Wedding Elements
function GalleryScene({ selectedIndex, onSelect }) {
  const frames = [
    { position: [-3, 0, 0], rotation: [0, 0.3, 0] },
    { position: [0, 0.5, 1], rotation: [0, 0, 0] },
    { position: [3, 0, 0], rotation: [0, -0.3, 0] },
    { position: [-2, -2, -1], rotation: [0, 0.2, 0] },
    { position: [2, -2, -1], rotation: [0, -0.2, 0] }
  ]

  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight position={[0, 5, 5]} intensity={1} angle={0.5} penumbra={1} />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#D4AF37" />
      <pointLight position={[5, 3, 3]} intensity={0.3} color="#FF8C00" />

      {frames.map((frame, index) => (
        <PhotoFrame3D
          key={index}
          position={frame.position}
          rotation={frame.rotation}
          scale={selectedIndex === index ? 1.2 : 0.8}
          onClick={() => onSelect(index)}
          isSelected={selectedIndex === index}
        />
      ))}

      {/* Diyas around the gallery - creating warm festive atmosphere */}
      <Suspense fallback={null}>
        <Diya position={[-4.5, -3, 1]} scale={0.8} flameIntensity={1.2} rotationY={0.5} />
        <Diya position={[4.5, -3, 1]} scale={0.8} flameIntensity={1.2} rotationY={-0.5} />
        <Diya position={[-3.5, -3, -2]} scale={0.6} flameIntensity={0.9} rotationY={0.3} />
        <Diya position={[3.5, -3, -2]} scale={0.6} flameIntensity={0.9} rotationY={-0.3} />
        <Diya position={[0, -3, -3]} scale={0.7} flameIntensity={1} rotationY={0} />
      </Suspense>

      {/* Decorative Kalash at corners */}
      <Suspense fallback={null}>
        <Kalash position={[-5, -1, -2]} scale={0.4} color="#B87333" />
        <Kalash position={[5, -1, -2]} scale={0.4} color="#D4AF37" />
      </Suspense>

      <Sparkles count={100} scale={15} size={1.5} speed={0.2} color="#D4AF37" opacity={0.3} />
      <Sparkles count={50} scale={12} size={1} speed={0.3} color="#FF8C00" opacity={0.2} />
      <Environment preset="studio" />
    </>
  )
}

// Photo Card Component for grid view
function PhotoCard({ image, index, onClick }) {
  return (
    <motion.div
      className="photo-card"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -10 }}
      onClick={() => onClick(index)}
    >
      <div className="photo-placeholder">
        <div className="photo-icon">📷</div>
        <span className="photo-number">{index + 1}</span>
      </div>
      <div className="photo-overlay">
        <p className="photo-caption">{image.caption}</p>
      </div>
    </motion.div>
  )
}

// Lightbox Component
function Lightbox({ image, index, onClose, onPrev, onNext, total }) {
  return (
    <motion.div
      className="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="lightbox-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="lightbox-close" onClick={onClose}>×</button>

        <div className="lightbox-image">
          <div className="photo-placeholder large">
            <div className="photo-icon">📷</div>
            <span className="photo-number">{index + 1}</span>
          </div>
        </div>

        <div className="lightbox-info">
          <p className="lightbox-caption">{image.caption}</p>
          <p className="lightbox-counter">{index + 1} / {total}</p>
        </div>

        <button className="lightbox-nav prev" onClick={onPrev}>❮</button>
        <button className="lightbox-nav next" onClick={onNext}>❯</button>
      </motion.div>
    </motion.div>
  )
}

function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or '3d'

  const handleSelect = (index) => {
    setSelectedIndex(index)
  }

  const handleClose = () => {
    setSelectedIndex(null)
  }

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % galleryImages.length)
  }

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
          <Canvas3D
            camera={{ position: [0, 1, 3], fov: 50 }}
          >
            <ambientLight intensity={0.3} />
            <pointLight position={[0, 2, 2]} intensity={0.5} color="#FF8C00" />
            <Float speed={1.5} floatIntensity={0.3}>
              <Diya position={[0, 0, 0]} scale={1.2} flameIntensity={1.5} />
            </Float>
          </Canvas3D>
        </div>
        <div className="gallery-hero-diyas gallery-hero-diyas-right">
          <Canvas3D
            camera={{ position: [0, 1, 3], fov: 50 }}
          >
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
          <h1>Our Gallery</h1>
          <div className="ornament ornament-lg" />
          <p className="gallery-intro">
            A collection of memories that tell our story. Every photo holds a piece of our hearts.
          </p>

          {/* View Toggle */}
          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid View
            </button>
            <button
              className={`toggle-btn ${viewMode === '3d' ? 'active' : ''}`}
              onClick={() => setViewMode('3d')}
            >
              3D View
            </button>
          </div>
        </motion.div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        {viewMode === '3d' ? (
          <div className="gallery-3d-container">
            <Canvas3D
              camera={{ position: [0, 0, 8], fov: 50 }}
            >
              <GalleryScene
                selectedIndex={selectedIndex}
                onSelect={handleSelect}
              />
            </Canvas3D>
            <p className="gallery-3d-hint">Click on frames to view photos</p>
          </div>
        ) : (
          <div className="container">
            {/* Decorative Diya Row Above Grid */}
            <div className="diya-decoration-row">
              <Canvas3D
                camera={{ position: [0, 2, 5], fov: 45 }}
              >
                <ambientLight intensity={0.3} color="#FFA07A" />
                <pointLight position={[0, 3, 3]} intensity={0.6} color="#FF8C00" />
                <pointLight position={[-3, 2, 2]} intensity={0.3} color="#FFD700" />
                <pointLight position={[3, 2, 2]} intensity={0.3} color="#FFD700" />
                <DiyaArrangement count={5} radius={3} pattern="line" scale={0.8} centerDiya={false} />
                <Sparkles count={40} scale={8} size={1.5} speed={0.3} color="#FFD700" opacity={0.4} />
              </Canvas3D>
            </div>

            <div className="photo-grid">
              {galleryImages.map((image, index) => (
                <PhotoCard
                  key={image.id}
                  image={image}
                  index={index}
                  onClick={handleSelect}
                />
              ))}
            </div>

            {/* Decorative Diya Row Below Grid */}
            <div className="diya-decoration-row diya-decoration-bottom">
              <Canvas3D
                camera={{ position: [0, 2, 5], fov: 45 }}
              >
                <ambientLight intensity={0.3} color="#FFA07A" />
                <pointLight position={[0, 3, 3]} intensity={0.6} color="#FF8C00" />
                <DiyaArrangement count={7} radius={4} pattern="arc" scale={0.7} centerDiya={false} />
                <Sparkles count={30} scale={6} size={1.2} speed={0.2} color="#FF8C00" opacity={0.3} />
              </Canvas3D>
            </div>
          </div>
        )}
      </section>

      {/* Upload hint */}
      <section className="upload-hint-section">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="upload-hint">
              Photos will be updated soon! In the meantime, share your moments with us using
            </p>
            <h3 className="hashtag gradient-text">{coupleData.hashtag}</h3>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <Lightbox
            image={galleryImages[selectedIndex]}
            index={selectedIndex}
            onClose={handleClose}
            onPrev={handlePrev}
            onNext={handleNext}
            total={galleryImages.length}
          />
        )}
      </AnimatePresence>

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

        /* View Toggle */
        .view-toggle {
          display: flex;
          justify-content: center;
          gap: var(--space-sm);
        }

        .toggle-btn {
          padding: var(--space-sm) var(--space-lg);
          background: transparent;
          border: 2px solid var(--gold);
          border-radius: var(--radius-full);
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: var(--gold-dark);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .toggle-btn.active,
        .toggle-btn:hover {
          background: var(--gold);
          color: var(--cream);
        }

        /* Gallery Section */
        .gallery-section {
          padding: var(--space-xl) 0 var(--space-2xl);
          background: var(--cream);
          min-height: 60vh;
        }

        /* 3D Gallery */
        .gallery-3d-container {
          height: 70vh;
          position: relative;
        }

        .gallery-3d-hint {
          position: absolute;
          bottom: var(--space-lg);
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.875rem;
          color: var(--warm-gray);
          background: rgba(255, 255, 255, 0.9);
          padding: var(--space-sm) var(--space-md);
          border-radius: var(--radius-full);
        }

        /* Diya Decoration Rows */
        .diya-decoration-row {
          height: 150px;
          margin-bottom: var(--space-lg);
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .diya-decoration-bottom {
          margin-top: var(--space-xl);
          margin-bottom: 0;
        }

        /* Photo Grid */
        .photo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--space-lg);
          position: relative;
        }

        .photo-card {
          position: relative;
          aspect-ratio: 4/5;
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: pointer;
          box-shadow: var(--shadow-soft);
        }

        .photo-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            var(--cream-dark) 0%,
            var(--gold-light) 100%
          );
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
        }

        .photo-placeholder.large {
          min-height: 400px;
        }

        .photo-icon {
          font-size: 3rem;
          opacity: 0.5;
        }

        .photo-number {
          font-family: var(--font-display);
          font-size: 2rem;
          color: var(--gold-dark);
          opacity: 0.5;
        }

        .photo-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: var(--space-lg);
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
          opacity: 0;
          transition: opacity var(--transition-fast);
        }

        .photo-card:hover .photo-overlay {
          opacity: 1;
        }

        .photo-caption {
          color: white;
          font-family: var(--font-display);
          font-style: italic;
          margin: 0;
        }

        /* Lightbox */
        .lightbox {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-lg);
        }

        .lightbox-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .lightbox-close {
          position: absolute;
          top: -40px;
          right: 0;
          background: none;
          border: none;
          color: white;
          font-size: 2rem;
          cursor: pointer;
          z-index: 10;
        }

        .lightbox-image {
          max-width: 100%;
          max-height: 70vh;
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .lightbox-info {
          margin-top: var(--space-md);
          text-align: center;
        }

        .lightbox-caption {
          color: white;
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-style: italic;
          margin: 0 0 var(--space-sm);
        }

        .lightbox-counter {
          color: var(--warm-gray);
          font-size: 0.875rem;
          margin: 0;
        }

        .lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          font-size: 1.5rem;
          padding: var(--space-md);
          cursor: pointer;
          border-radius: 50%;
          transition: background var(--transition-fast);
        }

        .lightbox-nav:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .lightbox-nav.prev {
          left: -60px;
        }

        .lightbox-nav.next {
          right: -60px;
        }

        /* Upload Hint */
        .upload-hint-section {
          padding: var(--space-2xl) 0;
          background: linear-gradient(
            135deg,
            var(--cream-dark) 0%,
            var(--gold-light) 100%
          );
        }

        .upload-hint {
          color: var(--warm-gray);
          margin-bottom: var(--space-md);
        }

        .upload-hint-section .hashtag {
          font-family: var(--font-display);
          font-size: 2rem;
        }

        @media (max-width: 768px) {
          .photo-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--space-md);
          }

          .lightbox-nav.prev {
            left: 10px;
          }

          .lightbox-nav.next {
            right: 10px;
          }

          .gallery-3d-container {
            height: 50vh;
          }

          /* Hide hero diyas on smaller screens */
          .gallery-hero-diyas {
            display: none;
          }

          /* Smaller diya decoration rows on mobile */
          .diya-decoration-row {
            height: 100px;
          }
        }

        @media (max-width: 480px) {
          .diya-decoration-row {
            height: 80px;
            margin-bottom: var(--space-md);
          }

          .diya-decoration-bottom {
            margin-top: var(--space-lg);
          }
        }
      `}</style>
    </motion.div>
  )
}

export default Gallery
