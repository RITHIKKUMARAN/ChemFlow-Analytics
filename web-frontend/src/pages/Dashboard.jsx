import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { datasetAPI, authAPI } from '../utils/api';
import gsap from 'gsap';
import Scene from '../components/canvas/Scene';
import FloatingNav from '../components/layout/FloatingNav';
import UploadCSV from '../components/UploadCSV';
import Charts from '../components/Charts';
import DataTable from '../components/DataTable';
import DataVis3D from '../components/canvas/DataVis3D';

export default function Dashboard() {
    const navigate = useNavigate();
    const [statistics, setStatistics] = useState(null);
    const [equipmentData, setEquipmentData] = useState([]);
    const [history, setHistory] = useState([]);
    const [datasetId, setDatasetId] = useState(null);
    const [viewMode, setViewMode] = useState('3d');

    const dashRef = useRef();

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        let ctx;
        if (dashRef.current && statistics) {
            ctx = gsap.context(() => {
                gsap.fromTo('.metric-card',
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        stagger: 0.1,
                        duration: 0.8,
                        ease: 'power3.out',
                        clearProps: 'transform'
                    }
                );

                gsap.fromTo('.main-content',
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: 'power3.out',
                        delay: 0.3
                    }
                );
            }, dashRef);
        }
        return () => ctx && ctx.revert();
    }, [statistics]);

    const loadData = async () => {
        try {
            const [histRes, statRes] = await Promise.all([
                datasetAPI.getHistory(),
                datasetAPI.getSummary()
            ]);
            setHistory(histRes.datasets || []);
            setStatistics(statRes || null);
            setEquipmentData(statRes.equipment_data || []);
            setDatasetId(statRes.dataset_info?.id);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSignOut = () => {
        authAPI.logout();
        navigate('/');
    };

    return (
        <div className="relative min-h-screen overflow-x-hidden" ref={dashRef}>
            <Scene />
            <FloatingNav />

            <div className="relative z-10 max-w-[1600px] mx-auto px-6 pt-24 pb-16">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 pb-8 border-b border-white/10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-glow shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                            <h1 className="text-4xl font-['Space_Grotesk'] font-bold text-white">
                                Mission Control
                            </h1>
                        </div>
                        <p className="text-slate-400 font-['JetBrains_Mono'] text-sm">
                            {datasetId ? `DATASET: ${datasetId}` : 'NO DATA LOADED'} • SECURE CONNECTION
                        </p>
                    </div>

                    <div className="flex gap-3 mt-4 lg:mt-0 items-center">
                        <button
                            onClick={handleSignOut}
                            className="glass-panel px-5 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:text-red-200 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/30 transition-all flex items-center gap-2"
                        >
                            <span>🚪</span>
                            <span className="hidden sm:inline">Sign Out</span>
                        </button>

                        {statistics && (
                            <button
                                onClick={() => datasetAPI.downloadPDF(datasetId)}
                                className="glass-panel px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:border-purple-500/50 transition-all"
                            >
                                📥 Export PDF
                            </button>
                        )}
                        <UploadCSV onUploadSuccess={loadData} />
                    </div>
                </div>

                {/* Metrics */}
                {statistics && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                        <MetricCard
                            label="Active Units"
                            value={statistics.total_equipment}
                            unit="nodes"
                            color="#a78bfa"
                            icon="🎯"
                        />
                        <MetricCard
                            label="Avg Pressure"
                            value={statistics.avg_pressure.toFixed(1)}
                            unit="bar"
                            color="#22d3ee"
                            icon="⚡"
                        />
                        <MetricCard
                            label="Avg Flowrate"
                            value={statistics.avg_flowrate.toFixed(1)}
                            unit="m³/h"
                            color="#34d399"
                            icon="💧"
                        />
                        <MetricCard
                            label="Avg Temp"
                            value={statistics.avg_temperature.toFixed(1)}
                            unit="°C"
                            color="#f472b6"
                            icon="🔥"
                        />
                    </div>
                )}

                {/* Main Content */}
                <div className="main-content space-y-6">
                    {/* Visualization */}
                    <div className="glass-panel rounded-2xl p-6 border border-white/10">
                        {/* Tabs */}
                        <div className="flex gap-2 mb-6">
                            <button
                                onClick={() => setViewMode('3d')}
                                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${viewMode === '3d'
                                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                🌌 3D View
                            </button>
                            <button
                                onClick={() => setViewMode('charts')}
                                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'charts'
                                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                📊 Analytics
                            </button>
                        </div>

                        {/* Visualization Area */}
                        <div className="min-h-[500px]">
                            {statistics && viewMode === '3d' && (
                                <DataVis3D data={equipmentData} />
                            )}
                            {statistics && viewMode === 'charts' && (
                                <Charts statistics={statistics} equipmentData={equipmentData} />
                            )}
                            {!statistics && (
                                <div className="h-[500px] flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-6xl mb-4">📊</div>
                                        <p className="text-slate-400 font-medium">
                                            Upload a dataset to begin analysis
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Data Table */}
                    {equipmentData.length > 0 && (
                        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
                            <div className="p-5 border-b border-white/10 flex justify-between items-center">
                                <h3 className="font-['Space_Grotesk'] font-bold text-lg text-white">
                                    Equipment Data Stream
                                </h3>
                                <span className="text-xs font-['JetBrains_Mono'] text-cyan-400">
                                    {equipmentData.length} RECORDS
                                </span>
                            </div>
                            <DataTable data={equipmentData} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, unit, color, icon }) {
    return (
        <div className="metric-card glass-panel p-6 rounded-xl border border-white/10 group hover:border-white/20 transition-all cursor-default">
            <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{icon}</span>
                <div
                    className="px-2 py-1 rounded-lg text-[10px] font-['JetBrains_Mono'] font-bold uppercase"
                    style={{
                        backgroundColor: `${color}20`,
                        color: color
                    }}
                >
                    {unit}
                </div>
            </div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 font-['JetBrains_Mono']">
                {label}
            </div>
            <div
                className="text-4xl font-bold font-['JetBrains_Mono'] group-hover:scale-105 transition-transform origin-left"
                style={{
                    color: color,
                    textShadow: `0 0 20px ${color}60`
                }}
            >
                {value}
            </div>
        </div>
    );
}
