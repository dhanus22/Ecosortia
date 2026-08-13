import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import TextArea from "../../components/ui/TextArea";

import ImageUploader from "../../components/report/ImageUploader";
import LocationButton from "../../components/report/LocationButton";
import LeafletMap from "../../components/report/LeafletMap";

import { WASTE_TYPES } from "../../utils/constants";

import { getCurrentLocation } from "../../services/locationService";
import { reverseGeocode } from "../../services/geocodingService";
import { createReport } from "../../services/reportService";

function ReportWaste() {
    const navigate = useNavigate();
    const [locationLoading, setLocationLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            title: "",
            description: "",
            waste_type: "",
            image: null,
            latitude: "",
            longitude: "",
            address: "",
        },
    });

    const latitude = watch("latitude");
    const longitude = watch("longitude");
    const address = watch("address"); // CHANGED: added address to watch, so we can update it when lat/lng change

    // Helper: clamp coordinates to 6 decimal places everywhere they enter form state
    const roundCoord = (value) => Number(Number(value).toFixed(6));

    useEffect(() => {
        if (!latitude || !longitude) return;

        const fetchAddress = async () => {
            try {
                const result = await reverseGeocode(latitude, longitude);
                setValue("address", result);
            } catch {
                toast.error("Unable to fetch address.");
            }
        };
        fetchAddress();
    }, [latitude, longitude, setValue]);

    const handleLocation = async () => {
        try {
            setLocationLoading(true);
            const location = await getCurrentLocation();
            // CHANGED: round before storing, so form state matches displayed value
            setValue("latitude", roundCoord(location.latitude));
            setValue("longitude", roundCoord(location.longitude));
            toast.success("Location detected.");
        } catch {
            toast.error("Unable to detect location.");
        } finally {
            setLocationLoading(false);
        }
    };

    const handleImage = (file) => {
        if (!file) return;

        const allowed = ["image/jpeg", "image/png"];
        if (!allowed.includes(file.type)) {
            toast.error("Only JPG and PNG images are allowed.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size cannot exceed 5 MB.");
            return;
        }
        setValue("image", file);
        setImagePreview(URL.createObjectURL(file));
    };

    const onSubmit = async (data) => {
        try {
            // CHANGED: validation checks moved above formData construction
            if (!data.latitude || !data.longitude) {
                toast.error("Please detect your location.");
                return;
            }

            if (!data.image) {
                toast.error("Please upload an image.");
                return;
            }

            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("waste_type", data.waste_type);
            formData.append("image", data.image);
            // CHANGED: round lat/lng to 6 decimal places before sending (fixes 400 "max 9 digits" error)
            formData.append("latitude", roundCoord(data.latitude));
            formData.append("longitude", roundCoord(data.longitude));
            formData.append("address", data.address);

            await createReport(formData);
            toast.success("Waste report submitted successfully.");
            navigate("/my-reports");
        } catch (error) {
            console.error(error.response?.data);
            const response = error.response?.data;
            if (response && typeof response === "object") {
                Object.entries(response).forEach(([field, messages]) => {
                    const message = Array.isArray(messages) ? messages[0] : messages;
                    toast.error(`${field}: ${message}`);
                });
            } else {
                toast.error("Failed to submit report.");
            }
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Report Waste</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <ImageUploader image={imagePreview} onChange={handleImage} />
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Waste Type</label>
                        <select
                            {...register("waste_type", { required: "Waste type is required" })}
                            className="w-full border rounded-lg p-3"
                        >
                            <option value="">Select Waste Type</option>
                            {WASTE_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        <p className="text-red-600 text-sm mt-1">{errors.waste_type?.message}</p>
                    </div>

                    <Input
                        label="Title"
                        placeholder="Enter title"
                        error={errors.title?.message}
                        {...register("title", {
                            required: "Title is required",
                            minLength: { value: 5, message: "Minimum 5 characters" },
                        })}
                    />
                </div>

                <TextArea
                    label="Description"
                    placeholder="Describe the waste"
                    error={errors.description?.message}
                    {...register("description", {
                        required: "Description is required",
                        minLength: { value: 15, message: "Minimum 15 characters" },
                    })}
                />

                <LocationButton onClick={handleLocation} loading={locationLoading} />

                <div className="bg-white rounded-xl border p-4">
                    <p><strong>Latitude: </strong>{latitude ? Number(latitude).toFixed(6) : "-"}</p>
                    <p><strong>Longitude: </strong>{longitude ? Number(longitude).toFixed(6) : "-"}</p>
                </div>

                <LeafletMap
                    coordinates={{ latitude, longitude }}
                    setCoordinates={(coords) => {
                        // CHANGED: round before storing, so map-picked coordinates match the 6-decimal limit too
                        setValue("latitude", roundCoord(coords.latitude));
                        setValue("longitude", roundCoord(coords.longitude));
                    }}
                />

                <TextArea
                    label="Address"
                    error={errors.address?.message}
                    {...register("address", { required: "Address is required" })}
                />

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                </Button>
            </form>
        </div>
    );
}

export default ReportWaste;

