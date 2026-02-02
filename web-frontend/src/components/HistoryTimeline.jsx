import { useState, useEffect } from 'react';
import { Clock, Database, TrendingUp, FileText, X } from 'lucide-react';
import gsap from 'gsap';
import { datasetAPI } from '../utils/api';

export default function HistoryTimeline({ history, currentDatasetId, onSelectDataset, onDatasetDeleted }) {
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

    const handleDelete = async (e, datasetId) => {
        e.stopPropagation(); // Prevent triggering onSelectDataset

        if (!confirm('Are you sure you want to delete this dataset? This action cannot be undone.')) {
            return;
        }

        try {
            await datasetAPI.deleteDataset(datasetId);
            if (onDatasetDeleted) {
                onDatasetDeleted(datasetId);
            }
        } catch (error) {
            console.error('Failed to delete dataset:', error);
            alert('Failed to delete dataset. Please try again.');
        }
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
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <Database className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-emerald-400' : 'text-purple-400'}`} />
                                            <span className={`font-bold text-sm truncate ${isActive ? 'text-emerald-400' : 'text-white'}`}>
                                                {item.filename || `Dataset ${item.id || index + 1}`}
                                            </span>
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(e, item.id || item.dataset_id)}
                                            className="p-1 rounded-md hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all flex-shrink-0"
                                            title="Delete dataset"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-400 font-mono">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3 h-3 text-slate-500" />
                                            <span>{uploadDate ? formatTimestamp(uploadDate) : 'Unknown'}</span>
                                        </div>
                                        {item.total_records && (
                                            <div className="flex items-center gap-1.5">
                                                <FileText className="w-3 h-3 text-slate-500" />
                                                <span>{item.total_records} rows</span>
                                            </div>
                                        )}
                                        {isActive && (
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                                                ACTIVE
                                            </span>
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
