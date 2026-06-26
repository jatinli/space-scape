"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** A receding grid of monolithic columns, lit by one slow warm sweep. */
function Columns() {
  const group = useRef<THREE.Group>(null);

  const items = useMemo(() => {
    const arr: { pos: [number, number, number]; h: number; key: number }[] = [];
    let k = 0;
    for (let ix = -3; ix <= 3; ix++) {
      for (let iz = -6; iz <= 2; iz++) {
        // carve an aisle down the centre
        if (ix === 0) continue;
        const h = 6 + ((ix * 7 + iz * 13) % 5) + Math.abs(iz) * 0.6;
        arr.push({ pos: [ix * 3.2, h / 2 - 4, iz * 3.4], h, key: k++ });
      }
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    // barely-there breathing rotation
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.06) * 0.04;
  });

  return (
    <group ref={group}>
      {items.map(({ pos, h, key }) => (
        <mesh key={key} position={pos} castShadow receiveShadow>
          <boxGeometry args={[1.1, h, 1.1]} />
          <meshStandardMaterial color="#d7d3cc" roughness={0.92} metalness={0.02} />
        </mesh>
      ))}
      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#eceae5" roughness={1} />
      </mesh>
    </group>
  );
}

function Rig() {
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    // slow perpetual dolly push-in/pull-back
    const targetZ = 13 + Math.sin(t * 0.12) * 2.4;
    // cursor parallax
    const px = state.pointer.x * 1.6;
    const py = 1.2 + state.pointer.y * 0.9;
    const cam = state.camera;
    cam.position.x += (px - cam.position.x) * Math.min(1, delta * 2);
    cam.position.y += (py - cam.position.y) * Math.min(1, delta * 2);
    cam.position.z += (targetZ - cam.position.z) * Math.min(1, delta * 1.4);
    cam.lookAt(0, 0.5, -4);
  });
  return null;
}

function SweepLight() {
  const light = useRef<THREE.DirectionalLight>(null);
  useFrame((state) => {
    if (!light.current) return;
    const t = state.clock.elapsedTime;
    light.current.position.set(Math.sin(t * 0.15) * 12, 11, Math.cos(t * 0.15) * 6 + 4);
  });
  return (
    <directionalLight
      ref={light}
      color="#fff6ea"
      intensity={2.7}
      castShadow
      shadow-mapSize={[1024, 1024]}
    />
  );
}

export default function HeroScene() {
  return (
    <>
      <color attach="background" args={["#f0eee9"]} />
      <fog attach="fog" args={["#f0eee9", 11, 34]} />
      <ambientLight intensity={0.85} />
      <hemisphereLight args={["#ffffff", "#cfcabf", 0.9]} />
      <SweepLight />
      <Columns />
      <Rig />
    </>
  );
}
