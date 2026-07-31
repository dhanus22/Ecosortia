import {
    LayoutDashboard,
    MapPinned,
    FileText,
    Coins,
    User
} from "lucide-react";

export const citizenNavigation = [

    {
        name: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
    },

    {
        name: "Report Waste",
        path: "/report",
        icon: MapPinned,
    },

    {
        name: "My Reports",
        path: "/my-reports",
        icon: FileText,
    },

    {
        name: "Credits",
        path: "/credits",
        icon: Coins,
    },

    {
        name: "Profile",
        path: "/profile",
        icon: User,
    },

];