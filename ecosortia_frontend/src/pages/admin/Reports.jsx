import { useEffect, useState } from "react";
import useAdminReports from "../../hooks/useAdminReports";
import useDebounce from "../../hooks/useDebounce";
import SearchBar from "../../components/report/SearchBar";
import StatusFilter from "../../components/report/StatusFilter";
import Pagination from "../../components/report/Pagination";
import SkeletonCard from "../../components/report/SkeletonCard";
import EmptyState from "../../components/report/EmptyState";
import StatusBadge from "../../components/report/StatusBadge";
import { WASTE_TYPES } from "../../utils/constants";
import { formatDate } from "../../utils/dateFormatter";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import { exportAdminReportsExcel } from "../../services/adminService";
import toast from "react-hot-toast";

function Reports() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [wasteType, setWasteType] = useState("");
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search);

    const { reports, pagination, loading, error } = useAdminReports(
        page,
        debouncedSearch,
        status,
        wasteType,
        "created_at"
    );

    const handleExport = async () => {
        try {
            const blob = await exportAdminReportsExcel({
                search: debouncedSearch,
                status,
                waste_type: wasteType,
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "ecosortia-waste-reports.xlsx";
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch {
            toast.error("Unable to export reports.");
        }
    };

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, status, wasteType]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Waste Reports</h1>
                <p className="text-slate-500 mt-2">
                    Manage submitted waste reports.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <SearchBar value={search} onChange={setSearch} />

                <StatusFilter value={status} onChange={setStatus} />

                <select
                    value={wasteType}
                    onChange={(e) => setWasteType(e.target.value)}
                    className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                    <option value="">All Waste Types</option>
                    {WASTE_TYPES.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    onClick={handleExport}
                    className="flex items-center justify-center gap-2 px-4 py-3 border rounded-lg bg-white hover:bg-slate-50 transition"
                >
                    <Download size={18} />
                    Export Excel
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 rounded-lg p-4">
                    Failed to load waste reports.
                </div>
            )}

            {loading ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3].map((item) => (
                        <SkeletonCard key={item} />
                    ))}
                </div>
            ) : reports.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="bg-white rounded-xl border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="text-left p-4">Report</th>
                                    <th className="text-left p-4">Citizen</th>
                                    <th className="text-left p-4">Type</th>
                                    <th className="text-left p-4">Location</th>
                                    <th className="text-left p-4">Status</th>
                                    <th className="text-left p-4">Submitted</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-slate-50">
                                        <td className="p-4">
                                            <Link
                                                to={`/admin/report/${report.id}`}
                                                className="font-medium text-emerald-700 hover:underline">
                                                {report.title}
                                            </Link>
                                        </td>
                                        <td className="p-4">{report.user}</td>
                                        <td className="p-4">{report.waste_type}</td>
                                        <td className="p-4 max-w-xs">
                                            <p className="line-clamp-2 text-slate-600">
                                                {report.address}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={report.status} />
                                        </td>
                                        <td className="p-4 text-slate-500">
                                            {formatDate(report.created_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {!loading && reports.length > 0 && (
                <Pagination
                    currentPage={page}
                    hasNext={Boolean(pagination.next)}
                    hasPrevious={Boolean(pagination.previous)}
                    onNext={() => setPage((current) => current + 1)}
                    onPrevious={() => setPage((current) => current - 1)}
                />
            )}
        </div>
    );
}

export default Reports;