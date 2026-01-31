/**
 * Main Dashboard Page
 * Integrates all components with GSAP animations
 */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, datasetAPI } from '../utils/api';
import gsap from 'gsap';
import UploadCSV from '../components/UploadCSV';
import Charts from '../components/Charts';
import DataTable from '../components/DataTable';
import HistoryPanel from '../components/HistoryPanel';

function Dashboard() {
    const navigate = useNavigate();
    const [statistics, setStatistics] = useState(null);
    const [equipmentData, setEquipmentData] = useState([]);
    const [history, setHistory] = useState([]);
    const [currentDatasetId, setCurrentDatasetId] = useState(null);
    const [loading, setLoading] = useState(true);
    const statsRef = useRef(null);

    useEffect(() => {
        loadHistory();
        loadLatestData();
    }, []);

    useEffect(() => {
        if (statistics) {
            // Animate statistics cards
            gsap.from('.stat-card', {
                opacity: 0,
                y: 30,
                duration: 0.6,
                stagger: 0.15,
                ease: 'back.out(1.7)',
            });

            // Count-up animation for numbers
            const statElements = document.querySelectorAll('.stat-value');
            statElements.forEach((el) => {
                const targetValue = parseFloat(el.getAttribute('data-value'));
                gsap.from(el, {
                    textContent: 0,
                    duration: 1.5,
                    ease: 'power2.out',
                    snap: { textContent: 1 },
                    onUpdate: function () {
                        el.textContent = this.targets()[0].textContent;
                    },
                });
            });
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
            if (err.response?.status !== 404) {
                // 404 is expected if no datasets exist yet
                alert('Failed to load data');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUploadSuccess = async (result) => {
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

            // Smooth scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error('Failed to load dataset:', err);
            alert('Failed to load dataset');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            await datasetAPI.downloadPDF(currentDatasetId);
        } catch (err) {
            console.error('Failed to download PDF:', err);
            alert('Failed to download PDF');
        }
    };

    const handleLogout = () => {
        authAPI.logout();
        navigate('/login');
    };

    return (
        <div style={styles.dashboard}>
            {/* Header */}
            <header style={styles.header}>
                <div className="container" style={styles.headerContainer}>
                    <div style={styles.logo}>
                        <span style={styles.logoIcon}>⚗️</span>
                        <h1 style={styles.logoText}>ChemFlow Analytics</h1>
                    </div>
                    <div style={styles.headerActions}>
                        {statistics && (
                            <button
                                className="btn btn-success"
                                onClick={handleDownloadPDF}
                            >
                                📄 Download PDF
                            </button>
                        )}
                        <button
                            className="btn btn-secondary"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container" style={styles.main}>
                {/* Statistics Cards */}
                {statistics && (
                    <div ref={statsRef} style={styles.statsGrid}>
                        <div className="stat-card glass" style={styles.statCard}>
                            <div style={styles.statIcon}>🔢</div>
                            <div style={styles.statContent}>
                                <p style={styles.statLabel}>Total Equipment</p>
                                <p className="stat-value" data-value={statistics.total_equipment} style={styles.statValue}>
                                    {statistics.total_equipment}
                                </p>
                            </div>
                        </div>

                        <div className="stat-card glass" style={styles.statCard}>
                            <div style={styles.statIcon}>💨</div>
                            <div style={styles.statContent}>
                                <p style={styles.statLabel}>Avg Flowrate</p>
                                <p className="stat-value" data-value={statistics.avg_flowrate} style={styles.statValue}>
                                    {statistics.avg_flowrate.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className="stat-card glass" style={styles.statCard}>
                            <div style={styles.statIcon}>⚡</div>
                            <div style={styles.statContent}>
                                <p style={styles.statLabel}>Avg Pressure</p>
                                <p className="stat-value" data-value={statistics.avg_pressure} style={styles.statValue}>
                                    {statistics.avg_pressure.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className="stat-card glass" style={styles.statCard}>
                            <div style={styles.statIcon}>🌡️</div>
                            <div style={styles.statContent}>
                                <p style={styles.statLabel}>Avg Temperature</p>
                                <p className="stat-value" data-value={statistics.avg_temperature} style={styles.statValue}>
                                    {statistics.avg_temperature.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Upload Section */}
                <UploadCSV onUploadSuccess={handleUploadSuccess} />

                {/* Main Content Grid */}
                <div style={styles.contentGrid}>
                    {/* Left Column - Charts and Table */}
                    <div style={styles.leftColumn}>
                        {loading ? (
                            <div style={styles.loadingContainer}>
                                <div className="spinner" style={styles.spinner}></div>
                                <p>Loading data...</p>
                            </div>
                        ) : (
                            <>
                                <Charts statistics={statistics} equipmentData={equipmentData} />
                                <DataTable data={equipmentData} />
                            </>
                        )}
                    </div>

                    {/* Right Column - History */}
                    <div style={styles.rightColumn}>
                        <HistoryPanel
                            history={history}
                            onSelectDataset={handleSelectDataset}
                            currentDatasetId={currentDatasetId}
                        />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer style={styles.footer}>
                <div className="container text-center">
                    <p style={styles.footerText}>
                        © 2026 Chemical Equipment Visualizer | Hybrid Application
                    </p>
                </div>
            </footer>
        </div>
    );
}

const styles = {
    dashboard: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        background: 'var(--color-bg-secondary)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1.5rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-sticky)',
        backdropFilter: 'blur(10px)',
    },
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
    },
    logoIcon: {
        fontSize: '2rem',
    },
    logoText: {
        fontSize: '1.5rem',
        fontWeight: 700,
        background: 'var(--gradient-neon)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    headerActions: {
        display: 'flex',
        gap: '1rem',
    },
    main: {
        flex: 1,
        padding: '2rem 0',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
    },
    statCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '1.5rem',
    },
    statIcon: {
        fontSize: '3rem',
    },
    statContent: {
        flex: 1,
    },
    statLabel: {
        fontSize: '0.875rem',
        color: 'var(--color-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '0.5rem',
    },
    statValue: {
        fontSize: '2rem',
        fontWeight: 700,
        color: 'var(--color-text-primary)',
        lineHeight: 1,
    },
    contentGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 350px',
        gap: '2rem',
        marginTop: '2rem',
    },
    leftColumn: {
        minWidth: 0, // Prevents overflow
    },
    rightColumn: {
        position: 'sticky',
        top: '100px',
        alignSelf: 'start',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem',
        gap: '1rem',
    },
    spinner: {
        width: '48px',
        height: '48px',
    },
    footer: {
        marginTop: 'auto',
        padding: '2rem 0',
        background: 'var(--color-bg-secondary)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    },
    footerText: {
        color: 'var(--color-text-muted)',
        fontSize: '0.875rem',
    },
};

// Responsive styles
if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    styles.contentGrid.gridTemplateColumns = '1fr';
    styles.rightColumn.position = 'static';
}

export default Dashboard;
