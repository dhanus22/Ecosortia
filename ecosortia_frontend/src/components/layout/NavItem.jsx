import { NavLink } from "react-router-dom";

function NavItem({ item }) {

    const Icon = item.icon;

    return (

        <NavLink
            to={item.path}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                        ? "bg-emerald-600 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                }`
            }
        >
            <Icon size={20} />

            <span>{item.name}</span>

        </NavLink>

    );

}

export default NavItem;