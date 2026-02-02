import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Stars, Sparkles, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

const AxisLabel = ({ position, label, color }) => (
    <group position={position}>
        <Text
            position={[0, 0.5, 0]}
            fontSize={0.4}
            color={color}
            font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnF8RD8yKx5.woff"
            anchorX="center"
            anchorY="middle"
        >
            {label}
        </Text>
        <mesh>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color={color} />
        </mesh>
    </group>
);

const CustomAxes = () => (
    <group>
        {/* Floor Grid (XZ) */}
        <gridHelper args={[12, 12, '#a78bfa30', '#a78bfa10']} position={[0, -5, 0]} />

        {/* Back Wall Grid (XY) */}
        <gridHelper args={[12, 12, '#f472b630', '#f472b610']} position={[0, 1, -6]} rotation={[Math.PI / 2, 0, 0]} />

        {/* Side Wall Grid (YZ) */}
        <gridHelper args={[12, 12, '#22d3ee30', '#22d3ee10']} position={[-6, 1, 0]} rotation={[0, 0, Math.PI / 2]} />

        {/* Thick Axis Lines at Bounds */}
        {/* X Axis - Pressure */}
        <mesh position={[0, -5.1, 6]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 12]} />
            <meshBasicMaterial color="#a78bfa" />
        </mesh>
        <AxisLabel position={[6.5, -5, 6]} label="PRESSURE" color="#a78bfa" />

        {/* Y Axis - Temperature */}
        <mesh position={[-6, 1, 6]}>
            <cylinderGeometry args={[0.05, 0.05, 12]} />
            <meshBasicMaterial color="#f472b6" />
        </mesh>
        <AxisLabel position={[-6, 7.5, 6]} label="TEMP" color="#f472b6" />

        {/* Z Axis - Flowrate */}
        <mesh position={[-6, -5.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 12]} />
            <meshBasicMaterial color="#22d3ee" />
        </mesh>
        <AxisLabel position={[-6, -5, 6.5]} label="FLOW" color="#22d3ee" />
    </group>
);

const DataPoint = ({ position, status, data, size, fixedColor }) => {
    const mesh = useRef();
    const [hovered, setHover] = useState(false);

    const color = useMemo(() => {
        if (fixedColor) return fixedColor;
        if (status === 'Critical') return '#fb7185';
        if (status === 'Warning') return '#facc15';
        return '#34d399';
    }, [status, fixedColor]);

    useFrame((state) => {
        if (mesh.current) {
            // Pulse effect for critical nodes
            if (status === 'Critical' && !fixedColor) {
                const s = size + Math.sin(state.clock.elapsedTime * 6) * 0.1;
                mesh.current.scale.setScalar(s);
            }
            // Gentle rotation for all
            mesh.current.rotation.x += 0.01;
            mesh.current.rotation.z += 0.01;
        }
    });

    return (
        <group position={position}>
            {/* Connection Line to Floor (Drop Shadow Guide) */}
            {hovered && (
                <line>
                    <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -position[1] - 5, 0)])} />
                    <lineBasicMaterial attach="material" color={color} opacity={0.3} transparent />
                </line>
            )}

            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.2}>
                <mesh
                    ref={mesh}
                    onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
                    onPointerOut={() => setHover(false)}
                >
                    <icosahedronGeometry args={[size, 1]} />
                    <meshPhysicalMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={hovered ? 2 : 0.5}
                        transparent
                        opacity={fixedColor ? 0.6 : 0.9}
                        roughness={0.1}
                        metalness={0.1}
                        clearcoat={1}
                        clearcoatRoughness={0}
                        transmission={0.2}
                    />
                </mesh>
            </Float>

            {/* Glowing Aura */}
            {hovered && (
                <mesh scale={[size * 1.5, size * 1.5, size * 1.5]}>
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshBasicMaterial color={color} transparent opacity={0.15} />
                </mesh>
            )}

            {hovered && (
                <Html distanceFactor={12}>
                    <div className="glass-panel p-4 rounded-xl border border-white/20 w-60 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
                            <span className="font-['JetBrains_Mono'] font-bold text-xs text-white bg-white/10 px-2 py-1 rounded">
                                {data.equipment_id}
                            </span>
                            <span className="font-bold text-[10px] uppercase tracking-wider" style={{ color: color }}>
                                {fixedColor ? (fixedColor === '#f87171' ? 'BASELINE' : 'CURRENT') : (status?.toUpperCase() || 'NORMAL')}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">Pressure</span>
                                <span className="font-mono text-purple-300 font-bold">{data.pressure?.toFixed(2)} bar</span>
                            </div>
                            {/* Progress Bar for Viz */}
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500" style={{ width: `${Math.min((data.pressure / 100) * 100, 100)}%` }} />
                            </div>

                            <div className="flex justify-between items-center text-xs mt-1">
                                <span className="text-slate-400">Temp</span>
                                <span className="font-mono text-pink-300 font-bold">{data.temperature?.toFixed(1)} °C</span>
                            </div>

                            <div className="flex justify-between items-center text-xs mt-1">
                                <span className="text-slate-400">Flow</span>
                                <span className="font-mono text-cyan-300 font-bold">{data.flowrate?.toFixed(1)} m³/h</span>
                            </div>
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
};

// Helper to normalize data for 3D space
const useNormalizedData = (data) => {
    return useMemo(() => {
        if (!data || data.length === 0) return [];
        const validData = data.filter(d =>
            typeof d.flowrate === 'number' && typeof d.pressure === 'number' && typeof d.temperature === 'number'
        );
        if (validData.length === 0) return [];

        const flows = validData.map(d => d.flowrate);
        const temps = validData.map(d => d.temperature);
        const presses = validData.map(d => d.pressure);

        const minFlow = Math.min(...flows); const maxFlow = Math.max(...flows);
        const minTemp = Math.min(...temps); const maxTemp = Math.max(...temps);
        const minPress = Math.min(...presses); const maxPress = Math.max(...presses);

        const rangeFlow = maxFlow - minFlow || 1;
        const rangeTemp = maxTemp - minTemp || 1;
        const rangePress = maxPress - minPress || 1;

        return validData.map(d => {
            const x = ((d.pressure - minPress) / rangePress) * 10 - 5;
            const y = ((d.temperature - minTemp) / rangeTemp) * 10 - 5;
            const z = ((d.flowrate - minFlow) / rangeFlow) * 10 - 5;
            const size = 0.3 + ((d.flowrate - minFlow) / rangeFlow) * 0.4;
            return { ...d, position: [x, y, z], size };
        });
    }, [data]);
};

export default function DataVis3D({ data, comparisonData }) {
    if (!data || data.length === 0) return null;

    const normalizedData = useNormalizedData(data);
    const normalizedCompareData = useNormalizedData(comparisonData);

    return (
        <div className="w-full h-[600px] rounded-2xl overflow-hidden relative bg-[#0a0a0f] border border-white/10 shadow-2xl">
            {/* Header Overlay */}
            <div className="absolute top-5 left-5 z-10 pointer-events-none select-none">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    <h3 className="text-lg font-display font-bold text-white tracking-wide">
                        3D Parameter Space
                    </h3>
                </div>
                <p className="text-xs text-slate-400 font-['JetBrains_Mono'] max-w-[200px]">
                    Interactive visualization of operating conditions in real-time.
                </p>
            </div>

            {/* Legend Overlay */}
            <div className="absolute bottom-5 left-5 z-10 pointer-events-none bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/5">
                <div className="flex flex-col gap-2">
                    {comparisonData ? (
                        <>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                <span className="text-[10px] text-slate-300 font-mono">CURRENT DATASET</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <span className="text-[10px] text-slate-300 font-mono">BASELINE (OLD)</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                <span className="text-[10px] text-slate-300 font-mono">NORMAL</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                <span className="text-[10px] text-slate-300 font-mono">WARNING</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                                <span className="text-[10px] text-slate-300 font-mono">CRITICAL</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Controls Hint */}
            <div className="absolute top-5 right-5 z-10 pointer-events-none text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
                    <span className="text-[10px] text-slate-400 font-mono">DRAG TO ROTATE • SCROLL TO ZOOM</span>
                </div>
            </div>

            <Canvas camera={{ position: [14, 10, 14], fov: 45 }}>
                <color attach="background" args={['#050508']} />

                {/* Environment */}
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Sparkles count={100} scale={12} size={2} speed={0.4} opacity={0.5} color="#8b5cf6" />

                <ambientLight intensity={0.5} />
                <pointLight position={[20, 20, 20]} intensity={3} color="#ffffff" distance={50} />
                <pointLight position={[-10, -10, -10]} intensity={2} color="#a78bfa" distance={50} />

                <OrbitControls
                    enableZoom={true}
                    autoRotate={!comparisonData} // Stop rotate on compare to make it easier to see
                    autoRotateSpeed={0.8}
                    enablePan={false}
                    minDistance={5}
                    maxDistance={30}
                    maxPolarAngle={Math.PI / 1.5}
                />

                <CustomAxes />

                <group>
                    {/* Comparison Baseline (RED) */}
                    {comparisonData && normalizedCompareData.map((item, index) => (
                        <DataPoint
                            key={`old-${index}`}
                            position={item.position}
                            status={item.status || 'Normal'}
                            data={item}
                            size={item.size}
                            fixedColor="#f87171"
                        />
                    ))}

                    {/* Current Dataset (Green or Normal) */}
                    {normalizedData.map((item, index) => (
                        <DataPoint
                            key={`new-${index}`}
                            position={item.position}
                            status={item.status || 'Normal'}
                            data={item}
                            size={item.size}
                            fixedColor={comparisonData ? '#4ade80' : null}
                        />
                    ))}
                </group>

                {/* Volumetric Fog Effect */}
                <fog attach="fog" args={['#050508', 10, 50]} />
            </Canvas>
        </div>
    );
}
