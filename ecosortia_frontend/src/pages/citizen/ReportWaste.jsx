import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import LocationButton from "../../components/report/LocationButton";
import LeafletMap from "../../components/report/LeafletMap";
import AddressInput from "../../components/report/AddressInput";

import { getCurrentLocation } from "../../services/locationService";
import { reverseGeocode } from "../../utils/geocodingService";

function ReportWaste() {
    const [locationLoading, setLocationLoading] = useState(false);

    const [address, setAddress] = useState("");

    const [coordinates, setCoordinates] = useState({
        latitude: "",
        longitude: "",
    });

    // Automatically fetch address whenever coordinates change
    useEffect(() => {
        if (!coordinates.latitude || !coordinates.longitude) {
            return;
        }

        const fetchAddress = async () => {
            try {
                const result = await reverseGeocode(
                    coordinates.latitude,
                    coordinates.longitude
                );

                setAddress(result);
            } catch (error) {
                console.error(error);
                toast.error("Unable to fetch address.");
            }
        };

        fetchAddress();
    }, [coordinates]);

    const handleLocation = async () => {
        try {
            setLocationLoading(true);

            const location = await getCurrentLocation();

            setCoordinates(location);

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

            <div className="bg-white rounded-xl border p-4 space-y-2">
                <p>
                    <strong>Latitude:</strong>{" "}
                    {coordinates.latitude
                        ? coordinates.latitude.toFixed(6)
                        : "-"}
                </p>

                <p>
                    <strong>Longitude:</strong>{" "}
                    {coordinates.longitude
                        ? coordinates.longitude.toFixed(6)
                        : "-"}
                </p>
            </div>

            <LeafletMap
                coordinates={coordinates}
                setCoordinates={setCoordinates}
            />

            <AddressInput
                address={address}
                setAddress={setAddress}
            />
        </div>
    );
}

export default ReportWaste;