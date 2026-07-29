import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

import { register as registerService } from "../../services/authService";


function Register() {
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
            await registerService(data);
            toast.success("Registration successful");
            navigate("/login");
        } catch (error) {
            const errors = error.response?.data;
            if (typeof errors === "object") {
                Object.values(errors).forEach((message) => {
                    toast.error(Array.isArray(message) ? message[0] : message);
                });
            } else {
                toast.error("Registration failed");
            }
        }
    };
    return (

        <Card>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">
                    Create Account
                </h1>
                <p className="text-gray-500 mt-2">
                    Join EcoSortia
                </p>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4">

                <Input label="Username" placeholder="Enter username"  error={errors.username?.message}
                    {...register("username", {  required: "Username is required",
                        minLength: { value: 4, message: "Minimum 4 characters", },})}/>

                <Input
                    label="Email"
                    type="email"
                    placeholder="Enter email"
                />

                <Input
                    label="Phone Number"
                    placeholder="Enter phone number"
                />

                <Input
                    label="Address"
                    placeholder="Enter address"
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="Enter password"
                />

                <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm password"
                />

                <Button type="submit">

                    Register

                </Button>

            </form>

            <p className="text-center mt-6 text-sm">

                Already have an account?

                <Link
                    to="/login"
                    className="ml-2 text-emerald-600 font-medium"
                >

                    Login

                </Link>

            </p>

        </Card>

    );

}

export default Register;