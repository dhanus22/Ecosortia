import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function AdminRoute() {
    const { user } = useAuth();

    const currentUser = user?.user ?? user;

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (!currentUser.is_staff) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

export default AdminRoute;