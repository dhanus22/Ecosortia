import { useEffect, useState } from "react";
import { getAdminReports } from "../services/adminService";

function useAdminReports(page, search, status, wasteType, ordering = "created_at") {
    const [reports, setReports] = useState([]);
    const [pagination, setPagination] = useState({
        count: 0,
        next: null,
        previous: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAdminReports({
                    page,
                    search,
                    status,
                    waste_type: wasteType,
                    ordering,
                });

                setReports(data.results ?? []);
                setPagination({
                    count: data.count ?? 0,
                    next: data.next ?? null,
                    previous: data.previous ?? null,
                });
            } catch (err) {
                setError(err);
                setReports([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [page, search, status, wasteType, ordering]);

    return { reports, pagination, loading, error };
}

export default useAdminReports;