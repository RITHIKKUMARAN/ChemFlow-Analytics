/**
 * Data Table Component with Sorting and Filtering
 */
import { useState, useEffect } from 'react';
import gsap from 'gsap';

function DataTable({ data }) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        // Staggered row animation
        gsap.from('.table-row', {
            opacity: 0,
            x: -20,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power2.out',
        });
    }, [data]);

    if (!data || data.length === 0) {
        return (
            <div style={styles.emptyState}>
                <p>No equipment data available</p>
            </div>
        );
    }

    // Sorting logic
    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === 'string') {
            return sortConfig.direction === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }

        return sortConfig.direction === 'asc'
            ? aValue - bValue
            : bValue - aValue;
    });

    // Filtering logic
    const filteredData = sortedData.filter(item =>
        Object.values(item).some(value =>
            String(value).toLowerCase().includes(filterText.toLowerCase())
        )
    );

    const handleSort = (key) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
        });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return '⇅';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={styles.title}>📋 Equipment Data</h3>
                <input
                    type="text"
                    placeholder="Search equipment..."
                    className="form-input"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    style={styles.searchInput}
                />
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('equipment_id')} style={styles.th}>
                                Equipment ID {getSortIcon('equipment_id')}
                            </th>
                            <th onClick={() => handleSort('equipment_type')} style={styles.th}>
                                Type {getSortIcon('equipment_type')}
                            </th>
                            <th onClick={() => handleSort('flowrate')} style={styles.th}>
                                Flowrate {getSortIcon('flowrate')}
                            </th>
                            <th onClick={() => handleSort('pressure')} style={styles.th}>
                                Pressure {getSortIcon('pressure')}
                            </th>
                            <th onClick={() => handleSort('temperature')} style={styles.th}>
                                Temperature {getSortIcon('temperature')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={item.id || index} className="table-row">
                                <td>{item.equipment_id}</td>
                                <td>
                                    <span style={styles.badge}>{item.equipment_type}</span>
                                </td>
                                <td>{Number(item.flowrate).toFixed(2)}</td>
                                <td>{Number(item.pressure).toFixed(2)}</td>
                                <td>{Number(item.temperature).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={styles.footer}>
                <p style={styles.footerText}>
                    Showing {filteredData.length} of {data.length} equipment records
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        marginTop: '2rem',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    title: {
        fontSize: '1.5rem',
    },
    searchInput: {
        maxWidth: '300px',
    },
    th: {
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'color var(--transition-fast)',
    },
    badge: {
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: 'var(--radius-full)',
        background: 'rgba(59, 130, 246, 0.2)',
        color: '#93c5fd',
        fontSize: '0.875rem',
        fontWeight: 500,
    },
    footer: {
        marginTop: '1rem',
        textAlign: 'center',
    },
    footerText: {
        color: 'var(--color-text-muted)',
        fontSize: '0.875rem',
    },
    emptyState: {
        textAlign: 'center',
        padding: '3rem',
        color: 'var(--color-text-muted)',
    },
};

export default DataTable;
