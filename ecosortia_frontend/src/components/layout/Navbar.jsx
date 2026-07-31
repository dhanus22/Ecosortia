import useAuth from "../../hooks/useAuth";

function Navbar() {

    const { user } = useAuth();

    return (

        <header className="bg-white border-b h-16 px-6 flex items-center justify-between">

            <h2 className="font-semibold">

                Welcome, {user?.first_name || user?.username}

            </h2>

        </header>

    );

}

export default Navbar;