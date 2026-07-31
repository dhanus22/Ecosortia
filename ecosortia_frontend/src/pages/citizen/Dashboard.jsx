import {
  FileText,
  Clock,
  CheckCircle,
  Coins
} from "lucide-react";

import KPICard from "../../components/dashboard/KPICard";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentReports from "../../components/dashboard/RecentReports";

import useAuth from "../../hooks/useAuth";

function Dashboard() {

  const { user } = useAuth();

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
          value="0"
          icon={FileText}
          color="blue"
        />

        <KPICard
          title="Pending"
          value="0"
          icon={Clock}
          color="amber"
        />

        <KPICard
          title="Completed"
          value="0"
          icon={CheckCircle}
          color="emerald"
        />

        <KPICard
          title="Credits"
          value={user?.credits ?? 0}
          icon={Coins}
          color="emerald"
        />

      </div>
      <div className="grid lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2">

          <RecentReports reports={[]} />

        </div>

        <QuickActions />

      </div>

    </div>

  );

}

export default Dashboard;