import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, datasetAPI } from '../utils/api';
import gsap from 'gsap';
import UploadCSV from '../components/UploadCSV';
import Charts from '../components/Charts';
import DataTable from '../components/DataTable';
import HistoryPanel from '../components/HistoryPanel';
import Navbar from '../components/layout/Navbar';

export default function Dashboard() {
    const navigate = useNavigate();
    const [statistics, setStatistics] = useState(null);
    const [equipmentData, setEquipmentData] = useState([]);
    const [history, setHistory] = useState([]);
    const [currentDatasetId, setCurrentDatasetId] = useState(null);
    const [loading, setLoading] = useState(true);

    const dashboardRef = useRef(null);

    useEffect(() => {
        loadHistory();
        loadLatestData();
    }, []);

    useEffect(() => {
        if (statistics) {
            const ctx = gsap.context(() => {
                gsap.from('.dash-item', {
                    y: 20,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.05,
                    ease: 'power2.out'
                });

                gsap.from('.metric-val', {
                    textContent: 0,
                    duration: 1.5,
                    ease: 'power2.out',
                    snap: { textContent: 1 },
                    stagger: 0.1
                });
            }, dashboardRef);
            return () => ctx.revert();
        }
    }, [statistics]);

    const loadHistory = async () => {
        try {
            const result = await datasetAPI.getHistory();
            setHistory(result.datasets || []);
        } catch (err) {
            console.error('Failed to load history:', err);
        }
    };

    const loadLatestData = async () => {
        setLoading(true);
        try {
            const result = await datasetAPI.getSummary();
            setStatistics(result);
            setEquipmentData(result.equipment_data || []);
            setCurrentDatasetId(result.dataset_info?.id);
        } catch (err) {
            console.error('Failed to load data:', err);
            // Quiet fail for empty state
        } finally {
            setLoading(false);
        }
    };

    const handleUploadSuccess = async () => {
        await loadHistory();
        await loadLatestData();
    };

    const handleSelectDataset = async (datasetId) => {
        setLoading(true);
        try {
            const result = await datasetAPI.getSummary(datasetId);
            setStatistics(result);
            setEquipmentData(result.equipment_data || []);
            setCurrentDatasetId(datasetId);
        } catch (err) {
            console.error('Failed to load dataset:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!currentDatasetId) return;
        try {
            await datasetAPI.downloadPDF(currentDatasetId);
        } catch (err) {
            alert('Failed to download PDF');
        }
    };

    return (
        <div className="bg-app min-h-screen text-primary" ref={dashboardRef}>
            <Navbar />

            <main className="container" style={{ paddingTop: 'calc(var(--header-height) + 2rem)', paddingBottom: '4rem' }}>

                {/* HEADER AREA */}
                <div className="flex justify-between items-end mb-8 dash-item">
                    <div>
                        <div className="text-label mb-2">WORKSPACE / ANALYTICS</div>
                        <h1 style={{ fontSize: '2rem' }}>Dashboard Console</h1>
                    </div>
                    <div className="flex gap-4">
                        {statistics && (
                            <button className="btn-tech btn-secondary" onClick={handleDownloadPDF}>
                                Export Report.pdf
                            </button>
                        )}
                        <UploadCSV onUploadSuccess={handleUploadSuccess} />
                    </div>
                </div>

                {/* METRICS GRID */}
                {statistics && (
                    <div className="grid-cols-4 gap-4 mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                        {[
                            { label: 'Total Equipment', val: statistics.total_equipment, unit: 'UNITS' },
                            { label: 'Avg Flowrate', val: statistics.avg_flowrate.toFixed(2), unit: 'M³/H' },
                            { label: 'Avg Pressure', val: statistics.avg_pressure.toFixed(2), unit: 'BAR' },
                            { label: 'Avg Temp', val: statistics.avg_temperature.toFixed(2), unit: '°C' }
                        ].map((stat, i) => (
                            <div key={i} className="surface-card dash-item" style={{ padding: '1.5rem' }}>
                                <div className="text-label mb-2">{stat.label}</div>
                                <div className="flex items-end gap-2">
                                    <div className="text-mono metric-val" style={{ fontSize: '1.75rem', lineHeight: 1 }}>{stat.val}</div>
                                    <div className="text-label text-secondary" style={{ marginBottom: '4px' }}>{stat.unit}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* MAIN CONTENT SPLIT */}
                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>

                    {/* LEFT SIDEBAR (HISTORY) */}
                    <div className="dash-item">
                        <HistoryPanel
                            history={history}
                            currentDatasetId={currentDatasetId}
                            onSelectDataset={handleSelectDataset}
                        />
                    </div>

                    {/* RIGHT CONTENT (CHARTS & TABLE) */}
                    <div className="flex flex-col gap-8 dash-item">
                        {loading ? (
                            <div className="surface-card flex items-center justify-center" style={{ height: '400px' }}>
                                <div className="text-mono">LOADING_DATA_STREAM...</div>
                            </div>
                        ) : (
                            <>
                                <div className="surface-card p-6" style={{ padding: '1.5rem' }}>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 style={{ fontSize: '1.25rem' }}>Parameter Visualizers</h3>
                                        <div className="text-label">Real-time Render</div>
                                    </div>
                                    <Charts statistics={statistics} equipmentData={equipmentData} />
                                </div>

                                <div className="surface-card p-6" style={{ padding: '1.5rem' }}>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 style={{ fontSize: '1.25rem' }}>Raw Data Matrix</h3>
                                        <div className="text-label">{equipmentData.length} RECORDS</div>
                                    </div>
                                    <DataTable data={equipmentData} />
                                </div>
                            </>
                        )}
                    </div>

                </div>

            </main>
        </div>
    );
}
