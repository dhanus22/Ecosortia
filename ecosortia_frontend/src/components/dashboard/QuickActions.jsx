import { Link } from "react-router-dom";
import { MapPinned, FileText } from "lucide-react";

function QuickActions() {
    return (
        <div className="bg-white rounded-xl border shadow-sm p-6">

            <h2 className="text-lg font-semibold mb-4">
                Quick Actions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <Link
                    to="/report"
                    className="border rounded-lg p-4 hover:bg-slate-50 transition"
                >
                    <div className="flex items-center gap-3">

                        <MapPinned className="text-emerald-600" />

                        <div>
                            <h3 className="font-medium">
                                Report Waste
                            </h3>

                            <p className="text-sm text-slate-500">
                                Create a new waste report.
                            </p>

                        </div>

                    </div>
                </Link>

                <Link
                    to="/my-reports"
                    className="border rounded-lg p-4 hover:bg-slate-50 transition"
                >
                    <div className="flex items-center gap-3">

                        <FileText className="text-blue-600" />

                        <div>
                            <h3 className="font-medium">
                                My Reports
                            </h3>

                            <p className="text-sm text-slate-500">
                                View submitted reports.
                            </p>

                        </div>

                    </div>
                </Link>

            </div>

        </div>
    );
}

export default QuickActions;