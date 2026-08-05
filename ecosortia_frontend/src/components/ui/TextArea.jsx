import { forwardRef } from "react";

const TextArea = forwardRef(

    ({ label, error, ...props }, ref) => {

        return (

            <div className="space-y-2">

                <label className="block text-sm font-medium">

                    {label}

                </label>

                <textarea

                    ref={ref}

                    {...props}

                    rows={4}

                    className="
                        w-full
                        border
                        rounded-lg
                        px-4
                        py-3
                        resize-none
                        focus:outline-none
                        focus:ring-2
                        focus:ring-emerald-500
                    "

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

TextArea.displayName = "TextArea";

export default TextArea;