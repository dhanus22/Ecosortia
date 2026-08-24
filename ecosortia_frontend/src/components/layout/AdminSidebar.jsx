import { adminNavigation } from "../../utils/adminNavigation";
import NavItem from "./NavItem";

function AdminSidebar() {
    return (
        <aside className="w-64 bg-white border-r min-h-screen p-5">
            <h1 className="text-2xl font-bold mb-8">EcoSortia</h1>
            <p className="text-xs text-slate-400 uppercase mb-3">Municipality</p>
            <nav className="space-y-2">
                {adminNavigation.map((item) => (
                    <NavItem key={item.path} item={item} />
                ))}
            </nav>
        </aside>
    );
}

export default AdminSidebar;