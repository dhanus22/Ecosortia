
import { Link } from "react-router-dom";
import { citizenNavigation } from "../../utils/navigation";
import NavItem from "./NavItem";


function Sidebar() {

   

    return (

        <aside className="w-64 bg-white border-r min-h-screen p-5">

            <Link to="/dashboard" className="text-2xl font-bold mb-10">
                 
                EcoSortia

            </Link>

            <nav className="space-y-4 mt-3">

                {citizenNavigation.map((item) => (

                    <NavItem
                        key={item.path}
                        item={item}
                    />

                ))}

            </nav>

        </aside>

    );

}

export default Sidebar;