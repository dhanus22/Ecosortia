import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import CitizenLayout from "../layouts/CitizenLayout";
import AdminLayout from "../layouts/AdminLayout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import Dashboard from "../pages/citizen/Dashboard";
import ReportWaste from "../pages/citizen/ReportWaste";
import MyReports from "../pages/citizen/MyReports";
import Credits from "../pages/citizen/Credits";
import Profile from "../pages/citizen/Profile";


import CitizenReportDetails from "../pages/citizen/ReportDetails";
import AdminReportDetails from "../pages/admin/ReportDetails";
import AdminDashboard from "../pages/admin/Dashboard";
import Reports from "../pages/admin/Reports";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import AdminRoute from "./AdminRoute";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route element={<PublicRoute />}>
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
                    </Route>
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route element={<CitizenLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/report" element={<ReportWaste />} />
                        <Route path="/my-reports" element={<MyReports />} />
                        <Route path="/my-reports/:id" element={<CitizenReportDetails />} />
                        <Route path="/credits" element={<Credits />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                </Route>

                <Route element={<AdminRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/reports" element={<Reports />} />
                        <Route path="/admin/report/:id" element={<AdminReportDetails />} />
                        <Route path="/admin/profile" element={<Profile />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;