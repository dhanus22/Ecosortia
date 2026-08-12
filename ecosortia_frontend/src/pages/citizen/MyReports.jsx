import { useEffect, useState } from "react";
import SearchBar from "../../components/report/SearchBar";
import StatusFilter from "../../components/report/StatusFilter";
import ReportCard from "../../components/report/ReportCard";
import Pagination from "../../components/report/Pagination";
import EmptyState from "../../components/report/EmptyState";
import SkeletonCard from "../../components/report/SkeletonCard";
import useReports from "../../hooks/useReport";
import useDebounce from "../../hooks/useDebounce";

function MyReports() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search);

    const { reports, pagination, loading, error } = useReports(
        page,
        debouncedSearch,
        status
    );

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, status]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">My Reports</h1>
                <p className="text-slate-500 mt-2">
                    Track the waste reports you have submitted.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <SearchBar value={search} onChange={setSearch} />
                </div>
                <StatusFilter value={status} onChange={setStatus} />
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 rounded-lg p-4">
                    Failed to load reports. Please try again.
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
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {reports.map((report) => (
                        <ReportCard key={report.id} report={report} />
                    ))}
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

export default MyReports;