import {
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    Coins,
    LoaderCircle,
} from "lucide-react";
import useAdminDashboard from "../../hooks/useAdminDashboard";
import KPICard from "../../components/dashboard/KPICard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

function Dashboard() {
    const { dashboard, loading, error } = useAdminDashboard();

    if (loading) return <LoadingSpinner />;

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 rounded-lg p-4">
                Failed to load municipality dashboard.
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Municipality Dashboard</h1>
                <p className="text-slate-500 mt-2">
                    Overview of waste reports and municipal activity.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <KPICard
                    title="Total Reports"
                    value={dashboard.total_reports}
                    icon={FileText}
                    color="blue"
                />
                <KPICard
                    title="Pending"
                    value={dashboard.pending}
                    icon={Clock}
                    color="amber"
                />
                <KPICard
                    title="In Progress"
                    value={dashboard.in_progress}
                    icon={LoaderCircle}
                    color="blue"
                />
                <KPICard
                    title="Completed"
                    value={dashboard.completed}
                    icon={CheckCircle}
                    color="emerald"
                />
                <KPICard
                    title="Rejected"
                    value={dashboard.rejected}
                    icon={XCircle}
                    color="red"
                />
                <KPICard
                    title="Credits Issued"
                    value={dashboard.credits_issued}
                    icon={Coins}
                    color="emerald"
                />
            </div>
        </div>
    );
}

export default Dashboard;