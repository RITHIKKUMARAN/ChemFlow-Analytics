import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Environment } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

// Animated Blob
function AnimatedBlob({ position, color, scale = 1 }) {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
            meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.2) * 0.3;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
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
                    opacity={0.6}
                />
            </mesh>
        </Float>
    );
}

// Particle Field
function ParticleField() {
    const points = useRef();

    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(1000 * 3);
        for (let i = 0; i < 1000; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
        }
        return positions;
    }, []);

    useFrame((state) => {
        if (points.current) {
            points.current.rotation.y = state.clock.elapsedTime * 0.05;
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
                size={0.05}
                color="#8b5cf6"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
}

// Interactive Camera
function CameraRig() {
    useFrame((state) => {
        const t = state.clock.elapsedTime * 0.1;
        state.camera.position.x = Math.sin(t) * 0.5;
        state.camera.position.y = Math.cos(t * 0.5) * 0.3;
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
                camera={{ position: [0, 0, 10], fov: 75 }}
                gl={{ alpha: true, antialias: true }}
            >
                <CameraRig />

                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
                <pointLight position={[-10, -10, -10]} intensity={0.8} color="#06b6d4" />
                <pointLight position={[0, 10, 0]} intensity={0.6} color="#a78bfa" />

                {/* Animated Blobs */}
                <AnimatedBlob position={[-4, 2, -5]} color="#7c3aed" scale={2} />
                <AnimatedBlob position={[5, -1, -8]} color="#06b6d4" scale={1.5} />
                <AnimatedBlob position={[0, 3, -10]} color="#a78bfa" scale={1.8} />

                {/* Particle Field */}
                <ParticleField />

                {/* Volumetric Fog */}
                <fog attach="fog" args={['#020617', 5, 40]} />

                <Environment preset="night" />
            </Canvas>

            {/* Noise Texture Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                opacity: 0.08,
                mixBlendMode: 'overlay',
                pointerEvents: 'none'
            }} />

            {/* Gradient Overlay for Depth */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(2, 6, 23, 0.4) 100%)',
                pointerEvents: 'none'
            }} />
        </div>
    );
}
