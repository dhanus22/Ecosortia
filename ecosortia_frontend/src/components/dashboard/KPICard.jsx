import {
    CheckCircle,
    Clock,
    Coins,
    FileText
} from "lucide-react";

const colors = {
    emerald: "bg-emerald-100 text-emerald-600",
    blue: "bg-blue-100 text-blue-600",
    amber: "bg-amber-100 text-amber-600",
    red: "bg-red-100 text-red-600",
};

function KPICard({ title, value, icon: Icon, color = "emerald" }) {

    return (
        <div className="bg-white rounded-xl border shadow-sm p-6">

            <div className="flex justify-between items-center">

                <div>

                    <p className="text-sm text-slate-500">

                        {title}

                    </p>

                    <h2 className="text-3xl font-bold mt-2">

                        {value}

                    </h2>

                </div>

                <div
                    className={`p-3 rounded-lg ${colors[color]}`}
                >
                    <Icon size={24} />
                </div>

            </div>

        </div>
    );
}

export default KPICard;