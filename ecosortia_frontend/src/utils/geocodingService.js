export const reverseGeocode = async (latitude, longitude) => {

    const response = await fetch(

        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,

        {
            headers: {
                Accept: "application/json",
            },
        }

    );

    if (!response.ok) {
        throw new Error("Unable to fetch address.");
    }

    const data = await response.json();

    return data.display_name || "";
};