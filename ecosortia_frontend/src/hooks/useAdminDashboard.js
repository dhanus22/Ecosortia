import { useEffect, useState } from "react";
import { getAdminDashboard } from "../services/adminService";

function useAdminDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAdminDashboard();
                setDashboard(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    return { dashboard, loading, error };
}

export default useAdminDashboard;