import { forwardRef } from "react";

const Input = forwardRef(

    ({ label, error, ...props }, ref) => {

        return (
            <div className="space-y-2">

                <label className="block text-sm font-medium">

                    {label}

                </label>

                <input
                    ref={ref}
                    {...props}
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                {error && (

                    <p className="text-sm text-red-600">

                        {error}

                    </p>

                )}

            </div>

        );

    }

);

Input.displayName = "Input";

export default Input;