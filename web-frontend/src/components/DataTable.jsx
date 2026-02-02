import { useState } from 'react';

export default function DataTable({ data }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const paginatedData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusColor = (status) => {
        const colors = {
            Normal: { bg: '#34d39920', text: '#34d399', border: '#34d39930' },
            Warning: { bg: '#facc1520', text: '#facc15', border: '#facc1530' },
            Critical: { bg: '#fb718520', text: '#fb7185', border: '#fb718530' }
        };
        return colors[status] || colors.Normal;
    };

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="px-6 py-5 text-left text-sm font-bold text-slate-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-5 text-left text-sm font-bold text-slate-400 uppercase tracking-wider">
                                Equipment ID
                            </th>
                            <th className="px-6 py-5 text-left text-sm font-bold text-slate-400 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-5 text-right text-sm font-bold text-slate-400 uppercase tracking-wider">
                                Flowrate
                            </th>
                            <th className="px-6 py-5 text-right text-sm font-bold text-slate-400 uppercase tracking-wider">
                                Pressure
                            </th>
                            <th className="px-6 py-5 text-right text-sm font-bold text-slate-400 uppercase tracking-wider">
                                Temperature
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((item, index) => {
                            const statusStyle = getStatusColor(item.status);
                            return (
                                <tr
                                    key={index}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                >
                                    <td className="px-6 py-5">
                                        <span
                                            className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border-2"
                                            style={{
                                                backgroundColor: statusStyle.bg,
                                                color: statusStyle.text,
                                                borderColor: statusStyle.border // Changed to use explicitly defined border color for solid look
                                            }}
                                        >
                                            {item.status || 'Normal'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-base font-mono font-medium text-white">
                                        {item.equipment_id}
                                    </td>
                                    <td className="px-6 py-5 text-base font-medium text-slate-300">
                                        {item.equipment_type}
                                    </td>
                                    <td className="px-6 py-5 text-right text-base font-mono font-bold text-cyan-400">
                                        {item.flowrate?.toFixed(1)}
                                    </td>
                                    <td className="px-6 py-5 text-right text-base font-mono font-bold text-purple-400">
                                        {item.pressure?.toFixed(1)}
                                    </td>
                                    <td className="px-6 py-5 text-right text-base font-mono font-bold text-amber-400">
                                        {item.temperature?.toFixed(1)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                    <span className="text-sm text-slate-400 font-['JetBrains_Mono']">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
