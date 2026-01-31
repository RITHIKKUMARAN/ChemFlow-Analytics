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

export default function Charts({ statistics, equipmentData }) {
    useEffect(() => {
        // Animate charts on mount
        gsap.from('.chart-panel', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
        });
    }, [statistics]);

    if (!statistics || !equipmentData) {
        return (
            <div className="text-center p-12 text-secondary text-mono">
                AWAITING_DATA_STREAM...
            </div>
        );
    }

    const themeColors = {
        accent: '#4F8CFF',
        success: '#2ED573',
        warning: '#FFA502',
        error: '#FF4757',
        text: '#EAEAF0',
        grid: 'rgba(255, 255, 255, 0.05)',
        tooltipBg: 'rgba(21, 26, 33, 0.95)'
    };

    // Equipment Type Distribution (Pie Chart)
    const pieData = {
        labels: Object.keys(statistics.equipment_type_distribution),
        datasets: [{
            label: 'Count',
            data: Object.values(statistics.equipment_type_distribution),
            backgroundColor: [
                themeColors.accent,
                themeColors.success,
                themeColors.warning,
                themeColors.error,
                '#70A1FF',
                '#A4B0BE'
            ],
            borderWidth: 0,
        }],
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
                label: 'Avg Flowrate',
                data: avgFlowrateByType,
                backgroundColor: themeColors.accent,
                borderRadius: 4,
            },
            {
                label: 'Avg Pressure',
                data: avgPressureByType,
                backgroundColor: themeColors.success,
                borderRadius: 4,
            },
        ],
    };

    // Temperature Trend (Line Chart)
    const lineData = {
        labels: equipmentData.map((eq, idx) => idx + 1),
        datasets: [{
            label: 'Temperature',
            data: equipmentData.map(eq => eq.temperature),
            borderColor: themeColors.error,
            backgroundColor: 'rgba(255, 71, 87, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            pointBackgroundColor: themeColors.error,
            pointRadius: 2,
            fill: true
        }],
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: themeColors.text, font: { family: "'Inter', sans-serif", size: 11 } },
                position: 'bottom'
            },
            tooltip: {
                backgroundColor: themeColors.tooltipBg,
                titleColor: themeColors.text,
                bodyColor: themeColors.text,
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 10,
                titleFont: { family: "'Space Grotesk', sans-serif" },
                bodyFont: { family: "'JetBrains Mono', monospace" }
            },
        },
        scales: {
            x: {
                grid: { color: themeColors.grid },
                ticks: { color: themeColors.text, font: { size: 10 } }
            },
            y: {
                grid: { color: themeColors.grid },
                ticks: { color: themeColors.text, font: { size: 10 } }
            }
        }
    };

    return (
        <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
            <div className="chart-panel surface-card p-4" style={{ padding: '1.5rem', gridColumn: 'span 1' }}>
                <h4 className="text-label mb-4">TYPE DISTRIBUTION</h4>
                <div style={{ height: '250px' }}>
                    <Pie data={pieData} options={{ ...commonOptions, maintainAspectRatio: false }} />
                </div>
            </div>

            <div className="chart-panel surface-card p-4" style={{ padding: '1.5rem', gridColumn: 'span 1' }}>
                <h4 className="text-label mb-4">FLOW vs PRESSURE</h4>
                <div style={{ height: '250px' }}>
                    <Bar data={barData} options={commonOptions} />
                </div>
            </div>

            <div className="chart-panel surface-card p-4" style={{ padding: '1.5rem', gridColumn: '1 / -1' }}>
                <h4 className="text-label mb-4">TEMPERATURE GRADIENT</h4>
                <div style={{ height: '300px' }}>
                    <Line data={lineData} options={commonOptions} />
                </div>
            </div>
        </div>
    );
}
