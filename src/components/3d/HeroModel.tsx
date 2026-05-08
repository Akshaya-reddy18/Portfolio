"use client";

import { useRef, useEffect, Suspense } from "react";
import { useGLTF, useAnimations, Environment, OrbitControls, Float } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

function Model({ url }: { url: string }) {
  const group = useRef<any>(null);
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Play the first animation if available
    if (animations.length > 0 && actions) {
      const firstAction = Object.values(actions)[0];
      if (firstAction) {
        firstAction.play();
      }
    }
  }, [actions, animations]);

  return (
    <group ref={group} dispose={null}>
      <Float
        speed={1.5} // Animation speed
        rotationIntensity={0.2} // XYZ rotation intensity
        floatIntensity={0.5} // Up/down float intensity
        floatingRange={[-0.1, 0.1]} // Range of y-axis values the object will float within
      >
        <primitive object={scene} scale={2.0} position={[0, -2.5, 0]} />
      </Float>
    </group>
  );
}

// Preload the model
useGLTF.preload("/model.glb");

export default function HeroModel() {
  return (
    <div className="w-full h-full relative z-20 pointer-events-none">
      <Canvas camera={{ position: [0, 1.5, 5], fov: 40 }} className="pointer-events-auto">
        {/* Soft base lighting */}
        <ambientLight intensity={0.8} />
        <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={1.5} />
        
        {/* Holographic/Cyberpunk Rim Lights */}
        <pointLight position={[3, 1, -2]} intensity={4} color="#06b6d4" /> {/* Cyan edge */}
        <pointLight position={[-3, 0, -2]} intensity={4} color="#a855f7" /> {/* Purple edge */}
        <pointLight position={[0, -2, 2]} intensity={1} color="#8b5cf6" /> {/* Front purple fill */}
        
        <Suspense fallback={null}>
          <Model url="/model.glb" />
          <Environment preset="city" />
        </Suspense>
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate 
          autoRotateSpeed={0.3} 
          minPolarAngle={Math.PI / 2.2}
          maxPolarAngle={Math.PI / 1.8}
          minAzimuthAngle={-Math.PI / 8}
          maxAzimuthAngle={Math.PI / 8}
        />
      </Canvas>
    </div>
  );
}
