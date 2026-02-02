import { useState, useEffect } from 'react';
import { Clock, Database, TrendingUp, FileText } from 'lucide-react';
import gsap from 'gsap';

export default function HistoryTimeline({ history, currentDatasetId, onSelectDataset }) {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    useEffect(() => {
        gsap.fromTo('.timeline-item',
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, stagger: 0.08, duration: 0.4, ease: 'power2.out' }
        );
    }, [history]);

    const formatTimestamp = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatFullTimestamp = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="p-6 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/50 via-cyan-500/50 to-transparent" />

                {/* Timeline Items */}
                <div className="space-y-4">
                    {history.map((item, index) => {
                        const isActive = item.id === currentDatasetId || item.dataset_id === currentDatasetId;
                        const uploadDate = item.upload_timestamp || item.created_at || item.timestamp;

                        return (
                            <div
                                key={index}
                                className="timeline-item relative pl-10"
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {/* Timeline Dot */}
                                <div className={`absolute left-0 top-2 w-6 h-6 rounded-full border-4 transition-all duration-300 ${isActive
                                    ? 'bg-emerald-400 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.6)]'
                                    : hoveredIndex === index
                                        ? 'bg-purple-500 border-purple-500'
                                        : 'bg-slate-700 border-slate-600'
                                    }`}>
                                    {isActive && (
                                        <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                                    )}
                                </div>

                                {/* Card */}
                                <button
                                    onClick={() => onSelectDataset(item.id || item.dataset_id)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${isActive
                                        ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/20'
                                        : hoveredIndex === index
                                            ? 'bg-white/10 border-purple-500/30'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <Database className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-purple-400'}`} />
                                            <span className={`font-bold text-sm ${isActive ? 'text-emerald-400' : 'text-white'}`}>
                                                {item.filename || `Dataset ${item.id || index + 1}`}
                                            </span>
                                        </div>
                                        {isActive && (
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                                                ACTIVE
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 font-mono">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>{uploadDate ? formatTimestamp(uploadDate) : 'Unknown'}</span>
                                        </div>
                                        {item.total_records && (
                                            <div className="flex items-center gap-1">
                                                <TrendingUp className="w-3 h-3" />
                                                <span>{item.total_records} records</span>
                                            </div>
                                        )}
                                    </div>

                                    {uploadDate && hoveredIndex === index && (
                                        <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-slate-500 font-mono">
                                            {formatFullTimestamp(uploadDate)}
                                        </div>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {history.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-500 text-sm">No upload history available</p>
                    </div>
                )}
            </div>
        </div>
    );
}
