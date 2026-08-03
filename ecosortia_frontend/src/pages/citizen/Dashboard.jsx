import {
  FileText,
  Clock,
  CheckCircle,
  Coins,
  XCircle
} from "lucide-react";

import KPICard from "../../components/dashboard/KPICard";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentReports from "../../components/dashboard/RecentReports";
import useDashboard from "../../hooks/useDashboard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import useAuth from "../../hooks/useAuth";

function Dashboard() {

  const { user } = useAuth();

  const {
    dashboard,
    loading,
    error,
  } = useDashboard();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (

      <div className="text-red-600">

        Failed to load dashboard.

      </div>

    );
  }
  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">

          Dashboard

        </h1>

        <p className="text-slate-500 mt-2">

          Welcome back, {user?.first_name || user?.username}

        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

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
          title="Completed"
          value={dashboard.completed}
          icon={CheckCircle}
          color="emerald"
        />

        <KPICard
          title="Credits"
          value={user?.credits ?? dashboard.credits}
          icon={Coins}
          color="emerald"
        />

        <KPICard
          title="In Progress"
          value={dashboard.in_progress}
          icon={Clock}
          color="blue"
        />

        <KPICard
          title="Rejected"
          value={dashboard.rejected}
          icon={XCircle}
          color="red"
        />

      </div>
      <div className="grid lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border shadow-sm p-6">

            <h2 className="text-lg font-semibold mb-4">

              <RecentReports reports={[]} />
            </h2>

            <p className="text-slate-500">
              Recent reports will appear here.
            </p>
          </div>
        </div>
        
      </div>
      <QuickActions />
    </div>

  );

}

export default Dashboard;