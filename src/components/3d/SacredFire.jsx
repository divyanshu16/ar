import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles, PointMaterial, Points } from '@react-three/drei'
import * as THREE from 'three'
import Canvas3D from './Canvas3D'

// Havan Kund (Sacred Fire Pit) Base
function HavanKund({ position = [0, 0, 0], scale = 1 }) {
  const groupRef = useRef()

  // Create the inverted pyramid shape for the kund
  const kundGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    // Square top opening
    const size = 1.2
    shape.moveTo(-size, -size)
    shape.lineTo(size, -size)
    shape.lineTo(size, size)
    shape.lineTo(-size, size)
    shape.lineTo(-size, -size)

    const extrudeSettings = {
      depth: 0.8,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.03,
      bevelSegments: 3
    }

    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [])

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Main kund body - copper/bronze color */}
      <mesh rotation={[Math.PI, 0, 0]} position={[0, -0.4, 0]}>
        <boxGeometry args={[2.6, 0.9, 2.6]} />
        <meshStandardMaterial
          color="#8B4513"
          metalness={0.7}
          roughness={0.4}
        />
      </mesh>

      {/* Inner cavity */}
      <mesh rotation={[Math.PI, 0, 0]} position={[0, -0.35, 0]}>
        <boxGeometry args={[2.2, 0.85, 2.2]} />
        <meshStandardMaterial
          color="#1a0a00"
          roughness={0.9}
        />
      </mesh>

      {/* Decorative border - top ring */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[2.8, 0.12, 2.8]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Inner decorative ring */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[2.4, 0.14, 2.4]} />
        <meshStandardMaterial
          color="#CD7F32"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Corner decorations */}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([x, z], i) => (
        <mesh key={i} position={[x * 1.35, 0.15, z * 1.35]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.9}
            roughness={0.1}
            emissive="#D4AF37"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}

      {/* Decorative Om symbols on sides (simplified as spheres) */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2
        const isXAxis = i % 2 === 0
        return (
          <mesh
            key={`om-${i}`}
            position={[
              isXAxis ? (i === 0 ? 1.31 : -1.31) : 0,
              -0.1,
              !isXAxis ? (i === 1 ? 1.31 : -1.31) : 0
            ]}
            rotation={[0, angle, 0]}
          >
            <torusGeometry args={[0.15, 0.03, 8, 16]} />
            <meshStandardMaterial
              color="#D4AF37"
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        )
      })}

      {/* Ash bed at bottom */}
      <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial
          color="#3a3a3a"
          roughness={1}
        />
      </mesh>

      {/* Glowing coals */}
      {Array.from({ length: 8 }, (_, i) => {
        const x = (Math.random() - 0.5) * 1.5
        const z = (Math.random() - 0.5) * 1.5
        return (
          <GlowingCoal
            key={`coal-${i}`}
            position={[x, -0.5, z]}
            scale={0.1 + Math.random() * 0.1}
            speed={0.5 + Math.random() * 0.5}
          />
        )
      })}
    </group>
  )
}

// Glowing Coal
function GlowingCoal({ position, scale = 0.1, speed = 1 }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      // Pulsing glow effect
      const pulse = 0.3 + Math.sin(state.clock.elapsedTime * speed * 3) * 0.2
      meshRef.current.material.emissiveIntensity = pulse
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#1a0500"
        emissive="#FF4500"
        emissiveIntensity={0.3}
        roughness={0.8}
      />
    </mesh>
  )
}

// Individual Flame
function Flame({ position, scale = 1, speed = 1, color = '#FF6600', delay = 0 }) {
  const meshRef = useRef()
  const materialRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime * speed + delay

      // Flickering scale animation
      const flickerX = 1 + Math.sin(t * 8) * 0.15 + Math.sin(t * 13) * 0.1
      const flickerY = 1 + Math.sin(t * 6) * 0.2 + Math.cos(t * 11) * 0.15
      const flickerZ = 1 + Math.cos(t * 9) * 0.12

      meshRef.current.scale.set(
        scale * flickerX,
        scale * flickerY,
        scale * flickerZ
      )

      // Swaying motion
      meshRef.current.rotation.z = Math.sin(t * 3) * 0.15
      meshRef.current.rotation.x = Math.cos(t * 2.5) * 0.1

      // Slight position wobble
      meshRef.current.position.x = position[0] + Math.sin(t * 5) * 0.05
      meshRef.current.position.z = position[2] + Math.cos(t * 4) * 0.05
    }

    if (materialRef.current) {
      // Pulsing emissive intensity
      const t = state.clock.elapsedTime * speed + delay
      materialRef.current.emissiveIntensity = 0.8 + Math.sin(t * 7) * 0.3
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <coneGeometry args={[0.3, 1, 8, 1, true]} />
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        transparent
        opacity={0.9}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Main Fire Group
function FireGroup({ intensity = 1 }) {
  const groupRef = useRef()

  // Generate flame configurations
  const flames = useMemo(() => {
    const configs = []

    // Center main flame
    configs.push({
      position: [0, 0.3, 0],
      scale: 1.2 * intensity,
      speed: 1,
      color: '#FF6600',
      delay: 0
    })

    // Inner ring of flames
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2
      const radius = 0.3
      configs.push({
        position: [Math.cos(angle) * radius, 0.2, Math.sin(angle) * radius],
        scale: (0.7 + Math.random() * 0.3) * intensity,
        speed: 0.8 + Math.random() * 0.4,
        color: i % 2 === 0 ? '#FF4500' : '#FF8C00',
        delay: i * 0.5
      })
    }

    // Outer ring of smaller flames
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + 0.2
      const radius = 0.6
      configs.push({
        position: [Math.cos(angle) * radius, 0.1, Math.sin(angle) * radius],
        scale: (0.4 + Math.random() * 0.2) * intensity,
        speed: 1 + Math.random() * 0.5,
        color: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#FF6347' : '#FFA500',
        delay: i * 0.3
      })
    }

    // Tiny accent flames
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2
      const radius = 0.8
      configs.push({
        position: [Math.cos(angle) * radius, 0.05, Math.sin(angle) * radius],
        scale: (0.2 + Math.random() * 0.15) * intensity,
        speed: 1.2 + Math.random() * 0.6,
        color: '#FFFF00',
        delay: i * 0.4
      })
    }

    return configs
  }, [intensity])

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle overall sway
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {flames.map((flame, i) => (
        <Flame key={i} {...flame} />
      ))}

      {/* Inner glow sphere */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial
          color="#FF6600"
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Outer glow sphere */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshBasicMaterial
          color="#FF4500"
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  )
}

// Rising Embers/Sparks
function RisingEmbers({ count = 30 }) {
  const pointsRef = useRef()

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Start near the fire
      positions[i * 3] = (Math.random() - 0.5) * 0.8
      positions[i * 3 + 1] = Math.random() * 2
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.8

      speeds[i] = 0.5 + Math.random() * 1
      sizes[i] = 0.02 + Math.random() * 0.03
    }

    return { positions, speeds, sizes }
  }, [count])

  useFrame((state, delta) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array

      for (let i = 0; i < count; i++) {
        // Rise up
        positions[i * 3 + 1] += particles.speeds[i] * delta

        // Slight horizontal drift
        positions[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.002
        positions[i * 3 + 2] += Math.cos(state.clock.elapsedTime + i) * 0.002

        // Reset when too high
        if (positions[i * 3 + 1] > 3) {
          positions[i * 3] = (Math.random() - 0.5) * 0.6
          positions[i * 3 + 1] = 0
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.6
        }
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <Points ref={pointsRef} positions={particles.positions} stride={3}>
      <PointMaterial
        transparent
        color="#FF6600"
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

// Smoke Particles
function SmokeParticles({ count = 15 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 0.4,
        0.5 + Math.random() * 2,
        (Math.random() - 0.5) * 0.4
      ],
      speed: 0.2 + Math.random() * 0.3,
      scale: 0.1 + Math.random() * 0.2,
      rotSpeed: (Math.random() - 0.5) * 0.5
    }))
  }, [count])

  return (
    <group>
      {particles.map((particle, i) => (
        <SmokeParticle key={i} {...particle} index={i} />
      ))}
    </group>
  )
}

function SmokeParticle({ position, speed, scale, rotSpeed, index }) {
  const meshRef = useRef()
  const initialY = position[1]

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rise up
      meshRef.current.position.y += speed * delta

      // Drift outward and sway
      const t = state.clock.elapsedTime + index
      meshRef.current.position.x += Math.sin(t) * 0.003
      meshRef.current.position.z += Math.cos(t * 0.8) * 0.003

      // Rotate
      meshRef.current.rotation.z += rotSpeed * delta

      // Expand as it rises
      const heightRatio = (meshRef.current.position.y - initialY) / 3
      meshRef.current.scale.setScalar(scale * (1 + heightRatio * 0.5))

      // Fade out
      meshRef.current.material.opacity = Math.max(0, 0.15 - heightRatio * 0.1)

      // Reset when too high or invisible
      if (meshRef.current.position.y > 4 || meshRef.current.material.opacity <= 0) {
        meshRef.current.position.set(
          (Math.random() - 0.5) * 0.4,
          0.8,
          (Math.random() - 0.5) * 0.4
        )
        meshRef.current.scale.setScalar(scale)
      }
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color="#666666"
        transparent
        opacity={0.15}
        depthWrite={false}
      />
    </mesh>
  )
}

// Fire Light Source
function FireLight({ intensity = 1 }) {
  const lightRef = useRef()

  useFrame((state) => {
    if (lightRef.current) {
      // Flickering light
      const t = state.clock.elapsedTime
      const flicker = 1 + Math.sin(t * 10) * 0.1 + Math.sin(t * 15) * 0.05 + Math.random() * 0.1
      lightRef.current.intensity = 2 * intensity * flicker
    }
  })

  return (
    <>
      <pointLight
        ref={lightRef}
        position={[0, 0.5, 0]}
        color="#FF6600"
        intensity={2 * intensity}
        distance={8}
        decay={2}
      />
      <pointLight
        position={[0, 0.8, 0]}
        color="#FF4500"
        intensity={0.8 * intensity}
        distance={5}
        decay={2}
      />
    </>
  )
}

// Main Sacred Fire Scene Component (for use inside Canvas)
export function SacredFireScene({ intensity = 1, showKund = true }) {
  return (
    <group>
      {/* Fire pit base */}
      {showKund && <HavanKund position={[0, -0.5, 0]} scale={0.8} />}

      {/* Main fire */}
      <FireGroup intensity={intensity} />

      {/* Rising embers */}
      <RisingEmbers count={40} />

      {/* Smoke */}
      <SmokeParticles count={12} />

      {/* Dynamic fire light */}
      <FireLight intensity={intensity} />

      {/* Golden sparkles around fire */}
      <Sparkles
        count={60}
        scale={3}
        size={2}
        speed={0.5}
        color="#FFD700"
        opacity={0.5}
        position={[0, 1, 0]}
      />

      {/* Orange sparkles */}
      <Sparkles
        count={40}
        scale={2.5}
        size={1.5}
        speed={0.7}
        color="#FF6600"
        opacity={0.4}
        position={[0, 0.5, 0]}
      />
    </group>
  )
}

// Complete Sacred Fire Scene with lighting
function SacredFireFullScene({ intensity = 1, showKund = true }) {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} />

      {/* Warm key light */}
      <spotLight
        position={[5, 5, 5]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#FFF8DC"
      />

      {/* Fill light */}
      <pointLight
        position={[-3, 2, -3]}
        intensity={0.3}
        color="#FFE4B5"
      />

      {/* Sacred fire */}
      <SacredFireScene intensity={intensity} showKund={showKund} />
    </>
  )
}

// Exported component with Canvas wrapper
export default function SacredFire({
  className = '',
  intensity = 1,
  showKund = true
}) {
  return (
    <div
      className={`sacred-fire-container ${className}`}
      style={{ width: '100%', height: '100%' }}
    >
      <Canvas3D
        camera={{ position: [0, 1.5, 4], fov: 45 }}
      >
        <SacredFireFullScene intensity={intensity} showKund={showKund} />
      </Canvas3D>
    </div>
  )
}

// Export individual components for custom compositions
export { HavanKund, FireGroup, Flame, RisingEmbers, SmokeParticles, FireLight }
