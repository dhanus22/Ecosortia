function SkeletonCard() {
    return (
        <div className="bg-white rounded-xl border overflow-hidden animate-pulse">
            <div className="h-52 bg-slate-200" />
            <div className="p-5 space-y-4">
                <div className="h-5 bg-slate-200 rounded w-2/3" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-10 bg-slate-200 rounded" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
            </div>
        </div>
    );
}

export default SkeletonCard;