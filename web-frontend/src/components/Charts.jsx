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
            display: true,
            position: 'top',
            labels: {
                color: '#9AA4B2',
                font: {
                    family: 'JetBrains Mono',
                    size: 11,
                    weight: '500'
                },
                padding: 15,
                usePointStyle: true
            }
        },
        tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#E6EAF0',
            bodyColor: '#9AA4B2',
            borderColor: 'rgba(139, 92, 246, 0.3)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            titleFont: {
                family: 'JetBrains Mono',
                size: 12,
                weight: 'bold'
            },
            bodyFont: {
                family: 'JetBrains Mono',
                size: 11
            }
        }
    },
    scales: {
        x: {
            grid: {
                color: 'rgba(255, 255, 255, 0.05)',
                drawBorder: false
            },
            ticks: {
                color: '#9AA4B2',
                font: {
                    family: 'JetBrains Mono',
                    size: 10
                }
            }
        },
        y: {
            grid: {
                color: 'rgba(255, 255, 255, 0.05)',
                drawBorder: false
            },
            ticks: {
                color: '#9AA4B2',
                font: {
                    family: 'JetBrains Mono',
                    size: 10
                }
            }
        }
    }
};

export default function Charts({ statistics, equipmentData }) {
    const chartsRef = useRef();

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo('.chart-card',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.15,
                    duration: 0.8,
                    ease: 'power3.out',
                    clearProps: 'all' // Ensures no stuck styles
                }
            );
        }, chartsRef);

        return () => ctx.revert();
    }, []);

    // Temperature Distribution Data
    const tempData = {
        labels: equipmentData.map(item => item.equipment_id),
        datasets: [
            {
                label: 'Temperature (°C)',
                data: equipmentData.map(item => item.temperature),
                borderColor: 'rgba(244, 114, 182, 0.8)',
                backgroundColor: 'rgba(244, 114, 182, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#f472b6',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }
        ]
    };

    // Pressure Distribution Data
    const pressureData = {
        labels: equipmentData.map(item => item.equipment_id),
        datasets: [
            {
                label: 'Pressure (bar)',
                data: equipmentData.map(item => item.pressure),
                backgroundColor: [
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 211, 238, 0.8)',
                    'rgba(52, 211, 153, 0.8)'
                ],
                borderColor: 'rgba(139, 92, 246, 1)',
                borderWidth: 1,
                borderRadius: 8
            }
        ]
    };

    // Equipment Type Distribution
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
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(34, 211, 238, 0.8)',
                    'rgba(52, 211, 153, 0.8)',
                    'rgba(251, 113, 133, 0.8)',
                    'rgba(250, 204, 21, 0.8)'
                ],
                borderColor: [
                    '#8b5cf6',
                    '#22d3ee',
                    '#34d399',
                    '#fb7185',
                    '#facc15'
                ],
                borderWidth: 2
            }
        ]
    };

    return (
        <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Temperature Trend */}
            <div className="chart-card glass-panel p-5 rounded-xl border border-white/10">
                <h3 className="text-sm font-['Space_Grotesk'] font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-lg">🔥</span>
                    Temperature Distribution
                </h3>
                <div className="h-64">
                    <Line data={tempData} options={chartDefaults} />
                </div>
            </div>

            {/* Pressure Chart */}
            <div className="chart-card glass-panel p-5 rounded-xl border border-white/10">
                <h3 className="text-sm font-['Space_Grotesk'] font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-lg">⚡</span>
                    Pressure Levels
                </h3>
                <div className="h-64">
                    <Bar data={pressureData} options={chartDefaults} />
                </div>
            </div>

            {/* Equipment Types */}
            <div className="chart-card glass-panel p-5 rounded-xl border border-white/10 lg:col-span-2">
                <h3 className="text-sm font-['Space_Grotesk'] font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-lg">📊</span>
                    Equipment Type Distribution
                </h3>
                <div className="h-80 flex items-center justify-center">
                    <div className="w-full max-w-md">
                        <Doughnut data={typeData} options={{
                            ...chartDefaults,
                            cutout: '65%',
                            plugins: {
                                ...chartDefaults.plugins,
                                legend: {
                                    ...chartDefaults.plugins.legend,
                                    position: 'right'
                                }
                            }
                        }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
