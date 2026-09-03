import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Download } from "lucide-react";
import toast from "react-hot-toast";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import StatusBadge from "../../components/report/StatusBadge";
import {
    getAdminReportDetails,
    updateReportStatus,
    downloadAdminReportPDF,
} from "../../services/adminService";
import { formatDate } from "../../utils/dateFormatter";

function ReportDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [status, setStatus] = useState("");
    const [remarks, setRemarks] = useState("");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const data = await getAdminReportDetails(id);
                setReport(data);
                setStatus(data.status);
                setRemarks(data.admin_remarks || "");
            } catch (error) {
                toast.error("Unable to load report.");
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [id]);

    const allowedStatuses = {
        Pending: ["In Progress", "Rejected"],
        "In Progress": ["Completed"],
        Completed: [],
        Rejected: [],
    };
    const availableStatuses = allowedStatuses[report?.status] || [];

    const handleUpdate = async () => {
        if (!status || status === report.status) {
            toast.error("Select a new status.");
            return;
        }
        if ((status === "Rejected" || status === "Completed") && !remarks.trim()) {
            toast.error(
                status === "Rejected"
                    ? "Remarks are required when rejecting a report."
                    : "Completion remarks are required."
            );
            return;
        }
        try {
            setUpdating(true);
            const updated = await updateReportStatus(id, { status, admin_remarks: remarks });
            setReport((current) => ({ ...current, ...updated }));
            toast.success("Report status updated successfully.");
        } catch (error) {
            const response = error.response?.data;
            const errors = response?.errors || response;
            if (errors && typeof errors === "object") {
                Object.values(errors).forEach((messages) => {
                    toast.error(Array.isArray(messages) ? messages[0] : messages);
                });
            } else {
                toast.error("Unable to update report.");
            }
        } finally {
            setUpdating(false);
        }
    };

    const handleDownload = async () => {
        try {
            const blob = await downloadAdminReportPDF(report.id);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `ecosortia-report-${report.id}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch {
            toast.error("Unable to download report.");
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!report) {
        return <div className="bg-red-50 text-red-600 rounded-lg p-4">Report not found.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => navigate("/admin/reports")}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft size={18} />
                    Back to Reports
                </button>
                <button
                    type="button"
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-slate-50 transition"
                >
                    <Download size={17} />
                    Download PDF
                </button>
            </div>
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <img src={report.image} alt={report.title} className="w-full max-h-[500px] object-cover" />
                <div className="p-6 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <h1 className="text-2xl font-bold">{report.title}</h1>
                            <p className="text-slate-500 mt-1">Reported by {report.user}</p>
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
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4">
                            <p className="text-sm text-slate-500">Waste Type</p>
                            <p className="font-medium mt-1">{report.waste_type}</p>
                        </div>
                        <div className="border rounded-lg p-4">
                            <p className="text-sm text-slate-500">Submitted</p>
                            <p className="font-medium mt-1">{formatDate(report.created_at)}</p>
                        </div>
                        <div className="border rounded-lg p-4">
                            <p className="text-sm text-slate-500">Credits Awarded</p>
                            <p className="font-medium mt-1">{report.credits_awarded}</p>
                        </div>
                    </div>
                    {report.completed_at && (
                        <div>
                            <p className="text-sm text-slate-500">Completed</p>
                            <p className="font-medium mt-1">{formatDate(report.completed_at)}</p>
                        </div>
                    )}
                    <div className="border-t pt-6">
                        <h2 className="text-lg font-semibold mb-4">Update Report</h2>
                        {availableStatuses.length === 0 ? (
                            <p className="text-slate-500">This report can no longer be updated.</p>
                        ) : (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium mb-2">New Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value={report.status}>Keep {report.status}</option>
                                        {availableStatuses.map((item) => (
                                            <option key={item} value={item}>{item}</option>
                                        ))}
                                    </select>
                                </div>
                                <Input
                                    label="Admin Remarks"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder="Enter remarks"
                                />
                                <Button type="button" onClick={handleUpdate} disabled={updating}>
                                    {updating ? "Updating..." : "Update Status"}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReportDetails;