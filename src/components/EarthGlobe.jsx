import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Float } from '@react-three/drei';

/**
 * 3D Earth globe with the location marker.
 *
 * Kept in its own module so `three` is code-split out of the main bundle and is
 * only downloaded once the contact section scrolls into view.
 */
function EarthGlobeInner() {
  const globeRef = useRef();

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <group ref={globeRef}>
        {/* Globe Sphere */}
        <Sphere args={[2, 32, 32]}>
          <meshStandardMaterial
            color="#0b1329"
            wireframe={true}
            emissive="#00f0ff"
            emissiveIntensity={0.4}
          />
        </Sphere>
        {/* Core Glow Sphere */}
        <Sphere args={[1.8, 32, 32]}>
          <meshStandardMaterial
            color="#8b5cf6"
            transparent={true}
            opacity={0.3}
          />
        </Sphere>
        {/* Location Marker Pin over India */}
        <mesh position={[0.8, 0.9, 1.4]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>
    </Float>
  );
}

const EarthGlobe = ({ active = true }) => (
  <Canvas
    camera={{ position: [0, 0, 6], fov: 60 }}
    dpr={[1, 1.5]}
    frameloop={active ? 'always' : 'never'}
    gl={{ antialias: false, powerPreference: 'high-performance' }}
  >
    <ambientLight intensity={0.7} />
    <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f0ff" />
    <EarthGlobeInner />
  </Canvas>
);

export default EarthGlobe;
