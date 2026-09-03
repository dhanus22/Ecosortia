import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Pencil, Coins, User, Camera } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import useProfile from "../../hooks/useProfile";
import { updateProfile, changePassword } from "../../services/profileService";
import useAuth from "../../hooks/useAuth";
import { useRef } from "react";

function Profile() {
  const { profile, setProfile, loading, error } = useProfile();
  const [editing, setEditing] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const currentUser = user?.user ?? user;

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch,
    formState: {
      errors: passwordErrors,
      isSubmitting: passwordSubmitting,
    },
  } = useForm();

  const newPassword = watch("new_password");

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

  const startEditing = () => {
    reset({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      email: profile.email || "",
      phone_number: profile.phone_number || "",
      address: profile.address || "",
    });
    setEditing(true);
  };

  const cancelEditing = () => {
    reset({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      email: profile.email || "",
      phone_number: profile.phone_number || "",
      address: profile.address || "",
    });
    setEditing(false);
  };

  const onPasswordSubmit = async (data) => {
    try {
      await changePassword(data);
      toast.success("Password changed successfully.");
      resetPassword();
    } catch (err) {
      const response = err.response?.data;
      const errors = response?.errors || response;

      if (errors && typeof errors === "object") {
        Object.values(errors).forEach((messages) => {
          toast.error(
            Array.isArray(messages) ? messages[0] : messages
          );
        });
      } else {
        toast.error("Unable to change password.");
      }
    }
  };

  const handleProfilePicture = (file) => {
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

    setProfilePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("email", data.email);
      formData.append("phone_number", data.phone_number);
      formData.append("address", data.address);

      if (fileInputRef.current?.files[0]) {
        formData.append(
          "profile_picture",
          fileInputRef.current.files[0]
        );
      }

      const updated = await updateProfile(formData);

      setProfile(updated);
      setProfilePreview(null);
      setEditing(false);

      toast.success("Profile updated successfully.");
    } catch (err) {
      const response = err.response?.data;
      const errors = response?.errors || response;

      if (errors && typeof errors === "object") {
        Object.values(errors).forEach((messages) => {
          toast.error(
            Array.isArray(messages) ? messages[0] : messages
          );
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
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-slate-500 mt-2">
          View and manage your account information.
        </p>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center text-emerald-600">
                {(profilePreview || profile?.profile_picture) ? (
                  <img
                    src={profilePreview || profile.profile_picture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={32} />
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change profile photo"
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm ring-2 ring-white hover:bg-emerald-700 transition"
              >
                <Camera size={15} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                hidden
                onChange={(e) => handleProfilePicture(e.target.files[0])}
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                {profile?.first_name} {profile?.last_name}
              </h2>
              <p className="text-sm text-slate-500">
                @{profile?.username}
              </p>
            </div>
          </div>

          {!editing && (
            <button
              type="button"
              onClick={startEditing}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
              <Pencil size={17} />
              Edit Profile
            </button>
          )}
        </div>

        {!editing ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-500">First Name</p>
              <p className="font-medium mt-1">
                {profile?.first_name || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Last Name</p>
              <p className="font-medium mt-1">
                {profile?.last_name || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Username</p>
              <p className="font-medium mt-1">
                {profile?.username || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="font-medium mt-1 break-words">
                {profile?.email || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Phone Number</p>
              <p className="font-medium mt-1">
                {profile?.phone_number || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Address</p>
              <p className="font-medium mt-1">
                {profile?.address || "-"}
              </p>
            </div>
            {currentUser?.is_staff ? " " : (
              <div className="md:col-span-2 border-t pt-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                    <Coins size={22} />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Credits Earned
                    </p>
                    <p className="text-2xl font-bold">
                      {profile?.credits ?? 0}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Credits are awarded automatically when your completed waste reports are processed.
                </p>
              </div>
            )}

          </div>
        ) : (
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

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>

              <button
                type="button"
                onClick={cancelEditing}
                className="px-5 py-3 border rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Card>

      <Card>
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Change Password</h2>
          <p className="text-sm text-slate-500 mt-1">
            Keep your account secure by using a strong password.
          </p>
        </div>

        <form
          onSubmit={handlePasswordSubmit(onPasswordSubmit)}
          className="space-y-5"
        >
          <Input
            label="Current Password"
            type="password"
            error={passwordErrors.old_password?.message}
            {...registerPassword("old_password", {
              required: "Current password is required",
            })}
          />

          <Input
            label="New Password"
            type="password"
            error={passwordErrors.new_password?.message}
            {...registerPassword("new_password", {
              required: "New password is required",
              minLength: {
                value: 8,
                message: "Minimum 8 characters",
              },
            })}
          />

          <Input
            label="Confirm New Password"
            type="password"
            error={passwordErrors.confirm_password?.message}
            {...registerPassword("confirm_password", {
              required: "Please confirm your new password",
              validate: (value) =>
                value === newPassword || "Passwords do not match",
            })}
          />

          <Button type="submit" disabled={passwordSubmitting}>
            {passwordSubmitting ? "Changing..." : "Change Password"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default Profile;