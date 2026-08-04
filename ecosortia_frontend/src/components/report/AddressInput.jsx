function AddressInput({

    address,

    setAddress,

}) {

    return (

        <div>

            <label className="block text-sm font-medium mb-2">

                Address

            </label>

            <textarea

                rows={3}

                value={address}

                onChange={(e) => setAddress(e.target.value)}

                className="
                    w-full
                    border
                    rounded-lg
                    p-3
                    resize-none
                    focus:outline-none
                    focus:ring-2
                    focus:ring-emerald-500
                "

            />

        </div>

    );

}

export default AddressInput;