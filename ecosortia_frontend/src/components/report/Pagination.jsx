function Pagination({ currentPage, hasNext, hasPrevious, onPrevious, onNext }) {
    return (
        <div className="flex items-center justify-center gap-4">
            <button
                type="button"
                disabled={!hasPrevious}
                onClick={onPrevious}
                className="px-4 py-2 border rounded-lg disabled:opacity-40 hover:bg-slate-50"
            >
                Previous
            </button>
            <span className="text-sm font-medium">Page {currentPage}</span>
            <button
                type="button"
                disabled={!hasNext}
                onClick={onNext}
                className="px-4 py-2 border rounded-lg disabled:opacity-40 hover:bg-slate-50"
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;