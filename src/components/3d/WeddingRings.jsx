import { useRef, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  Environment,
  Float,
  Sparkles,
  Stars,
  Trail,
  MeshReflectorMaterial
} from '@react-three/drei'
import * as THREE from 'three'
import Canvas3D from './Canvas3D'

// Single Wedding Ring Component with enhanced effects
function Ring({ position, rotation, scale = 1, delay = 0, color = "#D4AF37" }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  const geometry = useMemo(() => {
    return new THREE.TorusGeometry(1, 0.18, 64, 128)
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime + delay
      meshRef.current.rotation.x = rotation[0] + Math.sin(t * 0.5) * 0.15
      meshRef.current.rotation.y = rotation[1] + t * 0.3
      meshRef.current.rotation.z = rotation[2] + Math.cos(t * 0.3) * 0.05

      // Pulse effect on hover
      const targetScale = hovered ? scale * 1.1 : scale
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.3}
      floatIntensity={0.8}
      floatingRange={[-0.15, 0.15]}
    >
      <Trail
        width={2}
        length={8}
        color={new THREE.Color(color)}
        attenuation={(t) => t * t}
      >
        <mesh
          ref={meshRef}
          position={position}
          scale={scale}
          geometry={geometry}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial
            color={color}
            metalness={0.95}
            roughness={0.05}
            envMapIntensity={2}
            emissive={color}
            emissiveIntensity={hovered ? 0.3 : 0.1}
          />
        </mesh>
      </Trail>
    </Float>
  )
}

// Enhanced Diamond with refraction
function Diamond({ position, scale = 0.2 }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 3
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.2

      // Sparkle effect
      const sparkle = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.1
      meshRef.current.scale.setScalar(scale * sparkle * (hovered ? 1.3 : 1))
    }
  })

  return (
    <Float speed={3} floatIntensity={0.3}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <octahedronGeometry args={[1, 2]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0}
          roughness={0}
          transmission={0.9}
          thickness={0.5}
          envMapIntensity={3}
          clearcoat={1}
          clearcoatRoughness={0}
          ior={2.4}
        />
      </mesh>
    </Float>
  )
}

// Interlocked Wedding Rings with enhanced animation
function InterlockedRings() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.3
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.1
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      {/* First ring - gold */}
      <Ring
        position={[-0.6, 0, 0]}
        rotation={[Math.PI / 2, 0, Math.PI / 5]}
        scale={1}
        color="#D4AF37"
      />

      {/* Second ring - rose gold */}
      <Ring
        position={[0.6, 0, 0]}
        rotation={[Math.PI / 2, Math.PI / 2, -Math.PI / 5]}
        scale={1}
        delay={1.5}
        color="#E8B4B8"
      />

      {/* Diamonds */}
      <Diamond position={[-0.6, 1.15, 0]} scale={0.18} />
      <Diamond position={[0.6, 1.15, 0]} scale={0.12} />

      {/* Small accent diamonds */}
      <Diamond position={[-0.3, 0.3, 0.5]} scale={0.06} />
      <Diamond position={[0.4, -0.2, 0.4]} scale={0.05} />
    </group>
  )
}

// 3D Marigold Flower
function Marigold({ position, scale = 1, speed = 1 }) {
  const groupRef = useRef()
  const petalCount = 24

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * speed * 0.5
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * speed) * 0.1
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.8) * 0.3
    }
  })

  const petals = useMemo(() => {
    return Array.from({ length: petalCount }, (_, i) => {
      const angle = (i / petalCount) * Math.PI * 2
      const layer = Math.floor(i / 8)
      const radius = 0.25 + layer * 0.12
      return {
        position: [
          Math.cos(angle) * radius,
          layer * 0.04,
          Math.sin(angle) * radius
        ],
        rotation: [0, angle, Math.PI / 4 - layer * 0.15]
      }
    })
  }, [])

  return (
    <Float speed={2} floatIntensity={0.5}>
      <group ref={groupRef} position={position} scale={scale}>
        {/* Center */}
        <mesh>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#FF6600" roughness={0.7} emissive="#FF4400" emissiveIntensity={0.2} />
        </mesh>
        {/* Petals */}
        {petals.map((petal, i) => (
          <mesh key={i} position={petal.position} rotation={petal.rotation}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#FF9933' : '#FFCC00'}
              roughness={0.5}
              emissive={i % 2 === 0 ? '#FF6600' : '#FF9900'}
              emissiveIntensity={0.1}
            />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

// Floating Rose Petals
function RosePetals() {
  const count = 25
  const meshRef = useRef()

  const petals = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 12,
        Math.random() * 8 - 2,
        (Math.random() - 0.5) * 8
      ],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ],
      speed: 0.3 + Math.random() * 0.5,
      rotSpeed: 0.5 + Math.random() * 1
    }))
  }, [])

  return (
    <group>
      {petals.map((petal, i) => (
        <FloatingPetal key={i} {...petal} index={i} />
      ))}
    </group>
  )
}

function FloatingPetal({ position, rotation, speed, rotSpeed, index }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y -= speed * 0.02
      meshRef.current.rotation.x += rotSpeed * 0.01
      meshRef.current.rotation.z += rotSpeed * 0.015

      // Reset when fallen
      if (meshRef.current.position.y < -4) {
        meshRef.current.position.y = 6
        meshRef.current.position.x = (Math.random() - 0.5) * 12
      }
    }
  })

  const color = index % 3 === 0 ? '#E8A4B8' : index % 3 === 1 ? '#FFB6C1' : '#FFC0CB'

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={0.15}>
      <planeGeometry args={[1, 0.8]} />
      <meshStandardMaterial
        color={color}
        side={THREE.DoubleSide}
        transparent
        opacity={0.8}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </mesh>
  )
}

// Golden Light Beams
function LightBeams() {
  const beamsRef = useRef()

  useFrame((state) => {
    if (beamsRef.current) {
      beamsRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={beamsRef}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          position={[0, 0, 0]}
          rotation={[0, (i / 6) * Math.PI * 2, Math.PI / 8]}
        >
          <planeGeometry args={[0.05, 15]} />
          <meshBasicMaterial
            color="#D4AF37"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

// Orbiting Hearts
function OrbitingHearts() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  const heartShape = useMemo(() => {
    const shape = new THREE.Shape()
    const x = 0, y = 0
    shape.moveTo(x + 0.25, y + 0.25)
    shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y)
    shape.bezierCurveTo(x - 0.35, y, x - 0.35, y + 0.35, x - 0.35, y + 0.35)
    shape.bezierCurveTo(x - 0.35, y + 0.55, x - 0.2, y + 0.77, x + 0.25, y + 0.95)
    shape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.85, y + 0.55, x + 0.85, y + 0.35)
    shape.bezierCurveTo(x + 0.85, y + 0.35, x + 0.85, y, x + 0.5, y)
    shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25)
    return shape
  }, [])

  return (
    <group ref={groupRef}>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 3) * Math.PI * 2) * 3.5,
            Math.sin(i * 1.5) * 0.5,
            Math.sin((i / 3) * Math.PI * 2) * 3.5
          ]}
          rotation={[0, -(i / 3) * Math.PI * 2, Math.PI]}
          scale={0.15}
        >
          <extrudeGeometry
            args={[heartShape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 }]}
          />
          <meshStandardMaterial
            color="#E8A4B8"
            metalness={0.5}
            roughness={0.3}
            emissive="#E8A4B8"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

// Main 3D Scene
function WeddingRingsScene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.2}
        penumbra={1}
        intensity={1.5}
        castShadow
        color="#FFF8DC"
      />
      <spotLight
        position={[-10, 5, -10]}
        angle={0.3}
        penumbra={1}
        intensity={0.8}
        color="#D4AF37"
      />
      <pointLight position={[0, -5, 0]} intensity={0.3} color="#FFD700" />
      <pointLight position={[5, 0, 5]} intensity={0.4} color="#FFF5EE" />

      {/* Main elements */}
      <InterlockedRings />
      <OrbitingHearts />
      <LightBeams />
      <RosePetals />

      {/* Marigolds */}
      <Marigold position={[-4, 2, -2]} scale={0.6} speed={0.8} />
      <Marigold position={[4, 1, -1]} scale={0.5} speed={1.2} />
      <Marigold position={[-3, -2, 1]} scale={0.4} speed={1} />
      <Marigold position={[3.5, -1, 2]} scale={0.45} speed={0.9} />

      {/* Sparkles and stars */}
      <Sparkles
        count={150}
        scale={10}
        size={3}
        speed={0.4}
        color="#D4AF37"
        opacity={0.6}
      />
      <Sparkles
        count={80}
        scale={8}
        size={2}
        speed={0.3}
        color="#E8A4B8"
        opacity={0.4}
      />
      <Stars
        radius={50}
        depth={50}
        count={1000}
        factor={3}
        saturation={0.5}
        fade
        speed={0.5}
      />

      <Environment preset="studio" />
    </>
  )
}

// Exported component with Canvas
export default function WeddingRings({ className = '' }) {
  return (
    <div className={`wedding-rings-container ${className}`} style={{ width: '100%', height: '100%' }}>
      <Canvas3D
        camera={{ position: [0, 0, 6], fov: 45 }}
      >
        <WeddingRingsScene />
      </Canvas3D>
    </div>
  )
}
