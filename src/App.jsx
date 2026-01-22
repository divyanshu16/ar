import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Suspense, lazy, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import Navigation from './components/Navigation'
import LoadingScreen from './components/LoadingScreen'
import Canvas3D from './components/3d/Canvas3D'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const OurStory = lazy(() => import('./pages/OurStory'))
const Quiz = lazy(() => import('./pages/Quiz'))

// Persistent 3D Corner Decorations
function CornerPaisley({ position, rotation, scale = 1 }) {
  const meshRef = useRef()

  const curve = new THREE.CatmullRomCurve3(
    Array.from({ length: 51 }, (_, i) => {
      const t = (i / 50) * Math.PI * 2
      const r = 0.5 * (1 - Math.sin(t))
      return new THREE.Vector3(r * Math.cos(t), r * Math.sin(t), 0)
    }),
    true
  )

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <Float speed={1.5} floatIntensity={0.2}>
      <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
        <mesh>
          <tubeGeometry args={[curve, 64, 0.03, 8, true]} />
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.8}
            roughness={0.2}
            emissive="#D4AF37"
            emissiveIntensity={0.1}
          />
        </mesh>
      </group>
    </Float>
  )
}

function CornerDecorScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={0.4} color="#D4AF37" />

      {/* Corner Paisleys */}
      <CornerPaisley position={[-3.5, 2.5, 0]} rotation={[0, 0, Math.PI / 6]} scale={0.6} />
      <CornerPaisley position={[3.5, 2.5, 0]} rotation={[0, Math.PI, -Math.PI / 6]} scale={0.6} />
      <CornerPaisley position={[-3.5, -2.5, 0]} rotation={[0, 0, Math.PI / 3]} scale={0.5} />
      <CornerPaisley position={[3.5, -2.5, 0]} rotation={[0, Math.PI, -Math.PI / 3]} scale={0.5} />

      {/* Ambient sparkles */}
      <Sparkles count={30} scale={10} size={1.5} speed={0.2} color="#D4AF37" opacity={0.3} />
    </>
  )
}

function PersistentCornerDecor() {
  return (
    <div className="persistent-3d-corners">
      <Canvas3D
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
      >
        <CornerDecorScene />
      </Canvas3D>
      <style>{`
        .persistent-3d-corners {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 5;
          opacity: 0.4;
        }
      `}</style>
    </div>
  )
}

function App() {
  const location = useLocation()

  return (
    <div className="app">
      {/* Persistent 3D Corner Decorations */}
      <PersistentCornerDecor />

      <Navigation />
      <Suspense fallback={<LoadingScreen />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/quiz" element={<Quiz />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </div>
  )
}

export default App
