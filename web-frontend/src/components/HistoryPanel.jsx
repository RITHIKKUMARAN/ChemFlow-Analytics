import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HistoryPanel({ history, currentDatasetId, onSelectDataset }) {
    const panelRef = useRef();

    useEffect(() => {
        if (panelRef.current && history.length > 0) {
            gsap.from('.history-item', {
                opacity: 0,
                x: -20,
                stagger: 0.05,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    }, [history]);

    if (!history || history.length === 0) {
        return (
            <div className="p-6 text-center">
                <div className="text-4xl mb-3 opacity-50">📂</div>
                <p className="text-slate-500 text-sm">No upload history yet</p>
            </div>
        );
    }

    return (
        <div ref={panelRef} className="p-3 space-y-2">
            {history.map((item, index) => {
                const isActive = item.id === currentDatasetId;
                const timestamp = new Date(item.uploaded_at);

                return (
                    <div
                        key={item.id || index}
                        onClick={() => onSelectDataset && onSelectDataset(item.id)}
                        className={`history-item p-3 rounded-lg cursor-pointer transition-all duration-200 ${isActive
                                ? 'bg-purple-500/20 border border-purple-500/30'
                                : 'hover:bg-white/5 border border-transparent'
                            }`}
                    >
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <span className={`text-xs font-['JetBrains_Mono'] font-bold ${isActive ? 'text-purple-400' : 'text-slate-400'
                                }`}>
                                #{item.id}
                            </span>
                            {isActive && (
                                <div className="w-2 h-2 rounded-full bg-purple-400 animate-glow" />
                            )}
                        </div>
                        <p className="text-sm text-white font-medium truncate mb-1">
                            {item.filename || 'Unknown'}
                        </p>
                        <p className="text-[10px] text-slate-500 font-['JetBrains_Mono']">
                            {timestamp.toLocaleDateString()} • {timestamp.toLocaleTimeString()}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
