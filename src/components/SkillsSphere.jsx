import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';

/**
 * Interactive 3D skill tag-cloud.
 *
 * Lives in its own module so that `three` + `@react-three/*` (the heaviest
 * dependency in the project) are code-split away from the main bundle and are
 * only ever downloaded once this section actually scrolls into view.
 */
function SkillsSphereInner({ skills }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
      groupRef.current.rotation.x += delta * 0.15;
    }
  });

  const count = skills.length;
  const radius = 2.4;

  return (
    <group ref={groupRef}>
      {skills.map((skill, i) => {
        // Sphere point distribution using Golden Ratio
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        return (
          <Float key={skill.name} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Text
              position={[x, y, z]}
              fontSize={0.28}
              color={skill.color || '#00f0ff'}
              anchorX="center"
              anchorY="middle"
            >
              {skill.name}
            </Text>
          </Float>
        );
      })}
    </group>
  );
}

const SkillsSphere = ({ skills, active = true }) => (
  <Canvas
    camera={{ position: [0, 0, 5], fov: 60 }}
    dpr={[1, 1.5]}
    frameloop={active ? 'always' : 'never'}
    gl={{ antialias: false, powerPreference: 'high-performance' }}
  >
    <ambientLight intensity={1} />
    <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f0ff" />
    <SkillsSphereInner skills={skills} />
  </Canvas>
);

export default SkillsSphere;
