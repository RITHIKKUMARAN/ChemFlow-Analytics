import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';

const DataPoint = ({ position, status, data, size }) => {
    const mesh = useRef();
    const [hovered, setHover] = React.useState(false);

    const color = useMemo(() => {
        if (status === 'Critical') return '#fb7185';
        if (status === 'Warning') return '#facc15';
        return '#34d399';
    }, [status]);

    useFrame((state) => {
        if (mesh.current) {
            if (status === 'Critical') {
                const s = size + Math.sin(state.clock.elapsedTime * 5) * 0.08;
                mesh.current.scale.set(s, s, s);
            }
            mesh.current.rotation.x += 0.008;
            mesh.current.rotation.y += 0.008;
        }
    });

    return (
        <group position={position}>
            <mesh
                ref={mesh}
                onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
                onPointerOut={() => setHover(false)}
            >
                <sphereGeometry args={[size, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={hovered ? 2.5 : 0.8}
                    transparent
                    opacity={0.9}
                    roughness={0.3}
                    metalness={0.7}
                />
            </mesh>
            {hovered && (
                <Html distanceFactor={10}>
                    <div
                        className="glass-panel p-3 rounded-lg border border-white/20 text-xs w-52"
                        style={{
                            transform: 'translate(20px, -50%)',
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            backdropFilter: 'blur(20px)'
                        }}
                    >
                        <div
                            className="font-bold mb-1 font-['JetBrains_Mono'] text-xs"
                            style={{ color: color }}
                        >
                            {status?.toUpperCase() || 'NORMAL'}
                        </div>
                        <div className="text-white font-['JetBrains_Mono'] mb-1 text-sm font-bold">
                            {data.equipment_id}
                        </div>
                        <div className="text-slate-400 text-xs mb-2">
                            {data.equipment_type}
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500 font-['JetBrains_Mono']">
                            <span>Pressure:</span>
                            <span className="text-right text-purple-400 font-bold">
                                {data.pressure?.toFixed(1) ?? 'N/A'} bar
                            </span>
                            <span>Temp:</span>
                            <span className="text-right text-amber-400 font-bold">
                                {data.temperature?.toFixed(1) ?? 'N/A'} °C
                            </span>
                            <span>Flow:</span>
                            <span className="text-right text-cyan-400 font-bold">
                                {data.flowrate?.toFixed(1) ?? 'N/A'} m³/h
                            </span>
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
};

export default function DataVis3D({ data }) {
    if (!data || data.length === 0) return null;

    const normalizedData = useMemo(() => {
        // Filter out invalid entries first
        const validData = data.filter(d =>
            typeof d.flowrate === 'number' &&
            typeof d.pressure === 'number' &&
            typeof d.temperature === 'number'
        );

        if (validData.length === 0) return [];

        const flows = validData.map(d => d.flowrate);
        const temps = validData.map(d => d.temperature);
        const presses = validData.map(d => d.pressure);

        const maxFlow = Math.max(...flows);
        const maxTemp = Math.max(...temps);
        const maxPress = Math.max(...presses);

        const minFlow = Math.min(...flows);
        const minTemp = Math.min(...temps);
        const minPress = Math.min(...presses);

        const rangeFlow = maxFlow - minFlow || 1;
        const rangeTemp = maxTemp - minTemp || 1;
        const rangePress = maxPress - minPress || 1;

        return validData.map(d => {
            const x = ((d.pressure - minPress) / rangePress) * 10 - 5;
            const y = ((d.temperature - minTemp) / rangeTemp) * 10 - 5;
            const z = ((d.flowrate - minFlow) / rangeFlow) * 10 - 5;
            const size = 0.25 + ((d.flowrate - minFlow) / rangeFlow) * 0.35;

            return { ...d, position: [x, y, z], size };
        });
    }, [data]);

    return (
        <div className="w-full h-[500px] rounded-xl overflow-hidden relative">
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <h3 className="text-base font-['Space_Grotesk'] font-bold text-white mb-1">
                    3D Parameter Space
                </h3>
                <p className="text-xs text-slate-400 font-['JetBrains_Mono']">
                    X: Pressure • Y: Temperature • Z: Flowrate
                </p>
            </div>

            <Canvas camera={{ position: [12, 10, 12], fov: 50 }}>
                <ambientLight intensity={0.4} />
                <pointLight position={[15, 15, 15]} intensity={2} color="#8b5cf6" />
                <pointLight position={[-10, 5, -5]} intensity={1.5} color="#22d3ee" />
                <pointLight position={[0, -10, 10]} intensity={1} color="#34d399" />

                <OrbitControls
                    enableZoom={true}
                    autoRotate
                    autoRotateSpeed={0.5}
                    enablePan={false}
                    minDistance={8}
                    maxDistance={25}
                />

                {/* Grid and Axes */}
                <gridHelper args={[20, 20, '#8b5cf620', '#ffffff08']} />
                <axesHelper args={[6]} />

                {/* Data Points */}
                {normalizedData.map((item, index) => (
                    <DataPoint
                        key={index}
                        position={item.position}
                        status={item.status || 'Normal'}
                        data={item}
                        size={item.size}
                    />
                ))}

                {/* Atmosphere */}
                <fog attach="fog" args={['#020617', 10, 35]} />
            </Canvas>
        </div>
    );
}
