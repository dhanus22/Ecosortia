import { WASTE_TYPES } from "../../utils/constants";

function WasteTypeSelect({

    error

}) {

    return (

        <div>

            <label className="block text-sm font-medium mb-2">

                Waste Type

            </label>

            <option value="">
                Select Waste Type
            </option>

            {WASTE_TYPES.map((type) => (
                <option
                    key={type}
                    value={type}
                >
                    {type}
                </option>
            ))}

            {

                error &&

                <p className="text-red-600 text-sm mt-1">

                    {error}

                </p>

            }

        </div>

    );

}

export default WasteTypeSelect;