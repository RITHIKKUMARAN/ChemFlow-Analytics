export default function DataTable({ data }) {
    if (!data || data.length === 0) return null;

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <th className="text-label text-left p-4">ID</th>
                        <th className="text-label text-left p-4">Type</th>
                        <th className="text-label text-right p-4">Flow (m³/h)</th>
                        <th className="text-label text-right p-4">Press (Bar)</th>
                        <th className="text-label text-right p-4">Temp (°C)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td className="p-4 text-mono text-secondary">{row.equipment_id}</td>
                            <td className="p-4 font-medium">{row.equipment_type}</td>
                            <td className="p-4 text-right text-mono">{row.flowrate.toFixed(2)}</td>
                            <td className="p-4 text-right text-mono">{row.pressure.toFixed(2)}</td>
                            <td className="p-4 text-right text-mono">{row.temperature.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
