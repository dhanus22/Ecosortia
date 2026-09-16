import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { requestPasswordReset } from "../../services/authService";

function ForgotPassword() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await requestPasswordReset(data.email);
            toast.success(response.message || "Password reset link sent.");
            navigate("/login");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to process password reset request."
            );
        }
    };

    return (
        <Card>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Forgot Password</h1>
                <p className="text-gray-500 mt-2">
                    Enter your registered email to reset your password.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    error={errors.email?.message}
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: "Enter a valid email address",
                        },
                    })}
                />

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
            </form>

            <p className="text-center mt-6 text-sm">
                Remember your password?
                <Link
                    to="/login"
                    className="ml-2 text-emerald-600 font-medium"
                >
                    Back to Login
                </Link>
            </p>
        </Card>
    );
}

export default ForgotPassword;