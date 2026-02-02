import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

// Dynamic Moving Bubble - Drifts up and sways
// Dynamic Moving Bubble - Drifts randomly in space
function MovingBubble({ position, color, scale }) {
    const meshRef = useRef();
    // Random movement parameters for unique drifting behavior
    const [config] = useState(() => ({
        xOff: Math.random() * 100,
        yOff: Math.random() * 100,
        zOff: Math.random() * 100,
        xSpd: Math.random() * 0.2 + 0.1,
        ySpd: Math.random() * 0.2 + 0.1,
        zSpd: Math.random() * 0.1 + 0.05,
        amp: Math.random() * 3 + 2 // Amplitude of drift
    }));

    useFrame((state) => {
        if (meshRef.current) {
            const t = state.clock.elapsedTime;

            // Organic floating motion around initial position using sine waves
            meshRef.current.position.x = position[0] + Math.sin(t * config.xSpd + config.xOff) * config.amp;
            meshRef.current.position.y = position[1] + Math.sin(t * config.ySpd + config.yOff) * config.amp;
            meshRef.current.position.z = position[2] + Math.sin(t * config.zSpd + config.zOff) * (config.amp * 0.5);

            // Simple rotation
            meshRef.current.rotation.x = Math.sin(t * 0.2 + config.xOff) * 0.5;
            meshRef.current.rotation.y = Math.cos(t * 0.1 + config.yOff) * 0.5;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh ref={meshRef} position={position} scale={scale}>
                <sphereGeometry args={[1, 64, 64]} />
                <MeshDistortMaterial
                    color={color}
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                    transparent
                    opacity={0.5}
                />
            </mesh>
        </Float>
    );
}

// Bubble System Factory
function Bubbles() {
    const bubbles = useMemo(() => {
        const temp = [];
        const colors = ['#7c3aed', '#06b6d4', '#a78bfa', '#6366f1', '#22d3ee', '#818cf8'];

        // Create 25 bubbles scattered throughout
        for (let i = 0; i < 25; i++) {
            const x = (Math.random() - 0.5) * 40; // Wide X spread
            const y = (Math.random() - 0.5) * 30; // Vertical spread
            const z = (Math.random() - 0.5) * 15 - 5; // Depth variation
            const scale = Math.random() * 1.5 + 0.5; // Random size
            const speed = Math.random() * 0.5 + 0.2; // Random rising speed
            const color = colors[Math.floor(Math.random() * colors.length)];

            temp.push({ position: [x, y, z], color, scale, speed });
        }
        return temp;
    }, []);

    return (
        <group>
            {bubbles.map((b, i) => (
                <MovingBubble key={i} {...b} />
            ))}
        </group>
    );
}

// Particle Field
function ParticleField() {
    const points = useRef();

    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(1500 * 3);
        for (let i = 0; i < 1500; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 60;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
        }
        return positions;
    }, []);

    useFrame((state) => {
        if (points.current) {
            points.current.rotation.y = state.clock.elapsedTime * 0.03;
        }
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particlesPosition.length / 3}
                    array={particlesPosition}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.06}
                color="#8b5cf6"
                transparent
                opacity={0.4}
                sizeAttenuation
            />
        </points>
    );
}

// Interactive Camera
function CameraRig() {
    useFrame((state) => {
        const t = state.clock.elapsedTime * 0.05;
        // Gentler camera movement
        state.camera.position.x = Math.sin(t) * 0.3;
        state.camera.position.y = Math.cos(t * 0.5) * 0.2;
        state.camera.lookAt(0, 0, 0);
    });
    return null;
}

export default function Scene() {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 50%, #020617 100%)'
        }}>
            <Canvas
                camera={{ position: [0, 0, 12], fov: 60 }} // Adjusted camera
                gl={{ alpha: true, antialias: true }}
                dpr={[1, 2]}
            >
                <CameraRig />

                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#8b5cf6" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#06b6d4" />
                <pointLight position={[0, 10, 0]} intensity={0.5} color="#a78bfa" />

                <Bubbles />
                <ParticleField />

                {/* Volumetric Fog */}
                <fog attach="fog" args={['#020617', 8, 35]} />

                <Environment preset="night" blur={0.6} />
            </Canvas>

            {/* Noise Texture Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                opacity: 0.06,
                mixBlendMode: 'overlay',
                pointerEvents: 'none'
            }} />

            {/* Gradient Overlay for Depth */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 50% 50%, transparent 20%, rgba(2, 6, 23, 0.4) 100%)',
                pointerEvents: 'none'
            }} />
        </div>
    );
}
