import { useState, useEffect } from 'react';
import { datasetAPI } from '../utils/api';
import gsap from 'gsap';
import { useGSAP } from '../hooks/useGSAP';
import UploadCSV from '../components/UploadCSV';
import Charts from '../components/Charts';
import DataTable from '../components/DataTable';
import HistoryPanel from '../components/HistoryPanel';
import Navbar from '../components/layout/Navbar';
import Scene from '../components/canvas/Scene';

export default function Dashboard() {
    const [statistics, setStatistics] = useState(null);
    const [equipmentData, setEquipmentData] = useState([]);
    const [history, setHistory] = useState([]);
    const [datasetId, setDatasetId] = useState(null);

    // Cinematic Entrance
    const container = useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

        tl.from('.dash-nav', { y: -50, opacity: 0, duration: 1 })
            .from('.stat-tile', {
                scale: 0.8,
                opacity: 0,
                y: 20,
                stagger: 0.1,
                duration: 1.2
            }, '-=0.5')
            .from('.main-panel', {
                y: 50,
                opacity: 0,
                duration: 1
            }, '-=0.8');
    });

    useEffect(() => { loadData(); }, []);

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
        } catch (err) { console.error(err); }
    };

    return (
        <div ref={container} className="relative min-h-screen text-white">
            <Scene />
            <Navbar className="dash-nav" />

            <div className="page-container" style={{ paddingTop: '100px', maxWidth: '1600px' }}>

                {/* HEAD UP DISPLAY (HUD) */}
                <div className="flex justify-between items-end mb-10 dash-nav border-b border-white/10 pb-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <h1 className="text-3xl font-bold tracking-tight">MISSION CONTROL</h1>
                        </div>
                        <p className="text-gray-400 font-mono text-sm mt-1">
                            SECURE TERMINAL // {datasetId ? `DATASET: ${datasetId}` : 'NO DATALINK'}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        {statistics && (
                            <button
                                onClick={() => datasetAPI.downloadPDF(datasetId)}
                                className="px-6 py-2 border border-white/20 hover:bg-white/10 rounded transition-colors text-sm font-mono tracking-wide"
                            >
                                DOWNLOAD_REPORT.PDF
                            </button>
                        )}
                        <UploadCSV onUploadSuccess={loadData} />
                    </div>
                </div>

                {/* TELEMETRY STRIP */}
                {statistics && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <StatTile label="ACTIVE UNITS" value={statistics.total_equipment} unit="NODES" delay={0} />
                        <StatTile label="AVG PRESSURE" value={statistics.avg_pressure.toFixed(1)} unit="BAR" delay={0.1} color="#60A5FA" />
                        <StatTile label="AVG FLOWRATE" value={statistics.avg_flowrate.toFixed(1)} unit="M³/H" delay={0.2} color="#34D399" />
                        <StatTile label="AVG TEMP" value={statistics.avg_temperature.toFixed(1)} unit="CELSIUS" delay={0.3} color="#F87171" />
                    </div>
                )}

                {/* MAIN CONSOLE GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-350px)] min-h-[600px]">

                    {/* LEFT: LOGS */}
                    <div className="lg:col-span-3 h-full main-panel">
                        <div className="h-full bg-[#0B0F15]/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-white/10 bg-white/5 font-mono text-xs text-gray-400">
                                SYSTEM LOGS
                            </div>
                            <div className="flex-1 overflow-auto p-2">
                                <HistoryPanel
                                    history={history}
                                    currentDatasetId={datasetId}
                                    onSelectDataset={() => { }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* CENTER: VISUALIZATION */}
                    <div className="lg:col-span-9 flex flex-col gap-6 main-panel h-full">
                        {/* CHART ARRAY */}
                        <div className="flex-1 bg-[#0B0F15]/80 backdrop-blur-md border border-white/10 rounded-xl p-6 relative group">
                            <div className="absolute top-4 right-4 flex gap-2">
                                <span className="text-[10px] font-mono border border-white/20 px-2 py-0.5 rounded text-gray-500">LIVE RENDER</span>
                            </div>
                            <Charts statistics={statistics} equipmentData={equipmentData} />
                        </div>

                        {/* DATA STREAM */}
                        <div className="h-1/3 bg-[#0B0F15]/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden flex flex-col">
                            <div className="p-3 border-b border-white/10 bg-white/5 flex justify-between items-center px-6">
                                <span className="font-mono text-xs text-gray-400">INCOMING STREAM</span>
                                <span className="font-mono text-xs text-accent">{equipmentData.length} RECORDS PARSED</span>
                            </div>
                            <div className="flex-1 overflow-auto">
                                <DataTable data={equipmentData} />
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

function StatTile({ label, value, unit, delay, color = 'white' }) {
    return (
        <div className="stat-tile bg-[#0B0F15]/60 backdrop-blur-sm border border-white/10 p-6 rounded-xl relative overflow-hidden group hover:border-white/30 transition-colors">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-full -mr-10 -mt-10" />
            <div className="font-mono text-xs text-gray-500 mb-2 tracking-widest">{label}</div>
            <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold font-mono tracking-tighter" style={{ color }}>{value}</span>
                <span className="text-xs font-mono text-gray-600">{unit}</span>
            </div>
        </div>
    );
}
