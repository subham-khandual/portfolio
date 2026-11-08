import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

function CyberRing({ radius, tube, speedX, speedY, speedZ, color, wireframe = true }) {
  const ringRef = useRef();

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * speedX;
      ringRef.current.rotation.y += delta * speedY;
      ringRef.current.rotation.z += delta * speedZ;
    }
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, tube, 16, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        wireframe={wireframe}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

function getDeterministicValue(seed) {
  const val = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return val - Math.floor(val);
}

function FloatingCoreParticles({ count = 35 }) {
  const pointsRef = useRef();

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.15;
      pointsRef.current.rotation.x += delta * 0.08;
    }
  });

  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r1 = getDeterministicValue(i * 3 + 1);
      const r2 = getDeterministicValue(i * 3 + 2);
      const r3 = getDeterministicValue(i * 3 + 3);

      const radius = 2.4 + r1 * 0.8;
      const theta = r2 * 2 * Math.PI;
      const phi = Math.acos(r3 * 2 - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, [count]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#00f0ff"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

function HeroScene() {
  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
      <group>
        {/* Outer Cyan Ring */}
        <CyberRing
          radius={2.45}
          tube={0.025}
          speedX={0.2}
          speedY={0.35}
          speedZ={0.1}
          color="#00f0ff"
        />
        {/* Inner Purple Ring */}
        <CyberRing
          radius={2.2}
          tube={0.02}
          speedX={-0.3}
          speedY={0.2}
          speedZ={0.25}
          color="#8b5cf6"
        />
        {/* Third Accent Pink Ring */}
        <CyberRing
          radius={2.6}
          tube={0.015}
          speedX={0.15}
          speedY={-0.25}
          speedZ={0.3}
          color="#ec4899"
        />
        {/* Orbiting particles */}
        <FloatingCoreParticles count={40} />
      </group>
    </Float>
  );
}

const HeroCanvas3D = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 'min(440px, 92vw)',
        height: 'min(440px, 92vw)',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      <ambientLight intensity={0.8} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#00f0ff" />
      <pointLight position={[-5, -5, -5]} intensity={1.2} color="#8b5cf6" />
      <HeroScene />
    </Canvas>
  );
};

export default HeroCanvas3D;
