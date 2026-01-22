import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'

/**
 * Canvas3D - A wrapper around React Three Fiber's Canvas that fixes
 * the common issue where 3D components don't render on first page load
 * but do on subsequent navigations.
 *
 * The fix works by:
 * 1. Using frameloop="always" to ensure continuous rendering
 * 2. Adding a unique key based on mount state to force proper WebGL context initialization
 * 3. A small delay before showing the canvas to ensure DOM is ready
 */
export default function Canvas3D({
  children,
  camera,
  dpr = [1, 2],
  shadows = false,
  style = {},
  className = '',
  gl = { antialias: true, alpha: true },
  ...props
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Small delay to ensure DOM is fully ready before initializing WebGL
    const timer = requestAnimationFrame(() => {
      setMounted(true)
    })
    return () => cancelAnimationFrame(timer)
  }, [])

  if (!mounted) {
    // Return empty div with same dimensions to prevent layout shift
    return (
      <div
        className={className}
        style={{
          ...style,
          background: 'transparent',
        }}
      />
    )
  }

  return (
    <Canvas
      key="canvas-mounted"
      camera={camera}
      dpr={dpr}
      shadows={shadows}
      gl={gl}
      frameloop="always"
      style={{
        background: 'transparent',
        ...style,
      }}
      className={className}
      {...props}
    >
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </Canvas>
  )
}
