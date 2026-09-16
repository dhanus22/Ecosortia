import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { resetPassword } from "../../services/authService";

function ResetPassword() {
    const { uidb64, token } = useParams();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm();

    const password = watch("password");

    const onSubmit = async (data) => {
        try {
            const response = await resetPassword(uidb64, token, {
                password: data.password,
                confirm_password: data.confirm_password,
            });

            toast.success(
                response.message || "Password reset successfully."
            );

            navigate("/login", { replace: true });
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Invalid or expired reset link."
            );
        }
    };

    return (
        <Card>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Reset Password</h1>
                <p className="text-gray-500 mt-2">
                    Create a new password for your account.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                    error={errors.password?.message}
                    {...register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 8,
                            message: "Minimum 8 characters",
                        },
                    })}
                />

                <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm new password"
                    error={errors.confirm_password?.message}
                    {...register("confirm_password", {
                        required: "Please confirm your password",
                        validate: (value) =>
                            value === password || "Passwords do not match",
                    })}
                />

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Resetting..." : "Reset Password"}
                </Button>
            </form>

            <p className="text-center mt-6 text-sm">
                <Link
                    to="/login"
                    className="text-emerald-600 font-medium"
                >
                    Back to Login
                </Link>
            </p>
        </Card>
    );
}

export default ResetPassword;