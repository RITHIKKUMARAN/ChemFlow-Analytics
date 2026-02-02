import { useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import gsap from 'gsap';
import { Flame, Zap, PieChart, Activity } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            align: 'end',
            labels: {
                color: '#94a3b8',
                font: { family: 'JetBrains Mono', size: 10, weight: '500' },
                usePointStyle: true,
                boxWidth: 6,
                padding: 20
            }
        },
        tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 12,
            titleFont: { family: 'JetBrains Mono', size: 12 },
            bodyFont: { family: 'JetBrains Mono', size: 11 },
            displayColors: true,
            boxPadding: 4,
            callbacks: {
                label: (context) => {
                    let label = context.dataset.label || '';
                    if (label) label += ': ';
                    if (context.parsed.y !== null) label += context.parsed.y + (context.dataset.unit || '');
                    return label;
                }
            }
        }
    },
    scales: {
        x: {
            grid: { color: 'rgba(255, 255, 255, 0.02)', drawBorder: false },
            ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 9 }, maxRotation: 45, minRotation: 45 }
        },
        y: {
            grid: { color: 'rgba(255, 255, 255, 0.02)', drawBorder: false },
            ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 9 }, padding: 10 },
            border: { display: false }
        }
    },
    interaction: {
        mode: 'index',
        intersect: false,
    },
};

export default function Charts({ statistics, equipmentData }) {
    const chartsRef = useRef();

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo('.chart-card',
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.15,
                    duration: 0.8,
                    ease: 'power2.out',
                    clearProps: 'all'
                }
            );
        }, chartsRef);

        return () => ctx.revert();
    }, []);

    // 1. Temperature Gradient Area Chart
    const tempData = {
        labels: equipmentData.map(item => item.equipment_id),
        datasets: [
            {
                label: 'Temperature',
                data: equipmentData.map(item => item.temperature),
                borderColor: '#f472b6',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(244, 114, 182, 0.4)');
                    gradient.addColorStop(1, 'rgba(244, 114, 182, 0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#0f172a',
                pointBorderColor: '#f472b6',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                unit: '°C'
            }
        ]
    };

    // 2. Pressure Gradient Bar Chart
    const pressureData = {
        labels: equipmentData.map(item => item.equipment_id),
        datasets: [
            {
                label: 'Pressure',
                data: equipmentData.map(item => item.pressure),
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, '#8b5cf6');
                    gradient.addColorStop(1, '#3b82f6');
                    return gradient;
                },
                borderRadius: 4,
                barThickness: 12,
                hoverBackgroundColor: '#a78bfa',
                unit: ' bar'
            }
        ]
    };

    // 3. Equipment Type Doughnut
    const equipmentTypes = {};
    equipmentData.forEach(item => {
        equipmentTypes[item.equipment_type] = (equipmentTypes[item.equipment_type] || 0) + 1;
    });

    const typeData = {
        labels: Object.keys(equipmentTypes),
        datasets: [
            {
                data: Object.values(equipmentTypes),
                backgroundColor: [
                    '#8b5cf6', // Violet
                    '#06b6d4', // Cyan
                    '#10b981', // Emerald
                    '#ec4899', // Pink
                    '#f59e0b'  // Amber
                ],
                borderColor: '#0f172a', // Match bg to create "gap" effect
                borderWidth: 4,
                hoverOffset: 10
            }
        ]
    };

    // 4. Flow Rate Scatter/Line
    // Combining Flow and Pressure for correlation
    const flowData = {
        labels: equipmentData.map(item => item.equipment_id),
        datasets: [
            {
                label: 'Flow Rate',
                data: equipmentData.map(item => item.flowrate),
                borderColor: '#22d3ee',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(34, 211, 238, 0.4)');
                    gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#0f172a',
                pointBorderColor: '#22d3ee',
                pointRadius: 4,
                unit: ' m³/h'
            }
        ]
    };

    return (
        <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
            {/* Temperature Trend */}
            <div className="chart-card glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Flame className="w-24 h-24 text-pink-500" />
                </div>
                <h3 className="text-sm font-display font-bold text-slate-300 mb-6 flex items-center gap-2 uppercase tracking-wider">
                    <Flame className="w-4 h-4 text-pink-400" />
                    Thermal Profile
                </h3>
                <div className="h-64 relative z-10 text-xs">
                    <Line data={tempData} options={chartDefaults} />
                </div>
            </div>

            {/* Pressure Levels */}
            <div className="chart-card glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap className="w-24 h-24 text-violet-500" />
                </div>
                <h3 className="text-sm font-display font-bold text-slate-300 mb-6 flex items-center gap-2 uppercase tracking-wider">
                    <Zap className="w-4 h-4 text-violet-400" />
                    System Pressure
                </h3>
                <div className="h-64 relative z-10">
                    <Bar data={pressureData} options={chartDefaults} />
                </div>
            </div>

            {/* Flow Dynamics */}
            <div className="chart-card glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity className="w-24 h-24 text-cyan-500" />
                </div>
                <h3 className="text-sm font-display font-bold text-slate-300 mb-6 flex items-center gap-2 uppercase tracking-wider">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Flow Rate Dynamics
                </h3>
                <div className="h-64 relative z-10">
                    <Line data={flowData} options={chartDefaults} />
                </div>
            </div>

            {/* Equipment Types */}
            <div className="chart-card glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden group flex flex-col">
                <h3 className="text-sm font-display font-bold text-slate-300 mb-6 flex items-center gap-2 uppercase tracking-wider">
                    <PieChart className="w-4 h-4 text-emerald-400" />
                    Inventory Distribution
                </h3>
                <div className="flex-1 flex items-center justify-center relative z-10">
                    <div className="w-full max-w-[280px] h-64">
                        <Doughnut data={typeData} options={{
                            ...chartDefaults,
                            cutout: '75%',
                            plugins: {
                                ...chartDefaults.plugins,
                                legend: {
                                    position: 'right',
                                    labels: {
                                        color: '#94a3b8',
                                        font: { family: 'JetBrains Mono', size: 10 },
                                        usePointStyle: true,
                                        boxWidth: 8
                                    }
                                }
                            }
                        }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
