import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import CitizenLayout from "../layouts/CitizenLayout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Dashboard from "../pages/citizen/Dashboard";
import ReportWaste from "../pages/citizen/ReportWaste";
import MyReports from "../pages/citizen/MyReports";
import Credits from "../pages/citizen/Credits";
import Profile from "../pages/citizen/Profile";

import AdminDashboard from "../pages/admin/Dashboard";
import Reports from "../pages/admin/Reports";
import ReportDetails from "../pages/admin/ReportDetails";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";


function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route element={<PublicRoute />}>

                    <Route element={<AuthLayout />}>

                        <Route path="/login" element={<Login />} />

                        <Route path="/register" element={<Register />} />

                    </Route>

                </Route>
                <Route element={<ProtectedRoute />}>
                    <Route element={<CitizenLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />

                        <Route path="/report" element={<ReportWaste />} />

                        <Route path="/my-reports" element={<MyReports />} />

                        <Route path="/credits" element={<Credits />} />

                        <Route path="/profile" element={<Profile />} />

                        <Route path="/admin/dashboard" element={<AdminDashboard />} />

                        <Route path="/admin/reports" element={<Reports />} />

                        <Route path="/admin/report/:id" element={<ReportDetails />} />

                        <Route path="/my-reports/:id" element={<ReportDetails />} />
                    </Route>
                </Route>
            </Routes>

        </BrowserRouter>
    );

}

export default AppRoutes;