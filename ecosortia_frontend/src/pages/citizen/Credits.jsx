import { Coins, ArrowUpRight } from "lucide-react";
import toast from "react-hot-toast";
import useCredits from "../../hooks/useCredits";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { formatDate } from "../../utils/dateFormatter";
import { useEffect } from "react";

function Credits() {
    const { user } = useAuth();
    const { transactions, loading, error } = useCredits();
    const transactionList = Array.isArray(transactions) ? transactions : [];

    useEffect(() => {
        if (error) {
            toast.error("Unable to load credit history.");
        }
    }, [error]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 rounded-lg p-4">
                Failed to load credit history.
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Credits</h1>
                <p className="text-slate-500 mt-2">
                    Credits earned from successfully completed waste reports.
                </p>
            </div>

            <div className="bg-white rounded-xl border shadow-sm p-6 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600">
                    <Coins size={28} />
                </div>
                <div>
                    <p className="text-sm text-slate-500">Current Balance</p>
                    <p className="text-3xl font-bold">{user?.credits ?? 0}</p>
                    <p className="text-sm text-slate-500">Credits</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm">
                <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold">Credit History</h2>
                </div>

                {transactionList.length === 0 ? (
                    <div className="p-10 text-center text-slate-500">
                        No credit transactions yet.
                    </div>
                ) : (
                    <div className="divide-y">
                        {transactionList.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="p-5 flex items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                        <ArrowUpRight size={18} />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {transaction.reason}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {formatDate(transaction.created_at)}
                                        </p>
                                    </div>
                                </div>

                                <span className="font-semibold text-emerald-600">
                                    +{transaction.points}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Credits;