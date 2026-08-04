import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
} from "react-leaflet";

function MapEvents({ setCoordinates }) {

    useMapEvents({

        click(e) {

            setCoordinates({

                latitude: e.latlng.lat,

                longitude: e.latlng.lng,

            });

        },

    });

    return null;
}

function LeafletMap({ coordinates, setCoordinates }) {

    if (!coordinates.latitude || !coordinates.longitude) {

        return (

            <div className="h-80 border rounded-xl flex items-center justify-center text-slate-500">

                Detect your location to view the map.

            </div>

        );

    }

    return (

        <MapContainer
            
            center={[
                coordinates.latitude,
                coordinates.longitude,
            ]}
            zoom={16}
            scrollWheelZoom={true}
            className="h-80 rounded-xl"
        >

            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEvents setCoordinates={setCoordinates} />
            <Marker
                position={[
                    coordinates.latitude,
                    coordinates.longitude,
                ]}
            />

        </MapContainer>

    );

}

export default LeafletMap;