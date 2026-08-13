import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { formatDate } from "../../utils/dateFormatter";

function ReportCard({ report }) {
    return (
        <Link to={`/my-reports/${report.id}`} className="block bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition">
            <img src={report.image} alt={report.title} loading="lazy" className="w-full h-52 object-cover" />
            <div className="p-5 space-y-3">
                <div className="flex justify-between items-start gap-3">
                    <h2 className="font-semibold">{report.title}</h2>
                    <StatusBadge status={report.status} />
                </div>
                <p className="text-sm text-slate-500">{report.waste_type}</p>
                <p className="text-sm text-slate-600 line-clamp-2">{report.address}</p>
                <div className="flex justify-between text-xs text-slate-400">
                    <span>{formatDate(report.created_at)}</span>
                    {report.credits_awarded > 0 && (
                        <span>{report.credits_awarded} credits</span>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default ReportCard;