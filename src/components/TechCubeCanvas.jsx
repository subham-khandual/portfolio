import React, { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';

// Procedural in-memory badge textures (no external fonts, zero network latency, zero WebGL context crash)
function createFaceTexture(name, accentColor) {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Deep dark cyberpunk container background
  ctx.fillStyle = '#060d19';
  ctx.fillRect(0, 0, 512, 512);

  // Outer neon frame
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 14;
  ctx.strokeRect(12, 12, 488, 488);

  // Inner border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 3;
  ctx.strokeRect(28, 28, 456, 456);

  // Corner tech notches
  ctx.fillStyle = accentColor;
  ctx.fillRect(12, 12, 36, 10);
  ctx.fillRect(12, 12, 10, 36);
  ctx.fillRect(464, 12, 36, 10);
  ctx.fillRect(490, 12, 10, 36);
  ctx.fillRect(12, 490, 36, 10);
  ctx.fillRect(12, 464, 10, 36);
  ctx.fillRect(464, 490, 36, 10);
  ctx.fillRect(490, 464, 10, 36);

  // Tech category header
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = 'bold 24px "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('• CORE STACK •', 256, 180);

  // Main Tech Title
  ctx.fillStyle = accentColor;
  ctx.font = '900 52px "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(name, 256, 265);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// 3D Rotating Tech Cube Component
function TechCube() {
  const meshRef = useRef();
  const coreRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4;
      meshRef.current.rotation.y += delta * 0.6;
    }
    if (coreRef.current) {
      coreRef.current.rotation.x -= delta * 0.5;
      coreRef.current.rotation.y += delta * 0.8;
    }
  });

  const materials = useMemo(() => {
    const faces = [
      { text: 'AI / ML', color: '#ec4899' },
      { text: 'MONGODB', color: '#10b981' },
      { text: 'DEVOPS', color: '#f59e0b' },
      { text: 'PYTHON', color: '#00f0ff' },
      { text: 'REACT.JS', color: '#00f0ff' },
      { text: 'NODE.JS', color: '#8b5cf6' },
    ];
    return faces.map((f) => {
      const tex = createFaceTexture(f.text, f.color);
      return new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.3,
        metalness: 0.1,
        emissive: new THREE.Color(f.color),
        emissiveIntensity: 0.25,
      });
    });
  }, []);

  const edgesGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(new THREE.BoxGeometry(2.21, 2.21, 2.21));
  }, []);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.6}>
      <group ref={meshRef}>
        {/* 6-Faced Cyber Tech Box */}
        <mesh material={materials}>
          <boxGeometry args={[2.2, 2.2, 2.2]} />
        </mesh>

        {/* Outer Neon Glow Edges */}
        <lineSegments geometry={edgesGeometry}>
          <lineBasicMaterial color="#00f0ff" linewidth={2} />
        </lineSegments>

        {/* Inner Glowing Spinning Purple Core */}
        <mesh ref={coreRef}>
          <octahedronGeometry args={[0.9, 0]} />
          <meshBasicMaterial color="#8b5cf6" wireframe />
        </mesh>
      </group>
    </Float>
  );
}

const TechCubeCanvas = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5] }}
      dpr={[1, 1.5]}
      gl={{ powerPreference: 'high-performance', antialias: true, alpha: false }}
      style={{ width: '100%', height: '100%', background: '#070d1a' }}
    >
      <color attach="background" args={['#070d1a']} />
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f0ff" />
      <pointLight position={[-10, -10, -10]} intensity={1.2} color="#8b5cf6" />
      <Suspense fallback={null}>
        <TechCube />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
    </Canvas>
  );
};

export default TechCubeCanvas;
