import useAuth from "../../hooks/useAuth";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


function Navbar() {

    const navigate = useNavigate();

    const { user, logout } = useAuth();
    const handleLogout = () => {
    toast.success("Logged out successfully.");
        logout();

        navigate("/login", { replace: true });

    };

    return (

        <header className="bg-white border-b h-16 px-6 flex items-center justify-between">

            <h2 className="font-semibold">
                Welcome, {user?.first_name || user?.username}
            </h2>

            <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-slate-100 transition"
            >
                <LogOut size={18} />
                Logout
            </button>

        </header>

    );

}

export default Navbar;