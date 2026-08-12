import { FileX } from "lucide-react";

function EmptyState() {

    return (

        <div className="bg-white rounded-xl border p-12 text-center">

            <FileX
                size={50}
                className="mx-auto text-slate-400"
            />

            <h2 className="mt-4 text-xl font-semibold">

                No Reports Found

            </h2>

            <p className="text-slate-500 mt-2">

                Try changing your search or filter.

            </p>

        </div>

    );

}

export default EmptyState;