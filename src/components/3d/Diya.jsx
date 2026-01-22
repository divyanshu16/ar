import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  Environment,
  Float,
  Sparkles,
  PointMaterial
} from '@react-three/drei'
import * as THREE from 'three'
import Canvas3D from './Canvas3D'

// Single Diya (Oil Lamp) Component
export function Diya({ position = [0, 0, 0], scale = 1, flameIntensity = 1, rotationY = 0 }) {
  const groupRef = useRef()
  const flameRef = useRef()
  const glowRef = useRef()
  const innerGlowRef = useRef()

  // Create diya bowl shape using lathe geometry
  const diyaGeometry = useMemo(() => {
    const points = []
    // Traditional diya shape - small bowl with pointed end (for wick)
    points.push(new THREE.Vector2(0, 0))
    points.push(new THREE.Vector2(0.15, 0))
    points.push(new THREE.Vector2(0.25, 0.02))
    points.push(new THREE.Vector2(0.35, 0.06))
    points.push(new THREE.Vector2(0.42, 0.12))
    points.push(new THREE.Vector2(0.45, 0.18))
    points.push(new THREE.Vector2(0.44, 0.22))
    points.push(new THREE.Vector2(0.40, 0.25))
    points.push(new THREE.Vector2(0.35, 0.26))
    // Inner edge of bowl
    points.push(new THREE.Vector2(0.30, 0.24))
    points.push(new THREE.Vector2(0.20, 0.20))
    points.push(new THREE.Vector2(0.10, 0.18))
    points.push(new THREE.Vector2(0, 0.17))

    return new THREE.LatheGeometry(points, 32)
  }, [])

  // Create pointed spout for the wick
  const spoutGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.lineTo(0.12, 0.02)
    shape.lineTo(0.18, 0)
    shape.lineTo(0.12, -0.02)
    shape.closePath()

    const extrudeSettings = {
      depth: 0.08,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 2
    }

    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [])

  // Animated flame effect
  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (flameRef.current) {
      // Flickering scale animation
      const flickerX = 1 + Math.sin(t * 15) * 0.1 + Math.sin(t * 23) * 0.05
      const flickerY = 1 + Math.sin(t * 12) * 0.15 + Math.cos(t * 19) * 0.08
      const flickerZ = 1 + Math.cos(t * 17) * 0.1 + Math.sin(t * 21) * 0.05
      flameRef.current.scale.set(flickerX, flickerY, flickerZ)

      // Slight position wobble
      flameRef.current.position.x = Math.sin(t * 10) * 0.01
      flameRef.current.position.z = Math.cos(t * 8) * 0.01
    }

    if (glowRef.current) {
      // Pulsing glow
      const glowIntensity = 0.3 + Math.sin(t * 8) * 0.1 + Math.sin(t * 13) * 0.05
      glowRef.current.material.opacity = glowIntensity * flameIntensity
    }

    if (innerGlowRef.current) {
      const innerGlowIntensity = 0.5 + Math.sin(t * 10) * 0.15
      innerGlowRef.current.material.opacity = innerGlowIntensity * flameIntensity
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={[0, rotationY, 0]}>
      {/* Main diya bowl - terracotta/clay color */}
      <mesh geometry={diyaGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color="#C2703A"
          roughness={0.85}
          metalness={0.05}
          emissive="#8B4513"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Pointed spout where wick sits */}
      <mesh
        geometry={spoutGeometry}
        position={[0.38, 0.22, -0.04]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <meshStandardMaterial
          color="#C2703A"
          roughness={0.85}
          metalness={0.05}
          emissive="#8B4513"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Oil inside the diya */}
      <mesh position={[0, 0.19, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.28, 32]} />
        <meshStandardMaterial
          color="#8B6914"
          roughness={0.3}
          metalness={0.1}
          emissive="#D4A017"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Wick */}
      <mesh position={[0.42, 0.25, 0]}>
        <cylinderGeometry args={[0.015, 0.012, 0.08, 8]} />
        <meshStandardMaterial
          color="#2F1810"
          roughness={1}
        />
      </mesh>

      {/* Flame group */}
      <group position={[0.42, 0.32, 0]}>
        {/* Inner flame - bright yellow/white */}
        <mesh ref={flameRef}>
          <coneGeometry args={[0.03, 0.12, 8]} />
          <meshBasicMaterial
            color="#FFFAF0"
            transparent
            opacity={0.95}
          />
        </mesh>

        {/* Middle flame - orange */}
        <mesh position={[0, 0.02, 0]} scale={[1.3, 1.1, 1.3]}>
          <coneGeometry args={[0.035, 0.10, 8]} />
          <meshBasicMaterial
            color="#FF8C00"
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Outer flame - red/orange */}
        <mesh position={[0, 0.01, 0]} scale={[1.5, 0.9, 1.5]}>
          <coneGeometry args={[0.04, 0.08, 8]} />
          <meshBasicMaterial
            color="#FF4500"
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* Inner glow sphere */}
        <mesh ref={innerGlowRef} scale={[1.5, 1.8, 1.5]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial
            color="#FFD700"
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* Outer glow sphere */}
        <mesh ref={glowRef} scale={[3, 3.5, 3]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial
            color="#FFA500"
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Point light for realistic illumination */}
        <pointLight
          color="#FF8C00"
          intensity={flameIntensity * 2}
          distance={3}
          decay={2}
        />
      </group>
    </group>
  )
}

// Decorative rim pattern for diya
function DecoratedDiya({ position = [0, 0, 0], scale = 1, flameIntensity = 1, rotationY = 0 }) {
  const groupRef = useRef()
  const flameRef = useRef()
  const glowRef = useRef()

  // Create decorated diya with patterns
  const diyaGeometry = useMemo(() => {
    const points = []
    points.push(new THREE.Vector2(0, 0))
    points.push(new THREE.Vector2(0.18, 0))
    points.push(new THREE.Vector2(0.30, 0.03))
    points.push(new THREE.Vector2(0.40, 0.08))
    points.push(new THREE.Vector2(0.48, 0.16))
    points.push(new THREE.Vector2(0.50, 0.24))
    points.push(new THREE.Vector2(0.48, 0.30))
    points.push(new THREE.Vector2(0.42, 0.33))
    // Decorative scalloped edge
    points.push(new THREE.Vector2(0.38, 0.35))
    points.push(new THREE.Vector2(0.35, 0.33))
    points.push(new THREE.Vector2(0.30, 0.30))
    points.push(new THREE.Vector2(0.20, 0.27))
    points.push(new THREE.Vector2(0.10, 0.25))
    points.push(new THREE.Vector2(0, 0.24))

    return new THREE.LatheGeometry(points, 48)
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (flameRef.current) {
      const flickerX = 1 + Math.sin(t * 14) * 0.12 + Math.sin(t * 25) * 0.06
      const flickerY = 1 + Math.sin(t * 11) * 0.18 + Math.cos(t * 20) * 0.1
      const flickerZ = 1 + Math.cos(t * 16) * 0.12
      flameRef.current.scale.set(flickerX, flickerY, flickerZ)
    }

    if (glowRef.current) {
      const glowIntensity = 0.35 + Math.sin(t * 9) * 0.12
      glowRef.current.material.opacity = glowIntensity * flameIntensity
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={[0, rotationY, 0]}>
      {/* Decorated diya bowl */}
      <mesh geometry={diyaGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color="#D2691E"
          roughness={0.75}
          metalness={0.1}
          emissive="#8B4513"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Gold decorative ring */}
      <mesh position={[0, 0.32, 0]}>
        <torusGeometry args={[0.40, 0.02, 8, 32]} />
        <meshStandardMaterial
          color="#DAA520"
          roughness={0.3}
          metalness={0.8}
          emissive="#B8860B"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Oil surface */}
      <mesh position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.32, 32]} />
        <meshStandardMaterial
          color="#8B6914"
          roughness={0.25}
          metalness={0.15}
          emissive="#D4A017"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Center wick */}
      <mesh position={[0, 0.30, 0]}>
        <cylinderGeometry args={[0.018, 0.014, 0.10, 8]} />
        <meshStandardMaterial color="#1C1008" roughness={1} />
      </mesh>

      {/* Flame */}
      <group position={[0, 0.40, 0]}>
        <mesh ref={flameRef}>
          <coneGeometry args={[0.035, 0.15, 8]} />
          <meshBasicMaterial color="#FFFACD" transparent opacity={0.95} />
        </mesh>

        <mesh position={[0, 0.02, 0]} scale={[1.4, 1.15, 1.4]}>
          <coneGeometry args={[0.04, 0.12, 8]} />
          <meshBasicMaterial color="#FF8C00" transparent opacity={0.75} />
        </mesh>

        <mesh ref={glowRef} scale={[4, 4.5, 4]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#FFA500" transparent opacity={0.35} />
        </mesh>

        <pointLight color="#FF8C00" intensity={flameIntensity * 2.5} distance={4} decay={2} />
      </group>
    </group>
  )
}

// Multiple Diyas arranged decoratively
export function DiyaArrangement({
  count = 5,
  radius = 2,
  centerDiya = true,
  pattern = 'circle', // 'circle', 'line', 'arc', 'rangoli'
  scale = 1
}) {
  const groupRef = useRef()

  const diyas = useMemo(() => {
    const positions = []

    if (pattern === 'circle') {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2
        positions.push({
          position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
          rotationY: -angle + Math.PI / 2,
          scale: 0.8 + Math.random() * 0.3,
          delay: i * 0.2
        })
      }
      if (centerDiya) {
        positions.push({
          position: [0, 0, 0],
          rotationY: 0,
          scale: 1.2,
          delay: 0,
          decorated: true
        })
      }
    } else if (pattern === 'line') {
      const spacing = radius / (count - 1)
      for (let i = 0; i < count; i++) {
        positions.push({
          position: [(i - (count - 1) / 2) * spacing, 0, 0],
          rotationY: 0,
          scale: 0.7 + Math.sin(i / count * Math.PI) * 0.4,
          delay: i * 0.15
        })
      }
    } else if (pattern === 'arc') {
      const arcAngle = Math.PI * 0.8 // 144 degrees
      for (let i = 0; i < count; i++) {
        const angle = -arcAngle / 2 + (i / (count - 1)) * arcAngle
        positions.push({
          position: [Math.sin(angle) * radius, 0, Math.cos(angle) * radius - radius],
          rotationY: -angle,
          scale: 0.75 + Math.random() * 0.3,
          delay: i * 0.1
        })
      }
    } else if (pattern === 'rangoli') {
      // Inner circle
      const innerCount = 4
      for (let i = 0; i < innerCount; i++) {
        const angle = (i / innerCount) * Math.PI * 2 + Math.PI / 4
        positions.push({
          position: [Math.cos(angle) * radius * 0.4, 0, Math.sin(angle) * radius * 0.4],
          rotationY: -angle + Math.PI / 2,
          scale: 0.7,
          delay: i * 0.1
        })
      }
      // Outer circle
      const outerCount = 8
      for (let i = 0; i < outerCount; i++) {
        const angle = (i / outerCount) * Math.PI * 2
        positions.push({
          position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
          rotationY: -angle + Math.PI / 2,
          scale: 0.85,
          delay: i * 0.08 + 0.4
        })
      }
      // Center decorated diya
      positions.push({
        position: [0, 0, 0],
        rotationY: 0,
        scale: 1.3,
        delay: 0,
        decorated: true
      })
    }

    return positions
  }, [count, radius, centerDiya, pattern])

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating motion for entire arrangement
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })

  return (
    <group ref={groupRef} scale={scale}>
      {diyas.map((diya, i) => (
        diya.decorated ? (
          <Float key={i} speed={1.5} floatIntensity={0.2}>
            <DecoratedDiya
              position={diya.position}
              scale={diya.scale}
              rotationY={diya.rotationY}
              flameIntensity={1.2}
            />
          </Float>
        ) : (
          <Float key={i} speed={1.2 + i * 0.1} floatIntensity={0.15}>
            <Diya
              position={diya.position}
              scale={diya.scale}
              rotationY={diya.rotationY}
              flameIntensity={0.8 + Math.random() * 0.4}
            />
          </Float>
        )
      ))}
    </group>
  )
}

// Floating embers/sparks from diyas
function FloatingEmbers({ count = 30 }) {
  const points = useRef()

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = []

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4
      positions[i * 3 + 1] = Math.random() * 3
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4

      velocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: 0.01 + Math.random() * 0.02,
        z: (Math.random() - 0.5) * 0.02
      })
    }

    return { positions, velocities }
  }, [count])

  useFrame(() => {
    if (points.current) {
      const positions = points.current.geometry.attributes.position.array

      for (let i = 0; i < count; i++) {
        positions[i * 3] += particles.velocities[i].x
        positions[i * 3 + 1] += particles.velocities[i].y
        positions[i * 3 + 2] += particles.velocities[i].z

        // Reset particles that go too high
        if (positions[i * 3 + 1] > 4) {
          positions[i * 3] = (Math.random() - 0.5) * 4
          positions[i * 3 + 1] = 0
          positions[i * 3 + 2] = (Math.random() - 0.5) * 4
        }
      }

      points.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        transparent
        color="#FF6B00"
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        opacity={0.8}
      />
    </points>
  )
}

// Full scene with lighting and atmosphere
export function DiyaScene({ pattern = 'rangoli', diyaCount = 8 }) {
  return (
    <>
      {/* Ambient lighting - warm */}
      <ambientLight intensity={0.15} color="#FFA07A" />

      {/* Main overhead light */}
      <spotLight
        position={[0, 8, 0]}
        angle={0.6}
        penumbra={1}
        intensity={0.5}
        color="#FFE4B5"
        castShadow
      />

      {/* Rim lights for depth */}
      <pointLight position={[5, 2, 5]} intensity={0.3} color="#FF8C00" />
      <pointLight position={[-5, 2, -5]} intensity={0.3} color="#FFD700" />

      {/* Main diya arrangement */}
      <DiyaArrangement
        count={diyaCount}
        radius={2.5}
        pattern={pattern}
        centerDiya={true}
        scale={1}
      />

      {/* Floating embers */}
      <FloatingEmbers count={40} />

      {/* Golden sparkles */}
      <Sparkles
        count={100}
        scale={8}
        size={2}
        speed={0.3}
        color="#FFD700"
        opacity={0.5}
      />
      <Sparkles
        count={60}
        scale={6}
        size={1.5}
        speed={0.2}
        color="#FF8C00"
        opacity={0.4}
      />

      {/* Environment for reflections */}
      <Environment preset="sunset" />

      {/* Ground plane to catch shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#1a0a00"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
    </>
  )
}

// Default export with Canvas wrapper
export default function DiyaCanvas({
  className = '',
  pattern = 'rangoli',
  diyaCount = 8,
  cameraPosition = [0, 4, 6]
}) {
  return (
    <div className={`diya-container ${className}`} style={{ width: '100%', height: '100%' }}>
      <Canvas3D
        camera={{ position: cameraPosition, fov: 50 }}
        shadows
      >
        <DiyaScene pattern={pattern} diyaCount={diyaCount} />
      </Canvas3D>
    </div>
  )
}
