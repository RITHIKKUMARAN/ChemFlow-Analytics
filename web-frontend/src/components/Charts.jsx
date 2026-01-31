/**
 * Interactive Charts Component with Chart.js and GSAP
 */
import { useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import gsap from 'gsap';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function Charts({ statistics, equipmentData }) {
    const chartsRef = useRef(null);

    useEffect(() => {
        // Animate charts on mount
        gsap.from('.chart-card', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
        });
    }, [statistics]);

    if (!statistics || !equipmentData) {
        return (
            <div style={styles.emptyState}>
                <p>Upload a CSV file to see visualizations</p>
            </div>
        );
    }

    // Equipment Type Distribution (Pie Chart)
    const pieData = {
        labels: Object.keys(statistics.equipment_type_distribution),
        datasets: [
            {
                label: 'Equipment Count',
                data: Object.values(statistics.equipment_type_distribution),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(236, 72, 153, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    // Flowrate vs Pressure (Bar Chart)
    const equipmentTypes = [...new Set(equipmentData.map(eq => eq.equipment_type))];
    const avgFlowrateByType = equipmentTypes.map(type => {
        const filtered = equipmentData.filter(eq => eq.equipment_type === type);
        const sum = filtered.reduce((acc, eq) => acc + eq.flowrate, 0);
        return (sum / filtered.length).toFixed(2);
    });
    const avgPressureByType = equipmentTypes.map(type => {
        const filtered = equipmentData.filter(eq => eq.equipment_type === type);
        const sum = filtered.reduce((acc, eq) => acc + eq.pressure, 0);
        return (sum / filtered.length).toFixed(2);
    });

    const barData = {
        labels: equipmentTypes,
        datasets: [
            {
                label: 'Average Flowrate',
                data: avgFlowrateByType,
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
            },
            {
                label: 'Average Pressure',
                data: avgPressureByType,
                backgroundColor: 'rgba(139, 92, 246, 0.8)',
                borderColor: 'rgba(139, 92, 246, 1)',
                borderWidth: 2,
            },
        ],
    };

    // Temperature Trend (Line Chart)
    const lineData = {
        labels: equipmentData.map((eq, idx) => idx + 1),
        datasets: [
            {
                label: 'Temperature',
                data: equipmentData.map(eq => eq.temperature),
                borderColor: 'rgba(236, 72, 153, 1)',
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgba(236, 72, 153, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                labels: {
                    color: '#f9fafb',
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif",
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                titleColor: '#f9fafb',
                bodyColor: '#d1d5db',
                borderColor: 'rgba(59, 130, 246, 0.3)',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
            },
        },
        scales: {
            x: {
                ticks: {
                    color: '#9ca3af',
                    font: {
                        size: 11,
                    },
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
            },
            y: {
                ticks: {
                    color: '#9ca3af',
                    font: {
                        size: 11,
                    },
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
            },
        },
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: '#f9fafb',
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif",
                    },
                    padding: 15,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                titleColor: '#f9fafb',
                bodyColor: '#d1d5db',
                borderColor: 'rgba(59, 130, 246, 0.3)',
                borderWidth: 1,
                padding: 12,
            },
        },
    };

    return (
        <div ref={chartsRef} style={styles.chartsContainer}>
            <h3 style={styles.title}>📊 Data Visualizations</h3>

            <div style={styles.chartsGrid}>
                {/* Equipment Type Distribution */}
                <div className="chart-card glass" style={styles.chartCard}>
                    <h4 style={styles.chartTitle}>Equipment Type Distribution</h4>
                    <div style={styles.chartWrapper}>
                        <Pie data={pieData} options={pieOptions} />
                    </div>
                </div>

                {/* Flowrate vs Pressure */}
                <div className="chart-card glass" style={styles.chartCard}>
                    <h4 style={styles.chartTitle}>Average Flowrate & Pressure by Type</h4>
                    <div style={styles.chartWrapper}>
                        <Bar data={barData} options={chartOptions} />
                    </div>
                </div>

                {/* Temperature Trend */}
                <div className="chart-card glass" style={styles.chartCardWide}>
                    <h4 style={styles.chartTitle}>Temperature Trend Across Equipment</h4>
                    <div style={styles.chartWrapper}>
                        <Line data={lineData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    chartsContainer: {
        marginTop: '2rem',
    },
    title: {
        fontSize: '1.5rem',
        marginBottom: '1.5rem',
    },
    chartsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2rem',
    },
    chartCard: {
        padding: '1.5rem',
    },
    chartCardWide: {
        padding: '1.5rem',
        gridColumn: '1 / -1',
    },
    chartTitle: {
        fontSize: '1.125rem',
        marginBottom: '1rem',
        color: 'var(--color-text-primary)',
    },
    chartWrapper: {
        position: 'relative',
        height: '300px',
    },
    emptyState: {
        textAlign: 'center',
        padding: '3rem',
        color: 'var(--color-text-muted)',
    },
};

export default Charts;
