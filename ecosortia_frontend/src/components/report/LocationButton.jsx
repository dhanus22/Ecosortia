import { MapPinned } from "lucide-react";

function LocationButton({

    onClick,

    loading

}) {

    return (

        <button

            type="button"

            onClick={onClick}

            disabled={loading}

            className="
                flex
                items-center
                gap-2
                bg-emerald-600
                text-white
                px-4
                py-3
                rounded-lg
                hover:bg-emerald-700
                transition
            "

        >

            <MapPinned size={18} />

            {

                loading ?

                "Detecting..."

                :

                "Use Current Location"

            }

        </button>

    );

}

export default LocationButton;