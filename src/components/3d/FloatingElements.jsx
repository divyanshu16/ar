import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import Canvas3D from './Canvas3D'

// 3D Marigold Flower
function Marigold({ position, scale = 1, speed = 1 }) {
  const groupRef = useRef()
  const petalCount = 24

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * speed * 0.5
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.2
    }
  })

  const petals = useMemo(() => {
    return Array.from({ length: petalCount }, (_, i) => {
      const angle = (i / petalCount) * Math.PI * 2
      const layer = Math.floor(i / 8)
      const radius = 0.3 + layer * 0.15
      return {
        position: [
          Math.cos(angle) * radius,
          layer * 0.05,
          Math.sin(angle) * radius
        ],
        rotation: [0, angle, Math.PI / 4 - layer * 0.2]
      }
    })
  }, [])

  return (
    <Float speed={2} floatIntensity={0.3}>
      <group ref={groupRef} position={position} scale={scale}>
        {/* Center */}
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#FF6600" roughness={0.8} />
        </mesh>

        {/* Petals */}
        {petals.map((petal, i) => (
          <mesh key={i} position={petal.position} rotation={petal.rotation}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#FF9933' : '#FFCC00'}
              roughness={0.6}
            />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

// Paisley Shape (simplified 3D representation)
function Paisley({ position, rotation, scale = 1, color = '#D4AF37' }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  // Create paisley-like curve
  const curve = useMemo(() => {
    const points = []
    for (let i = 0; i <= 50; i++) {
      const t = (i / 50) * Math.PI * 2
      const r = 0.5 * (1 - Math.sin(t))
      points.push(new THREE.Vector3(
        r * Math.cos(t),
        r * Math.sin(t),
        0
      ))
    }
    return new THREE.CatmullRomCurve3(points, true)
  }, [])

  return (
    <Float speed={1.5} floatIntensity={0.2}>
      <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
        <mesh>
          <tubeGeometry args={[curve, 64, 0.03, 8, true]} />
          <meshStandardMaterial
            color={color}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>
    </Float>
  )
}

// Decorative Mandala Ring
function MandalaRing({ position, scale = 1 }) {
  const groupRef = useRef()
  const segments = 12

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Outer ring */}
      <mesh>
        <torusGeometry args={[1, 0.02, 16, 100]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Decorative elements */}
      {Array.from({ length: segments }, (_, i) => {
        const angle = (i / segments) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.8, Math.sin(angle) * 0.8, 0]}
            rotation={[0, 0, angle]}
          >
            <circleGeometry args={[0.1, 6]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
          </mesh>
        )
      })}
    </group>
  )
}

// Floating Hearts
function Heart({ position, scale = 1, color = '#E8A4B8' }) {
  const meshRef = useRef()

  // Create heart shape
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

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3
      meshRef.current.scale.setScalar(scale * (1 + Math.sin(state.clock.elapsedTime * 2) * 0.1))
    }
  })

  return (
    <Float speed={2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} rotation={[0, 0, Math.PI]}>
        <extrudeGeometry
          args={[heartShape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 }]}
        />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </mesh>
    </Float>
  )
}

// Scene with floating decorative elements
function DecorativeScene({ variant = 'default' }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#FFF8DC" />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#D4AF37" />

      {variant === 'marigold' && (
        <>
          <Marigold position={[-2, 1, 0]} scale={0.8} speed={0.8} />
          <Marigold position={[2, -1, 1]} scale={0.6} speed={1.2} />
          <Marigold position={[0, 2, -1]} scale={0.7} speed={1} />
        </>
      )}

      {variant === 'hearts' && (
        <>
          <Heart position={[-1.5, 0.5, 0]} scale={0.4} />
          <Heart position={[1.5, -0.5, 0.5]} scale={0.3} color="#D4AF37" />
          <Heart position={[0, 1.5, -0.5]} scale={0.35} />
        </>
      )}

      {variant === 'mandala' && (
        <>
          <MandalaRing position={[0, 0, 0]} scale={1.5} />
          <Paisley position={[-2, 1, 0]} rotation={[0, 0, Math.PI / 4]} scale={0.5} />
          <Paisley position={[2, -1, 0]} rotation={[0, 0, -Math.PI / 4]} scale={0.4} />
        </>
      )}

      {variant === 'default' && (
        <>
          <Marigold position={[-3, 2, -2]} scale={0.5} />
          <Heart position={[3, 1, -1]} scale={0.3} />
          <Paisley position={[-2, -2, 0]} rotation={[0, 0, 0]} scale={0.4} />
        </>
      )}

      <Sparkles
        count={100}
        scale={8}
        size={1.5}
        speed={0.3}
        color="#D4AF37"
        opacity={0.3}
      />
    </>
  )
}

export default function FloatingElements({ variant = 'default', className = '' }) {
  return (
    <div className={`floating-elements-container ${className}`} style={{ width: '100%', height: '100%' }}>
      <Canvas3D
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <DecorativeScene variant={variant} />
      </Canvas3D>
    </div>
  )
}

export { Marigold, Paisley, MandalaRing, Heart }
