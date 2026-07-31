import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

function CitizenLayout() {

    return (

        <div className="flex min-h-screen bg-slate-100">

            <Sidebar />

            <div className="flex-1">

                <Navbar />

                <main className="p-6">

                    <Outlet />

                </main>

            </div>

        </div>

    );

}

export default CitizenLayout;