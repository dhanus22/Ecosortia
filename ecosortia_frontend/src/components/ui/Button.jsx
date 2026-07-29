function Button({

    children,

    type = "button",

    disabled = false,

    className = "",

    ...props

}) {

    return (

        <button

            type={type}

            disabled={disabled}

            className={`
                w-full
                bg-emerald-600
                hover:bg-emerald-700
                text-white
                py-3
                rounded-lg
                font-medium
                transition
                disabled:opacity-60
                disabled:cursor-not-allowed
                ${className}
            `}

            {...props}

        >

            {children}

        </button>

    );

}

export default Button;