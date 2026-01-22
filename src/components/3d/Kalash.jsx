import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  Environment,
  Float,
  Sparkles,
  Stars
} from '@react-three/drei'
import * as THREE from 'three'
import Canvas3D from './Canvas3D'

// Create kalash pot shape using lathe geometry
function createKalashShape() {
  const points = []

  // Base of the pot
  points.push(new THREE.Vector2(0.3, 0))
  points.push(new THREE.Vector2(0.35, 0.05))
  points.push(new THREE.Vector2(0.38, 0.1))

  // Lower belly curve
  points.push(new THREE.Vector2(0.5, 0.3))
  points.push(new THREE.Vector2(0.65, 0.5))
  points.push(new THREE.Vector2(0.75, 0.7))

  // Maximum width (belly)
  points.push(new THREE.Vector2(0.8, 0.9))
  points.push(new THREE.Vector2(0.78, 1.1))

  // Upper curve narrowing
  points.push(new THREE.Vector2(0.7, 1.3))
  points.push(new THREE.Vector2(0.55, 1.5))
  points.push(new THREE.Vector2(0.4, 1.65))

  // Neck
  points.push(new THREE.Vector2(0.32, 1.75))
  points.push(new THREE.Vector2(0.3, 1.85))

  // Rim flare
  points.push(new THREE.Vector2(0.35, 1.9))
  points.push(new THREE.Vector2(0.42, 1.95))
  points.push(new THREE.Vector2(0.4, 2))

  return points
}

// Decorative band pattern
function DecorativeBand({ radius, y, thickness = 0.03 }) {
  return (
    <mesh position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, thickness, 8, 64]} />
      <meshStandardMaterial
        color="#FFD700"
        metalness={0.95}
        roughness={0.1}
        emissive="#B8860B"
        emissiveIntensity={0.2}
      />
    </mesh>
  )
}

// Engraved pattern dots around the pot
function EngravingPattern({ radius, y, count = 16 }) {
  const dots = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      return {
        position: [
          Math.cos(angle) * radius,
          y,
          Math.sin(angle) * radius
        ],
        rotation: [0, -angle, 0]
      }
    })
  }, [radius, y, count])

  return (
    <group>
      {dots.map((dot, i) => (
        <mesh key={i} position={dot.position} rotation={dot.rotation}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial
            color="#FFD700"
            metalness={1}
            roughness={0.05}
            emissive="#FFD700"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

// Paisley/Mango pattern decoration
function PaisleyPattern({ radius, y, count = 8 }) {
  const paisleys = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      return {
        position: [
          Math.cos(angle) * radius,
          y,
          Math.sin(angle) * radius
        ],
        rotation: [0, -angle + Math.PI / 2, 0]
      }
    })
  }, [radius, y, count])

  // Create paisley shape
  const paisleyShape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.bezierCurveTo(0.03, 0.02, 0.05, 0.06, 0.04, 0.1)
    shape.bezierCurveTo(0.03, 0.14, -0.01, 0.12, -0.02, 0.08)
    shape.bezierCurveTo(-0.03, 0.04, -0.01, 0.01, 0, 0)
    return shape
  }, [])

  return (
    <group>
      {paisleys.map((p, i) => (
        <mesh key={i} position={p.position} rotation={p.rotation} scale={0.8}>
          <extrudeGeometry
            args={[paisleyShape, { depth: 0.01, bevelEnabled: false }]}
          />
          <meshStandardMaterial
            color="#FFD700"
            metalness={0.9}
            roughness={0.15}
            emissive="#DAA520"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

// Main Kalash pot
export function Kalash({ position = [0, 0, 0], scale = 1, color = "#B87333" }) {
  const meshRef = useRef()
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)

  const kalashGeometry = useMemo(() => {
    const points = createKalashShape()
    return new THREE.LatheGeometry(points, 64)
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
    if (meshRef.current) {
      // Pulse effect on hover
      const targetScale = hovered ? scale * 1.05 : scale
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      )
    }
  })

  return (
    <Float
      speed={1.2}
      rotationIntensity={0.2}
      floatIntensity={0.5}
      floatingRange={[-0.1, 0.1]}
    >
      <group ref={groupRef} position={position}>
        {/* Main pot body */}
        <mesh
          ref={meshRef}
          scale={scale}
          geometry={kalashGeometry}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial
            color={color}
            metalness={0.9}
            roughness={0.15}
            envMapIntensity={2}
            emissive={color}
            emissiveIntensity={hovered ? 0.15 : 0.05}
          />
        </mesh>

        {/* Decorative bands */}
        <DecorativeBand radius={0.38} y={0.1} thickness={0.025} />
        <DecorativeBand radius={0.78} y={0.9} thickness={0.03} />
        <DecorativeBand radius={0.55} y={1.5} thickness={0.025} />
        <DecorativeBand radius={0.38} y={1.85} thickness={0.02} />

        {/* Engraving patterns */}
        <EngravingPattern radius={0.82} y={1.05} count={20} />
        <EngravingPattern radius={0.72} y={1.25} count={16} />

        {/* Paisley decorations */}
        <PaisleyPattern radius={0.76} y={0.7} count={10} />
      </group>
    </Float>
  )
}

// Mango leaf component
function MangoLeaf({ position, rotation, scale = 1 }) {
  const meshRef = useRef()

  const leafShape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.bezierCurveTo(0.08, 0.15, 0.1, 0.35, 0.05, 0.5)
    shape.bezierCurveTo(0.02, 0.6, 0, 0.65, 0, 0.7)
    shape.bezierCurveTo(0, 0.65, -0.02, 0.6, -0.05, 0.5)
    shape.bezierCurveTo(-0.1, 0.35, -0.08, 0.15, 0, 0)
    return shape
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle swaying
      meshRef.current.rotation.z = rotation[2] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <extrudeGeometry
        args={[leafShape, { depth: 0.01, bevelEnabled: false }]}
      />
      <meshStandardMaterial
        color="#228B22"
        roughness={0.6}
        metalness={0.1}
        emissive="#006400"
        emissiveIntensity={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Coconut on top
function Coconut({ position = [0, 0, 0] }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle wobble
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.03
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 1.2) * 0.02
    }
  })

  // Mango leaves arrangement
  const leaves = useMemo(() => {
    const leafCount = 7
    return Array.from({ length: leafCount }, (_, i) => {
      const angle = (i / leafCount) * Math.PI * 2
      const tilt = Math.PI / 6 + Math.random() * 0.2
      return {
        position: [
          Math.cos(angle) * 0.15,
          0.25,
          Math.sin(angle) * 0.15
        ],
        rotation: [tilt, angle, -Math.PI / 8 + Math.random() * 0.1],
        scale: 0.8 + Math.random() * 0.4
      }
    })
  }, [])

  return (
    <group ref={groupRef} position={position}>
      {/* Coconut body */}
      <mesh>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color="#8B4513"
          roughness={0.8}
          metalness={0.1}
          bumpScale={0.1}
        />
      </mesh>

      {/* Coconut texture details */}
      <mesh scale={1.01}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color="#654321"
          roughness={0.9}
          metalness={0}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Top tuft */}
      <mesh position={[0, 0.32, 0]}>
        <coneGeometry args={[0.08, 0.1, 8]} />
        <meshStandardMaterial
          color="#5D4037"
          roughness={0.9}
        />
      </mesh>

      {/* Mango leaves */}
      {leaves.map((leaf, i) => (
        <MangoLeaf key={i} {...leaf} />
      ))}
    </group>
  )
}

// Water/sacred liquid inside indication (rim glow)
function SacredWater({ radius, y }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <circleGeometry args={[radius, 32]} />
      <meshStandardMaterial
        color="#87CEEB"
        transparent
        opacity={0.4}
        emissive="#4169E1"
        emissiveIntensity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Sparkle particle around kalash
function DivineSparks() {
  const particlesRef = useRef()

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  const particles = useMemo(() => {
    return Array.from({ length: 30 }, () => ({
      position: [
        (Math.random() - 0.5) * 3,
        Math.random() * 4 - 0.5,
        (Math.random() - 0.5) * 3
      ],
      scale: 0.02 + Math.random() * 0.03
    }))
  }, [])

  return (
    <group ref={particlesRef}>
      {particles.map((p, i) => (
        <SparkParticle key={i} initialPosition={p.position} scale={p.scale} index={i} />
      ))}
    </group>
  )
}

function SparkParticle({ initialPosition, scale, index }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime + index * 0.5
      meshRef.current.position.y = initialPosition[1] + Math.sin(t * 2) * 0.3
      meshRef.current.position.x = initialPosition[0] + Math.cos(t * 1.5) * 0.2
      meshRef.current.position.z = initialPosition[2] + Math.sin(t * 1.3) * 0.2

      // Twinkling effect
      const twinkle = 0.5 + Math.sin(t * 5) * 0.5
      meshRef.current.material.opacity = twinkle * 0.8
      meshRef.current.scale.setScalar(scale * (0.8 + twinkle * 0.4))
    }
  })

  return (
    <mesh ref={meshRef} position={initialPosition}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color="#FFD700"
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}

// Aura/divine glow effect
function DivineAura() {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      meshRef.current.scale.setScalar(pulse)
      meshRef.current.material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 1.2, 0]}>
      <sphereGeometry args={[1.8, 32, 32]} />
      <meshBasicMaterial
        color="#FFD700"
        transparent
        opacity={0.1}
        side={THREE.BackSide}
      />
    </mesh>
  )
}

// Complete Kalash with coconut and leaves
function CompleteKalash({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <Kalash position={[0, 0, 0]} scale={1} />
      <Coconut position={[0, 2.35, 0]} />
      <SacredWater radius={0.35} y={1.92} />
    </group>
  )
}

// Main 3D Scene with full effects
export function KalashScene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.25}
        penumbra={1}
        intensity={1.5}
        castShadow
        color="#FFF8DC"
      />
      <spotLight
        position={[-10, 8, -10]}
        angle={0.3}
        penumbra={1}
        intensity={0.8}
        color="#FFD700"
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#FFD700" />
      <pointLight position={[0, -2, 5]} intensity={0.3} color="#B87333" />

      {/* Main Kalash */}
      <CompleteKalash position={[0, -1, 0]} scale={1} />

      {/* Divine effects */}
      <DivineAura />
      <DivineSparks />

      {/* Sparkles */}
      <Sparkles
        count={100}
        scale={8}
        size={3}
        speed={0.4}
        color="#FFD700"
        opacity={0.6}
      />
      <Sparkles
        count={60}
        scale={6}
        size={2}
        speed={0.3}
        color="#FFA500"
        opacity={0.4}
      />

      {/* Background stars */}
      <Stars
        radius={50}
        depth={50}
        count={800}
        factor={3}
        saturation={0.3}
        fade
        speed={0.3}
      />

      <Environment preset="studio" />
    </>
  )
}

// Exported component with Canvas wrapper
export default function KalashComponent({ className = '' }) {
  return (
    <div className={`kalash-container ${className}`} style={{ width: '100%', height: '100%' }}>
      <Canvas3D
        camera={{ position: [0, 2, 6], fov: 45 }}
      >
        <KalashScene />
      </Canvas3D>
    </div>
  )
}
