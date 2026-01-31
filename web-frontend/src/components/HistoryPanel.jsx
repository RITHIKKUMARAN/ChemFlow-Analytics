import gsap from 'gsap';
import { useEffect, useRef } from 'react';

export default function HistoryPanel({ history, onSelectDataset, currentDatasetId }) {
    const listRef = useRef(null);

    useEffect(() => {
        if (history.length) {
            gsap.from(listRef.current.children, {
                opacity: 0,
                x: -10,
                duration: 0.4,
                stagger: 0.05
            });
        }
    }, [history]);

    return (
        <div className="surface-card flex flex-col" style={{ height: '100%', maxHeight: '600px' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: '1rem' }}>Dataset Logs</h3>
                <div className="text-label text-secondary">RECENT UPLOADS</div>
            </div>

            <div className="overflow-auto custom-scrollbar" style={{ flexGrow: 1, padding: '0.5rem' }}>
                <ul ref={listRef} className="flex flex-col gap-1">
                    {history.map((dataset) => {
                        const isActive = dataset.id === currentDatasetId;
                        return (
                            <li
                                key={dataset.id}
                                onClick={() => onSelectDataset(dataset.id)}
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: 'var(--radius-sm)',
                                    cursor: 'pointer',
                                    background: isActive ? 'var(--bg-surface-hover)' : 'transparent',
                                    border: isActive ? '1px solid var(--border-subtle)' : '1px solid transparent',
                                    transition: 'all 0.2s ease'
                                }}
                                className="hover:bg-active"
                            >
                                <div className="text-secondary text-mono" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
                                    {new Date(dataset.upload_timestamp).toLocaleDateString()}
                                </div>
                                <div style={{
                                    fontFamily: 'var(--font-heading)',
                                    color: isActive ? 'var(--color-accent)' : 'inherit',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {dataset.filename}
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span className="text-label">ID: {dataset.id}</span>
                                    <span className="text-label">{dataset.total_equipment_count} ITEMS</span>
                                </div>
                            </li>
                        );
                    })}
                    {history.length === 0 && (
                        <div className="text-secondary text-center p-4 text-sm">
                            No logs found.
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
}
