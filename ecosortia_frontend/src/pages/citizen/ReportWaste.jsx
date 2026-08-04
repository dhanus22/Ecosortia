import { useState } from "react";
import toast from "react-hot-toast";

import LocationButton from "../../components/report/LocationButton";
import { getCurrentLocation } from "../../services/locationService";

function ReportWaste() {

    const [locationLoading, setLocationLoading] = useState(false);

    const [coordinates, setCoordinates] = useState({
        latitude: "",
        longitude: "",
    });

    const handleLocation = async () => {

        try {

            setLocationLoading(true);

            const location = await getCurrentLocation();

            setCoordinates(location);

            console.log(location);

            toast.success("Location detected successfully.");

        } catch (error) {

            console.error(error);

            toast.error("Unable to fetch location.");

        } finally {

            setLocationLoading(false);

        }
    };

    return (

        <div className="space-y-6">

            <h1 className="text-3xl font-bold">
                Report Waste
            </h1>

            <LocationButton
                onClick={handleLocation}
                loading={locationLoading}
            />

            <div className="bg-white rounded-xl border p-4">

                <p>
                    <strong>Latitude:</strong> {coordinates.latitude || "-"}
                </p>

                <p>
                    <strong>Longitude:</strong> {coordinates.longitude || "-"}
                </p>

            </div>

        </div>

    );
}

export default ReportWaste;