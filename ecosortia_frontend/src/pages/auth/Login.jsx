import { Link } from "react-router-dom";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { login as loginService } from "../../services/authService";
import useAuth from "../../hooks/useAuth";


function Login() {

    const navigate = useNavigate();

    const { login: authLogin } = useAuth();

    const onSubmit = async (data) => {
        try {
            const response = await loginService(data);
            authLogin(response);
            toast.success(response.message);
            navigate("/dashboard");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm();
    return (

        <Card>

            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">
                    EcoSortia
                </h1>
                <p className="text-gray-500 mt-2">
                    Sign in to your account
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input label="Username" placeholder="Enter username" error={errors.username?.message}
                    {...register("username", {
                        required: "Username is required",
                    })} />

                <Input label="Password" type="password" placeholder="Enter password"
                    error={errors.password?.message}
                    {...register("password", {
                        required: "Password is required",
                    })} />

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Signing in..." : "Login"}</Button>
            </form>

            <p className="text-center mt-6 text-sm">
                Don't have an account?
                <Link
                    to="/register"
                    className="ml-2 text-emerald-600 font-medium">
                    Register
                </Link>
            </p>
        </Card>
    );
}

export default Login;