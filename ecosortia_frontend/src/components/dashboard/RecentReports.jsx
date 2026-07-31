function RecentReports({ reports = [] }) {

    return (

        <div className="bg-white rounded-xl border shadow-sm p-6">

            <h2 className="text-lg font-semibold mb-4">

                Recent Reports

            </h2>

            {reports.length === 0 ? (

                <div className="text-center py-10 text-slate-500">

                    No reports available.

                </div>

            ) : (

                <div className="space-y-4">

                    {reports.map((report) => (

                        <div
                            key={report.id}
                            className="border rounded-lg p-4"
                        >

                            <h3 className="font-medium">

                                {report.waste_type}

                            </h3>

                            <p className="text-sm text-slate-500">

                                {report.address}

                            </p>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default RecentReports;