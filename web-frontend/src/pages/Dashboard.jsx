import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { datasetAPI, authAPI } from '../utils/api';
import gsap from 'gsap';
import {
    Activity,
    Wind,
    Droplets,
    Thermometer,
    Download,
    Box,
    BarChart3,
    Layers,
    Zap,
    GitCompare,
    History,
    ArrowUpRight,
    ArrowDownRight,
    XCircle,
    Database,
    AlertTriangle,
    User
} from 'lucide-react';
import Scene from '../components/canvas/Scene';
import FloatingNav from '../components/layout/FloatingNav';
import UploadCSV from '../components/UploadCSV';
import Charts from '../components/Charts';
import DataTable from '../components/DataTable';
import DataVis3D from '../components/canvas/DataVis3D';
import SentinelChat from '../components/SentinelChat';
import HistoryTimeline from '../components/HistoryTimeline';
import WarningNodes from '../components/WarningNodes';
import ProfileModal from '../components/ProfileModal';

export default function Dashboard() {
    const navigate = useNavigate();
    const [statistics, setStatistics] = useState(null);
    const [equipmentData, setEquipmentData] = useState([]);
    const [history, setHistory] = useState([]);
    const [datasetId, setDatasetId] = useState(null);
    const [viewMode, setViewMode] = useState('3d');

    const [comparisonStats, setComparisonStats] = useState(null);
    const [comparisonData, setComparisonData] = useState(null);
    const [showCompareDropdown, setShowCompareDropdown] = useState(false);
    const [showHistoryPanel, setShowHistoryPanel] = useState(false);
    const [showWarningsPanel, setShowWarningsPanel] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Live Telemetry Simulation - REMOVED

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

            // Fetch real user profile
            try {
                const profileRes = await authAPI.getProfile();
                if (profileRes.user) {
                    setCurrentUser(profileRes.user);
                    // Update localStorage for fallback
                    localStorage.setItem('username', profileRes.user.username);
                    if (profileRes.user.email) localStorage.setItem('email', profileRes.user.email);
                }
            } catch (e) {
                console.warn('Failed to fetch profile:', e);
                // Fallback to local storage
                const username = localStorage.getItem('username') || 'User';
                const email = localStorage.getItem('email') || '';
                setCurrentUser({ username, email });
            }
        } catch (err) {
            console.error('Error loading data:', err);
            if (err.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    const handleDatasetDeleted = (deletedId) => {
        //Remove from history
        setHistory(prev => prev.filter(item => (item.id || item.dataset_id) !== deletedId));

        // If deleted dataset is currently active, clear it
        if (datasetId === deletedId) {
            setStatistics(null);
            setEquipmentData([]);
            setDatasetId(null);
            clearComparison();
        }

        // If deleted dataset is comparison, clear it
        if (comparisonStats?.id === deletedId) {
            clearComparison();
        }
    };

    const handleCompare = async (targetId) => {
        if (targetId === datasetId) {
            clearComparison();
            setShowCompareDropdown(false);
            return;
        }

        try {
            // Fetch REAL data for the target dataset
            const targetData = await datasetAPI.getSummary(targetId);

            if (targetData) {
                setComparisonStats({
                    id: targetId,
                    avg_pressure: targetData.avg_pressure,
                    avg_temperature: targetData.avg_temperature,
                    avg_flowrate: targetData.avg_flowrate,
                    total_equipment: targetData.total_equipment
                });
                setComparisonData(targetData.equipment_data || []);
            }
        } catch (error) {
            console.error("Failed to fetch comparison data:", error);
        }
        setShowCompareDropdown(false);
    };

    const clearComparison = () => {
        setComparisonStats(null);
        setComparisonData(null);
    };

    const handleSignOut = () => {
        authAPI.logout();
        navigate('/');
    };

    return (
        <div className="relative min-h-screen overflow-x-hidden" ref={dashRef}>
            <DashboardStyles />
            <Scene />
            <FloatingNav onProfileClick={() => setShowProfileModal(true)} />

            {/* AI Assistant Layer */}
            {statistics && <SentinelChat equipmentData={equipmentData} />}

            <div className="relative z-10 max-w-[1600px] mx-auto px-6 pt-24 pb-16">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 pb-8 border-b border-white/10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`w-3 h-3 rounded-full ${comparisonStats ? 'bg-amber-400' : 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]'}`} />
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
                                Mission Control
                            </h1>
                        </div>
                        <p className="text-slate-400 font-['JetBrains_Mono'] text-sm flex items-center gap-2">
                            {datasetId ? `DATASET: ${datasetId}` : 'NO DATA LOADED'}
                            <span className="text-slate-600">•</span>
                            {comparisonStats ? (
                                <span className="text-amber-400 font-bold flex items-center gap-2">
                                    COMPARING VS {comparisonStats.id}
                                    <button onClick={clearComparison} className="hover:text-white"><XCircle className="w-4 h-4" /></button>
                                </span>
                            ) : 'SECURE CONNECTION'}
                        </p>
                    </div>

                    <div className="flex gap-3 mt-4 lg:mt-0 items-center relative">
                        {/* Compare Dataset Dropdown */}
                        {statistics && (
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setShowCompareDropdown(!showCompareDropdown);
                                        setShowHistoryPanel(false);
                                        setShowWarningsPanel(false);
                                    }}
                                    className={`group relative px-4 py-2.5 rounded-full border transition-all duration-300 backdrop-blur-md flex items-center gap-2 overflow-hidden ${showCompareDropdown || comparisonStats
                                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-400'
                                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                                    {comparisonStats ? <GitCompare className="w-4 h-4" /> : <History className="w-4 h-4" />}
                                    <span className="font-medium text-sm">{comparisonStats ? 'Comparison Active' : 'Compare Dataset'}</span>
                                </button>

                                {showCompareDropdown && (
                                    <div className="absolute top-12 right-0 w-64 glass-panel border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                                        <div className="p-3 border-b border-white/10 bg-black/40 text-xs font-bold text-slate-400">
                                            SELECT BASELINE FOR COMPARISON
                                        </div>
                                        <div className="max-h-60 overflow-y-auto">
                                            {history.map((h, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleCompare(h.id || h.dataset_id || h.filename || `Dataset ${i + 1}`)}
                                                    className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors border-b border-white/5 last:border-0"
                                                >
                                                    <div className="font-mono text-xs text-slate-500">{h.upload_timestamp?.split('T')[0]}</div>
                                                    <div className="truncate">{h.filename || `Dataset ${i + 1}`}</div>
                                                </button>
                                            ))}
                                            {history.length === 0 && (
                                                <div className="p-4 text-center text-xs text-slate-500">No history available</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mission Log (History) Dropdown */}
                        {statistics && (
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setShowHistoryPanel(!showHistoryPanel);
                                        setShowCompareDropdown(false);
                                        setShowWarningsPanel(false);
                                    }}
                                    className={`group relative px-4 py-2.5 rounded-full border transition-all duration-300 backdrop-blur-md flex items-center gap-2 overflow-hidden ${showHistoryPanel
                                        ? 'bg-purple-500/10 border-purple-500/50 text-purple-400'
                                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                                    <Database className="w-4 h-4" />
                                    <span className="font-medium text-sm">Mission Log</span>
                                    {history.length > 0 && (
                                        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                                            {history.length}
                                        </span>
                                    )}
                                </button>

                                {showHistoryPanel && (
                                    <div className="absolute top-12 right-0 w-96 glass-panel border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                                        <HistoryTimeline
                                            history={history}
                                            currentDatasetId={datasetId}
                                            onSelectDataset={(id) => {
                                                datasetAPI.getSummary(id).then(data => {
                                                    setStatistics(data);
                                                    setEquipmentData(data.equipment_data || []);
                                                    setDatasetId(id);
                                                    clearComparison();
                                                    setShowHistoryPanel(false);
                                                });
                                            }}
                                            onDatasetDeleted={handleDatasetDeleted}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Anomaly Warnings Dropdown */}
                        {statistics && equipmentData.length > 0 && (
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setShowWarningsPanel(!showWarningsPanel);
                                        setShowCompareDropdown(false);
                                        setShowHistoryPanel(false);
                                    }}
                                    className={`group relative px-4 py-2.5 rounded-full border transition-all duration-300 backdrop-blur-md flex items-center gap-2 overflow-hidden ${showWarningsPanel
                                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-400'
                                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                                    <AlertTriangle className="w-4 h-4" />
                                    <span className="font-medium text-sm">Anomalies</span>
                                </button>

                                {showWarningsPanel && (
                                    <div className="absolute top-12 right-0 w-[32rem] glass-panel border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                                        <WarningNodes equipmentData={equipmentData} />
                                    </div>
                                )}
                            </div>
                        )}

                        {statistics && (
                            <button
                                onClick={() => datasetAPI.downloadPDF(datasetId)}
                                className="group relative px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-md flex items-center gap-2 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                                <Download className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                <span className="font-medium text-sm">Export Report</span>
                            </button>
                        )}
                        <UploadCSV onUploadSuccess={loadData} />

                        {/* Profile Button Removed - Moved to FloatingNav */}
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
                            icon={<Box className="w-6 h-6" />}
                            comparison={comparisonStats ? statistics.total_equipment - comparisonStats.total_equipment : null}
                        />
                        <MetricCard
                            label="Avg Pressure"
                            value={statistics.avg_pressure.toFixed(1)}
                            unit="bar"
                            color="#22d3ee"
                            icon={<Zap className="w-6 h-6" />}
                            comparison={comparisonStats ? statistics.avg_pressure - comparisonStats.avg_pressure : null}
                        />
                        <MetricCard
                            label="Avg Flowrate"
                            value={statistics.avg_flowrate.toFixed(1)}
                            unit="m³/h"
                            color="#34d399"
                            icon={<Droplets className="w-6 h-6" />}
                            comparison={comparisonStats ? statistics.avg_flowrate - comparisonStats.avg_flowrate : null}
                        />
                        <MetricCard
                            label="Avg Temp"
                            value={statistics.avg_temperature.toFixed(1)}
                            unit="°C"
                            color="#f472b6"
                            icon={<Thermometer className="w-6 h-6" />}
                            comparison={comparisonStats ? statistics.avg_temperature - comparisonStats.avg_temperature : null}
                        />
                    </div>
                )}

                {/* Main Content */}
                <div className="main-content space-y-6">
                    {/* Visualization */}
                    <div className="glass-panel rounded-2xl p-6 border border-white/10">
                        {/* Tabs */}
                        {/* Tabs - Cylindrical Toggle Switch */}
                        <div className="relative flex w-full mb-8 p-1.5 bg-[#0a0c10] rounded-full border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                            {/* Sliding Cylindrical Activator */}
                            <div
                                className={`absolute top-1.5 bottom-1.5 rounded-full shadow-lg transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-0
                                    ${viewMode === '3d'
                                        ? 'left-1.5 w-[calc(50%-0.375rem)] bg-gradient-to-r from-purple-600 to-indigo-600 shadow-purple-500/25'
                                        : 'left-[50%] w-[calc(50%-0.375rem)] bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/25'
                                    }`}
                            >
                                {/* Cylindrical Gloss/Shine */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
                                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent rounded-full" />
                            </div>

                            {/* 3D View Button */}
                            <button
                                onClick={() => setViewMode('3d')}
                                className={`flex-1 py-3 rounded-full text-sm font-bold transition-colors duration-300 relative z-10 flex items-center justify-center gap-2 ${viewMode === '3d' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                <Layers className={`w-4 h-4 transition-transform duration-500 ${viewMode === '3d' ? 'scale-110 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]' : 'scale-100'}`} />
                                <span className={viewMode === '3d' ? 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]' : ''}>3D View</span>
                            </button>

                            {/* Analytics Button */}
                            <button
                                onClick={() => setViewMode('charts')}
                                className={`flex-1 py-3 rounded-full text-sm font-bold transition-colors duration-300 relative z-10 flex items-center justify-center gap-2 ${viewMode === 'charts' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                <BarChart3 className={`w-4 h-4 transition-transform duration-500 ${viewMode === 'charts' ? 'scale-110 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]' : 'scale-100'}`} />
                                <span className={viewMode === 'charts' ? 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]' : ''}>Analytics</span>
                            </button>
                        </div>

                        {/* Visualization Area */}
                        <div className="min-h-[500px]">
                            {statistics && viewMode === '3d' && (
                                <DataVis3D data={equipmentData} comparisonData={comparisonData} />
                            )}
                            {statistics && viewMode === 'charts' && (
                                <Charts statistics={statistics} equipmentData={equipmentData} />
                            )}
                            {!statistics && (
                                <div className="h-[500px] flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-white/5 mb-4">
                                            <BarChart3 className="w-10 h-10 text-slate-500" />
                                        </div>
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
                                <h3 className="font-display font-bold text-xl text-white">
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

            {/* Profile Modal */}
            <ProfileModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                currentUser={currentUser}
            />
        </div>
    );
}

const DashboardStyles = () => (
    <style>{`
        @keyframes emoji-rise {
            0% { transform: translateY(100%) scale(0.5); opacity: 0; }
            10% { opacity: 1; transform: translateY(0) scale(1); }
            100% { transform: translateY(-200%) scale(1.2); opacity: 0; }
        }
    `}</style>
);

function MetricCard({ label, value, unit, color, icon, comparison }) {
    // Memoize particles and styles to optimize rendering and avoid jitter
    const { particles, gradientClass, shadowClass } = useMemo(() => {
        let emoji = '';
        let grad = '';
        let shadow = '';
        let spin = false;

        if (label.includes('Temp')) {
            emoji = '🔥';
            grad = 'bg-gradient-to-t from-orange-600/30 via-red-600/5 to-transparent';
            shadow = 'group-hover:shadow-[0_0_40px_rgba(234,88,12,0.3)] group-hover:border-orange-500/50';
        } else if (label.includes('Flow')) {
            emoji = '💧';
            grad = 'bg-gradient-to-t from-cyan-600/30 via-blue-600/5 to-transparent';
            shadow = 'group-hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] group-hover:border-cyan-500/50';
        } else if (label.includes('Press')) {
            emoji = '⚡';
            grad = 'bg-gradient-to-br from-yellow-500/20 via-yellow-600/5 to-transparent';
            shadow = 'group-hover:shadow-[0_0_40px_rgba(234,179,8,0.3)] group-hover:border-yellow-500/50';
        } else {
            emoji = '⚙️';
            grad = 'bg-gradient-to-br from-indigo-500/20 via-purple-500/5 to-transparent';
            shadow = 'group-hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] group-hover:border-indigo-500/50';
            spin = true;
        }

        const generatedParticles = Array.from({ length: 25 }).map((_, i) => (
            <div
                key={i}
                className="absolute opacity-0 group-hover:[animation-name:emoji-rise] select-none pointer-events-none"
                style={{
                    left: `${Math.random() * 90 + 5}%`,
                    bottom: '-20px', // Start position
                    fontSize: `${Math.random() * 1.5 + 1}rem`,
                    // Split Animation Properties (Name handled by class on hover)
                    animationDuration: `${1500 + Math.random() * 2000}ms`,
                    animationDelay: `${Math.random() * 1500}ms`, // Delays for staggered start
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                    // Filter
                    filter: `blur(${Math.random() * 0.5}px)`
                }}
            >
                <div className={spin ? 'animate-spin' : ''} style={{ animationDuration: '3s' }}>
                    {emoji}
                </div>
            </div>
        ));

        return { particles: generatedParticles, gradientClass: grad, shadowClass: shadow };
    }, [label]);

    return (
        <div className={`metric-card glass-panel p-6 rounded-xl border border-white/10 group transition-all duration-500 cursor-default relative overflow-hidden ${shadowClass}`}>

            {/* Visual Effects Layer */}
            <div className={`absolute inset-0 ${gradientClass} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            {/* Particle Cloud */}
            {particles}

            {/* Comparison Badge */}
            {comparison !== null && comparison !== undefined && (
                <div className={`absolute top-0 right-0 p-3 ${comparison > 0 ? 'text-emerald-400' : 'text-rose-400'} flex items-center gap-1 text-xs font-bold font-mono bg-white/5 rounded-bl-xl z-20 backdrop-blur-sm`}>
                    {comparison > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(comparison).toFixed(1)} {unit}
                </div>
            )}

            {/* Content Layer */}
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                    <span className="text-white/80 transition-transform group-hover:scale-110 duration-300">{icon}</span>
                    <div
                        className="px-2 py-1 rounded-lg text-[10px] font-['JetBrains_Mono'] font-bold uppercase backdrop-blur-md"
                        style={{
                            backgroundColor: `${color}20`,
                            color: color
                        }}
                    >
                        {unit}
                    </div>
                </div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono group-hover:text-white transition-colors">
                    {label}
                </div>
                <div
                    className="text-5xl font-bold font-mono group-hover:scale-105 transition-transform origin-left tracking-tighter"
                    style={{
                        color: color,
                        textShadow: `0 0 30px ${color}40`
                    }}
                >
                    {value}
                </div>
                {comparison !== null && comparison !== undefined && (
                    <div className="mt-2 text-[10px] text-slate-500 font-mono">
                        vs previous run
                    </div>
                )}
            </div>
        </div >
    );
}
