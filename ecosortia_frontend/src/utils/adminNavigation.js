import { LayoutDashboard, FileText, User, Users } from "lucide-react";

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
        name: "Municipality Users",
        path: "/admin/users",
        icon: Users,
    },
    {
        name: "Profile",
        path: "/admin/profile",
        icon: User,
    },
];