import { useEffect, useState } from "react";
import { getMyReports } from "../services/reportService";

function useReports(page, search, status) {

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

                const data = await getMyReports({
                    page,
                    search,
                    status,
                });

                setReports(data.results);

                setPagination({
                    count: data.count,
                    next: data.next,
                    previous: data.previous,
                });

            } catch (err) {

                setError(err);

                setReports([]);

            } finally {

                setLoading(false);

            }

        };

        fetchReports();

    }, [page, search, status]);

    return {
        reports,
        pagination,
        loading,
        error,
    };
}

export default useReports;