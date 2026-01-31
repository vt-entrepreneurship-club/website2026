"use client";

import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { CrosshatchEffect } from "./crosshatch-effect";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

function LogoMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const [paths, setPaths] = useState<THREE.ShapePath[]>([]);
  const { viewport } = useThree();

  useEffect(() => {
    const loader = new SVGLoader();
    
    // Load the SVG
    fetch("/logo.svg")
      .then((res) => res.text())
      .then((svgText) => {
        const svgData = loader.parse(svgText);
        setPaths(svgData.paths);
      });
  }, []);

  // Gentle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  if (paths.length === 0) return null;

  // Calculate scale to fit viewport
  const scale = Math.min(viewport.width, viewport.height) * 0.003;

  return (
    <group ref={groupRef} scale={[scale, -scale, scale]} position={[0, 0, 0]}>
      {paths.map((path, i) => {
        const shapes = SVGLoader.createShapes(path);
        
        return shapes.map((shape, j) => (
          <mesh key={`${i}-${j}`} position={[-185, -253, 0]}>
            <extrudeGeometry
              args={[
                shape,
                {
                  depth: 20,
                  bevelEnabled: true,
                  bevelThickness: 2,
                  bevelSize: 1,
                  bevelSegments: 3,
                },
              ]}
            />
            <meshStandardMaterial
              color="#E54B00"
              metalness={0.3}
              roughness={0.4}
            />
          </mesh>
        ));
      })}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, 5]} intensity={0.3} />
      <pointLight position={[0, 0, 10]} intensity={0.5} />
      
      <LogoMesh />
      
      <EffectComposer>
        <CrosshatchEffect
          spacing={10}
          thickness={2.2}
          angle={66}
          contrast={1.01}
          edgeStrength={1.0}
          wave={0.33}
          waveFrequency={3.0}
          lineWeight={0}
          inkColor="#ff8100"
          paperColor="#f3efec"
        />
      </EffectComposer>
    </>
  );
}

interface LogoSceneProps {
  className?: string;
}

export function LogoScene({ className }: LogoSceneProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={className}>
        {/* Fallback while loading */}
      </div>
    );
  }

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
