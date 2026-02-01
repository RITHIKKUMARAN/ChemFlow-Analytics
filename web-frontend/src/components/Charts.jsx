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
import { useEffect } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

export default function Charts({ statistics, equipmentData }) {

    useEffect(() => {
        gsap.from('canvas', { opacity: 0, duration: 1, delay: 0.2 });
    }, [statistics]);

    if (!statistics) return <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No Data Available</div>;

    // THEME COLORS
    const theme = {
        accent: '#4F46E5',
        success: '#10B981',
        text: '#E2E8F0',
        grid: 'rgba(255,255,255,0.05)'
    };

    const commonOptions = {
        responsive: true,
        plugins: {
            legend: { labels: { color: theme.text } },
            tooltip: { backgroundColor: '#1E293B', titleColor: '#fff', bodyColor: '#fff' }
        },
        scales: {
            x: { time: { unit: 'month' }, grid: { color: theme.grid }, ticks: { color: theme.text } },
            y: { grid: { color: theme.grid }, ticks: { color: theme.text } }
        }
    };

    // Data Prep
    const pieData = {
        labels: Object.keys(statistics.equipment_type_distribution),
        datasets: [{
            data: Object.values(statistics.equipment_type_distribution),
            backgroundColor: [theme.accent, theme.success, '#F59E0B', '#EF4444', '#8B5CF6'],
            borderWidth: 0
        }]
    };

    const types = [...new Set(equipmentData.map(d => d.equipment_type))];
    const avgFlow = types.map(t => {
        const subset = equipmentData.filter(d => d.equipment_type === t);
        return subset.reduce((a, b) => a + b.flowrate, 0) / subset.length;
    });

    const barData = {
        labels: types,
        datasets: [{
            label: 'Avg Flowrate',
            data: avgFlow,
            backgroundColor: theme.accent,
            borderRadius: 4
        }]
    };

    const lineData = {
        labels: equipmentData.map((_, i) => i + 1),
        datasets: [{
            label: 'Temp Gradient',
            data: equipmentData.map(d => d.temperature),
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 0
        }]
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ background: '#1E293B', padding: '1rem', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '0.8rem', color: '#94A3B8' }}>DISTRIBUTION</h4>
                <div style={{ height: '250px' }}>
                    <Pie data={pieData} options={{ ...commonOptions, maintainAspectRatio: false }} />
                </div>
            </div>

            <div style={{ background: '#1E293B', padding: '1rem', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '0.8rem', color: '#94A3B8' }}>FLOW ANALYSIS</h4>
                <div style={{ height: '250px' }}>
                    <Bar data={barData} options={{ ...commonOptions, maintainAspectRatio: false }} />
                </div>
            </div>

            <div style={{ gridColumn: '1 / -1', background: '#1E293B', padding: '1rem', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '0.8rem', color: '#94A3B8' }}>THERMAL MONITOR</h4>
                <div style={{ height: '300px' }}>
                    <Line data={lineData} options={{ ...commonOptions, maintainAspectRatio: false }} />
                </div>
            </div>
        </div>
    );
}
