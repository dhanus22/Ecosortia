import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/layout/AdminSideBar";
import Navbar from "../components/layout/Navbar";

function AdminLayout() {
    return (
        <div className="flex min-h-screen bg-slate-100">
            <AdminSidebar />
            <div className="flex-1">
                <Navbar />
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;