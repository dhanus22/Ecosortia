import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function MainAdminRoute() {
    const { user } = useAuth();
    const currentUser = user?.user ?? user;

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (!currentUser.is_superuser) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
}

export default MainAdminRoute;