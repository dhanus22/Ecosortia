import { Outlet } from "react-router-dom";

function AuthLayout() {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
            <main className="w-full max-w-xl">
                <Outlet />
            </main>
        </div>
    );
}

export default AuthLayout;