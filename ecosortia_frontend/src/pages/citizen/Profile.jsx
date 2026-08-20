import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import useProfile from "../../hooks/useProfile";
import { updateProfile } from "../../services/profileService";

function Profile() {
    const { profile, setProfile, loading, error } = useProfile();

    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting, errors },
    } = useForm();

    useEffect(() => {
        if (profile) {
            reset({
                first_name: profile.first_name || "",
                last_name: profile.last_name || "",
                email: profile.email || "",
                phone_number: profile.phone_number || "",
                address: profile.address || "",
            });
        }
    }, [profile, reset]);

    const onSubmit = async (data) => {
        try {
            const updated = await updateProfile(data);
            setProfile(updated);
            toast.success("Profile updated successfully.");
        } catch (err) {
            const response = err.response?.data;

            if (response?.errors) {
                Object.values(response.errors).forEach((messages) => {
                    toast.error(Array.isArray(messages) ? messages[0] : messages);
                });
            } else {
                toast.error("Unable to update profile.");
            }
        }
    };

    if (loading) return <LoadingSpinner />;

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 rounded-lg p-4">
                Unable to load profile.
            </div>
        );
    }

    return (
        <div className="max-w-3xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Profile</h1>
                <p className="text-slate-500 mt-2">
                    Manage your personal information.
                </p>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                        <Input
                            label="First Name"
                            error={errors.first_name?.message}
                            {...register("first_name", {
                                required: "First name is required",
                            })}
                        />

                        <Input
                            label="Last Name"
                            error={errors.last_name?.message}
                            {...register("last_name", {
                                required: "Last name is required",
                            })}
                        />
                    </div>

                    <Input
                        label="Email"
                        type="email"
                        error={errors.email?.message}
                        {...register("email", {
                            required: "Email is required",
                        })}
                    />

                    <Input
                        label="Phone Number"
                        error={errors.phone_number?.message}
                        {...register("phone_number", {
                            required: "Phone number is required",
                            pattern: {
                                value: /^[6-9]\d{9}$/,
                                message: "Enter a valid phone number",
                            },
                        })}
                    />

                    <Input
                        label="Address"
                        error={errors.address?.message}
                        {...register("address", {
                            required: "Address is required",
                        })}
                    />

                    <div className="pt-2">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

export default Profile;