import { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, Thermometer, Zap, Wind, Info } from 'lucide-react';
import gsap from 'gsap';

export default function WarningNodes({ equipmentData }) {
    const [warnings, setWarnings] = useState([]);

    useEffect(() => {
        if (equipmentData && equipmentData.length > 0) {
            analyzeWarnings();
        }
    }, [equipmentData]);

    useEffect(() => {
        if (warnings.length > 0) {
            gsap.fromTo('.warning-item',
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, stagger: 0.05, duration: 0.3, ease: 'power2.out' }
            );
        }
    }, [warnings]);

    const analyzeWarnings = () => {
        // Calculate thresholds
        const temperatures = equipmentData.map(d => d.temperature);
        const pressures = equipmentData.map(d => d.pressure);
        const flowrates = equipmentData.map(d => d.flowrate);

        const avgTemp = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
        const avgPressure = pressures.reduce((a, b) => a + b, 0) / pressures.length;
        const avgFlowrate = flowrates.reduce((a, b) => a + b, 0) / flowrates.length;

        const stdDevTemp = Math.sqrt(temperatures.reduce((sq, n) => sq + Math.pow(n - avgTemp, 2), 0) / temperatures.length);
        const stdDevPressure = Math.sqrt(pressures.reduce((sq, n) => sq + Math.pow(n - avgPressure, 2), 0) / pressures.length);
        const stdDevFlowrate = Math.sqrt(flowrates.reduce((sq, n) => sq + Math.pow(n - avgFlowrate, 2), 0) / flowrates.length);

        const warningList = [];

        equipmentData.forEach((equipment) => {
            const reasons = [];
            let severity = 'warning'; // warning, critical

            // Temperature analysis
            const tempDeviation = Math.abs(equipment.temperature - avgTemp) / stdDevTemp;
            if (tempDeviation > 1.2) {
                if (equipment.temperature > avgTemp) {
                    reasons.push({
                        type: 'temperature',
                        message: `Temperature ${equipment.temperature.toFixed(1)}°C exceeds safe range by ${((tempDeviation - 1.2) * stdDevTemp).toFixed(1)}°C`,
                        icon: Thermometer,
                        color: '#f87171'
                    });
                } else {
                    reasons.push({
                        type: 'temperature',
                        message: `Temperature ${equipment.temperature.toFixed(1)}°C below optimal range`,
                        icon: Thermometer,
                        color: '#60a5fa'
                    });
                }
                if (tempDeviation > 2) severity = 'critical';
            }

            // Pressure analysis
            const pressureDeviation = Math.abs(equipment.pressure - avgPressure) / stdDevPressure;
            if (pressureDeviation > 1.2) {
                if (equipment.pressure > avgPressure) {
                    reasons.push({
                        type: 'pressure',
                        message: `Pressure ${equipment.pressure.toFixed(1)} bar critically high (+${((pressureDeviation - 1.2) * stdDevPressure).toFixed(1)} bar)`,
                        icon: Zap,
                        color: '#fb923c'
                    });
                } else {
                    reasons.push({
                        type: 'pressure',
                        message: `Pressure ${equipment.pressure.toFixed(1)} bar below threshold`,
                        icon: Zap,
                        color: '#fbbf24'
                    });
                }
                if (pressureDeviation > 2) severity = 'critical';
            }

            // Flowrate analysis
            const flowrateDeviation = Math.abs(equipment.flowrate - avgFlowrate) / stdDevFlowrate;
            if (flowrateDeviation > 1.2) {
                if (equipment.flowrate > avgFlowrate) {
                    reasons.push({
                        type: 'flowrate',
                        message: `Flow rate ${equipment.flowrate.toFixed(1)} m³/h exceeds capacity`,
                        icon: Wind,
                        color: '#a78bfa'
                    });
                } else {
                    reasons.push({
                        type: 'flowrate',
                        message: `Flow rate ${equipment.flowrate.toFixed(1)} m³/h insufficient`,
                        icon: Wind,
                        color: '#34d399'
                    });
                }
                if (flowrateDeviation > 2) severity = 'critical';
            }

            if (reasons.length > 0) {
                warningList.push({
                    equipment,
                    reasons,
                    severity,
                    composite_score: tempDeviation + pressureDeviation + flowrateDeviation
                });
            }
        });

        // Sort by severity and composite score
        warningList.sort((a, b) => {
            if (a.severity === 'critical' && b.severity !== 'critical') return -1;
            if (a.severity !== 'critical' && b.severity === 'critical') return 1;
            return b.composite_score - a.composite_score;
        });

        setWarnings(warningList);
    };

    const getSeverityColor = (severity) => {
        return severity === 'critical' ? '#ef4444' : '#f59e0b';
    };

    const getSeverityBgColor = (severity) => {
        return severity === 'critical' ? 'bg-red-500/10' : 'bg-amber-500/10';
    };

    const getSeverityBorderColor = (severity) => {
        return severity === 'critical' ? 'border-red-500/50' : 'border-amber-500/50';
    };

    return (
        <div className="p-6 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {warnings.length > 0 ? (
                <div className="space-y-3">
                    {warnings.map((warning, index) => (
                        <div
                            key={index}
                            className={`warning-item p-4 rounded-xl border ${getSeverityBgColor(warning.severity)} ${getSeverityBorderColor(warning.severity)} hover:bg-white/10 transition-all duration-300`}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <div className={`px-2 py-1 rounded-md text-[10px] font-bold font-mono ${warning.severity === 'critical'
                                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                                        : 'bg-amber-500 text-white shadow-lg shadow-amber-500/50'
                                        }`}>
                                        {warning.severity.toUpperCase()}
                                    </div>
                                    <span className="font-bold text-white">
                                        {warning.equipment.equipment_id || warning.equipment.id}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        ({warning.equipment.equipment_type || 'Unknown Type'})
                                    </span>
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                    DEVIATION SCORE: {warning.composite_score.toFixed(2)}σ
                                </div>
                            </div>

                            {/* Reasons */}
                            <div className="space-y-2">
                                {warning.reasons.map((reason, rIdx) => {
                                    const Icon = reason.icon;
                                    return (
                                        <div key={rIdx} className="flex items-start gap-3 p-2 rounded-lg bg-black/20">
                                            <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: reason.color }} />
                                            <p className="text-sm text-slate-300 leading-relaxed">{reason.message}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Action Recommendation */}
                            <div className="mt-3 pt-3 border-t border-white/10 flex items-start gap-2">
                                <Info className="w-3 h-3 text-cyan-400 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-cyan-300 font-mono">
                                    {warning.severity === 'critical'
                                        ? 'IMMEDIATE ATTENTION REQUIRED: Initiate safety protocols and inspect equipment'
                                        : 'MONITOR CLOSELY: Schedule maintenance review within 24-48 hours'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-12 text-center">
                    <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-4">
                        <AlertCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h4 className="text-white font-bold mb-2">All Clear</h4>
                    <p className="text-slate-400 text-sm max-w-md mx-auto">
                        No anomalies detected. All equipment parameters are within normal operating ranges.
                    </p>
                </div>
            )}
        </div>
    );
}
