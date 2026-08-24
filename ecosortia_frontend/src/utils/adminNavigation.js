import { LayoutDashboard, FileText, User } from "lucide-react";

export const adminNavigation = [
    {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Reports",
        path: "/admin/reports",
        icon: FileText,
    },
    {
        name: "Profile",
        path: "/admin/profile",
        icon: User,
    },
];