/**
 * History Panel Component - Shows last 5 datasets
 */
import { useEffect } from 'react';
import gsap from 'gsap';

function HistoryPanel({ history, onSelectDataset, currentDatasetId }) {
    useEffect(() => {
        gsap.from('.history-item', {
            opacity: 0,
            x: 20,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
        });
    }, [history]);

    if (!history || history.length === 0) {
        return (
            <div className="glass" style={styles.container}>
                <h3 style={styles.title}>📜 Upload History</h3>
                <p style={styles.emptyText}>No upload history yet</p>
            </div>
        );
    }

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="glass" style={styles.container}>
            <h3 style={styles.title}>📜 Upload History</h3>
            <p style={styles.subtitle}>Last {history.length} datasets</p>

            <div style={styles.historyList}>
                {history.map((dataset, index) => (
                    <div
                        key={dataset.id}
                        className="history-item glass-hover"
                        style={{
                            ...styles.historyItem,
                            ...(dataset.id === currentDatasetId ? styles.historyItemActive : {}),
                        }}
                        onClick={() => onSelectDataset(dataset.id)}
                    >
                        <div style={styles.historyIcon}>
                            {index === 0 ? '🆕' : '📊'}
                        </div>
                        <div style={styles.historyContent}>
                            <p style={styles.historyFilename}>{dataset.filename}</p>
                            <p style={styles.historyDate}>{formatDate(dataset.upload_timestamp)}</p>
                            <p style={styles.historyCount}>
                                {dataset.total_equipment_count} equipment
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '1.5rem',
    },
    title: {
        fontSize: '1.25rem',
        marginBottom: '0.5rem',
    },
    subtitle: {
        fontSize: '0.875rem',
        color: 'var(--color-text-muted)',
        marginBottom: '1.5rem',
    },
    emptyText: {
        color: 'var(--color-text-muted)',
        textAlign: 'center',
        padding: '2rem 0',
    },
    historyList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    historyItem: {
        display: 'flex',
        gap: '1rem',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'all var(--transition-base)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
    },
    historyItemActive: {
        borderColor: 'var(--color-accent-primary)',
        background: 'rgba(59, 130, 246, 0.1)',
    },
    historyIcon: {
        fontSize: '2rem',
        flexShrink: 0,
    },
    historyContent: {
        flex: 1,
    },
    historyFilename: {
        fontSize: '0.95rem',
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        marginBottom: '0.25rem',
        wordBreak: 'break-word',
    },
    historyDate: {
        fontSize: '0.75rem',
        color: 'var(--color-text-muted)',
        marginBottom: '0.25rem',
    },
    historyCount: {
        fontSize: '0.75rem',
        color: 'var(--color-accent-primary)',
    },
};

export default HistoryPanel;
