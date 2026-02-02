import { useState } from 'react';

export default function DataTable({ data }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    if (!data || data.length === 0) return null;

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="card w-full overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <span className="text-xl">📋</span>
                    <h2 className="text-lg font-bold tracking-tight">Equipment Data Analysis</h2>
                </div>
                <div className="text-xs text-muted font-mono bg-white/5 px-3 py-1 rounded-full">
                    {data.length} RECORDS DETECTED
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-white/5">
                        <tr>
                            <th className="py-4 px-6 text-left text-xs font-mono text-muted uppercase tracking-wider">Status</th>
                            <th className="py-4 px-6 text-left text-xs font-mono text-muted uppercase tracking-wider">Equipment ID</th>
                            <th className="py-4 px-6 text-left text-xs font-mono text-muted uppercase tracking-wider">Type</th>
                            <th className="py-4 px-6 text-right text-xs font-mono text-muted uppercase tracking-wider">Flowrate</th>
                            <th className="py-4 px-6 text-right text-xs font-mono text-muted uppercase tracking-wider">Pressure</th>
                            <th className="py-4 px-6 text-right text-xs font-mono text-muted uppercase tracking-wider">Temperature</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {paginatedData.map((item, index) => {
                            const status = item.status || 'Normal';
                            const statusColor = status === 'Critical' ? 'text-error' : status === 'Warning' ? 'text-orange-400' : 'text-success';
                            const rowClass = status === 'Critical' ? 'bg-error/10 animate-pulse-slow' : 'hover:bg-white/5';
                            const statusIcon = status === 'Critical' ? '🔴' : status === 'Warning' ? '⚠️' : '✅';

                            return (
                                <tr key={index} className={`transition-colors duration-200 ${rowClass}`}>
                                    <td className={`py-4 px-6 font-mono text-xs font-bold ${statusColor}`}>
                                        <span className="mr-2">{statusIcon}</span>
                                        {status.toUpperCase()}
                                    </td>
                                    <td className="py-4 px-6 font-mono text-sm text-white/80">{item.equipment_id}</td>
                                    <td className="py-4 px-6 text-sm font-medium">{item.equipment_type}</td>
                                    <td className="py-4 px-6 font-mono text-sm text-right text-accent">{item.flowrate.toFixed(1)}</td>
                                    <td className="py-4 px-6 font-mono text-sm text-right text-success">{item.pressure.toFixed(1)}</td>
                                    <td className="py-4 px-6 font-mono text-sm text-right text-orange-400">{item.temperature.toFixed(1)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="p-4 border-t border-white/5 flex justify-center gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
                    >
                        ←
                    </button>
                    <span className="font-mono text-sm py-2 px-4 bg-white/5 rounded-lg text-muted">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    );
}
