import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import StatusBadge from "../../components/report/StatusBadge";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { getReportDetails } from "../../services/reportService";
import { formatDate } from "../../utils/dateFormatter";

function ReportDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const data = await getReportDetails(id);
                setReport(data);
            } catch (error) {
                toast.error("Unable to load report.");
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [id]);

    if (loading) return <LoadingSpinner />;

    if (!report) {
        return (
            <div className="bg-white rounded-xl border p-8 text-center">
                Report not found.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <button
                type="button"
                onClick={() => navigate("/my-reports")}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
                <ArrowLeft size={18} />
                Back to My Reports
            </button>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <img
                    src={report.image}
                    alt={report.title}
                    className="w-full max-h-[500px] object-cover"
                />

                <div className="p-6 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <h1 className="text-2xl font-bold">{report.title}</h1>
                            <p className="text-slate-500 mt-1">{report.waste_type}</p>
                        </div>
                        <StatusBadge status={report.status} />
                    </div>

                    <div>
                        <h2 className="font-semibold mb-2">Description</h2>
                        <p className="text-slate-600">{report.description}</p>
                    </div>

                    <div>
                        <h2 className="font-semibold mb-2">Location</h2>
                        <div className="flex gap-2 text-slate-600">
                            <MapPin size={20} className="text-emerald-600 mt-0.5" />
                            <span>{report.address}</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                            <p className="text-sm text-slate-500">Submitted</p>
                            <p className="font-medium mt-1">{formatDate(report.created_at)}</p>
                        </div>
                        <div className="border rounded-lg p-4">
                            <p className="text-sm text-slate-500">Credits Awarded</p>
                            <p className="font-medium mt-1">{report.credits_awarded}</p>
                        </div>
                    </div>

                    {report.admin_remarks && (
                        <div className="border rounded-lg p-4">
                            <p className="text-sm text-slate-500">Municipality Remarks</p>
                            <p className="mt-1">{report.admin_remarks}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ReportDetails;