import { useEffect, useState } from "react";
import { getCreditHistory } from "../services/creditsService";

const normalizeTransactions = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.transactions)) return data.transactions;
    if (Array.isArray(data?.data)) return data.data;
    return [];
};

function useCredits() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCredits = async () => {
            try {
                setLoading(true);
                const data = await getCreditHistory();
                setTransactions(normalizeTransactions(data));
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCredits();
    }, []);

    return { transactions, loading, error };
}

export default useCredits;