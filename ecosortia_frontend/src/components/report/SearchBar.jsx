import { Search } from "lucide-react";

function SearchBar({ value, onChange }) {
    return (
        <div className="relative">
            <Search
                className="absolute left-3 top-3 text-slate-400"
                size={18}
            />

            <input
                type="text"
                placeholder="Search reports..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="
                    w-full
                    border
                    rounded-lg
                    pl-10
                    pr-4
                    py-3
                    focus:outline-none
                    focus:ring-2
                    focus:ring-emerald-500
                "
            />
        </div>
    );
}

export default SearchBar;