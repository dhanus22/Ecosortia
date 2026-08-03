import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";

function useDashboard() {

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const data = await getDashboard();

                setDashboard(data);

            } catch (err) {

                setError(err);

            } finally {

                setLoading(false);

            }

        };

        fetchDashboard();

    }, []);

    return {
        dashboard,
        loading,
        error,
    };

}

export default useDashboard;