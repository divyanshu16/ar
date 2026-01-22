import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  MeshTransmissionMaterial,
  Environment,
  Float,
  Sparkles,
  useTexture
} from '@react-three/drei'
import * as THREE from 'three'

// Single Wedding Ring Component
function Ring({ position, rotation, scale = 1, delay = 0 }) {
  const meshRef = useRef()
  const materialRef = useRef()

  // Create ring geometry
  const geometry = useMemo(() => {
    return new THREE.TorusGeometry(1, 0.15, 32, 100)
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime + delay
      meshRef.current.rotation.x = rotation[0] + Math.sin(t * 0.5) * 0.1
      meshRef.current.rotation.y = rotation[1] + t * 0.2
    }
  })

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
      floatingRange={[-0.1, 0.1]}
    >
      <mesh
        ref={meshRef}
        position={position}
        scale={scale}
        geometry={geometry}
      >
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1.5}
        />
      </mesh>
    </Float>
  )
}

// Diamond/Gem on ring
function Diamond({ position }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 2
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={0.15}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#ffffff"
        metalness={0.1}
        roughness={0}
        transparent
        opacity={0.9}
        envMapIntensity={3}
      />
    </mesh>
  )
}

// Interlocked Wedding Rings
function InterlockedRings() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      {/* First ring - slightly tilted */}
      <Ring
        position={[-0.5, 0, 0]}
        rotation={[Math.PI / 2, 0, Math.PI / 6]}
        scale={1}
      />

      {/* Second ring - interlocked */}
      <Ring
        position={[0.5, 0, 0]}
        rotation={[Math.PI / 2, Math.PI / 2, -Math.PI / 6]}
        scale={1}
        delay={1}
      />

      {/* Diamond on one ring */}
      <Diamond position={[-0.5, 1, 0]} />

      {/* Sparkles around the rings */}
      <Sparkles
        count={50}
        scale={4}
        size={2}
        speed={0.5}
        color="#D4AF37"
        opacity={0.5}
      />
    </group>
  )
}

// Floating particles (marigold-like)
function FloatingParticles() {
  const particlesRef = useRef()
  const count = 30

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return pos
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] -= 0.01
        if (positions[i * 3 + 1] < -5) {
          positions[i * 3 + 1] = 5
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#FF9933"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Main 3D Scene
function WeddingRingsScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#D4AF37" />

      <InterlockedRings />
      <FloatingParticles />

      <Environment preset="studio" />
    </>
  )
}

// Exported component with Canvas
export default function WeddingRings({ className = '' }) {
  return (
    <div className={`wedding-rings-container ${className}`} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <WeddingRingsScene />
      </Canvas>
    </div>
  )
}
