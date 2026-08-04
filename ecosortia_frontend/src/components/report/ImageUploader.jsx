import { Upload } from "lucide-react";

function ImageUploader({

    image,

    onChange

}) {

    return (

        <div>

            <label className="block text-sm font-medium mb-2">

                Upload Image

            </label>

            <label
                className="
                border-2
                border-dashed
                rounded-xl
                h-60
                flex
                flex-col
                justify-center
                items-center
                cursor-pointer
                hover:bg-slate-50
                transition">
                {

                    image ?

                        <img
                            src={URL.createObjectURL(image)}
                            alt="Preview"
                            className="h-full w-full object-cover rounded-xl"
                        />

                        :

                        <>

                            <Upload
                                className="text-slate-400"
                                size={40}
                            />

                            <p className="mt-4 text-slate-500">

                                Click to upload image

                            </p>

                        </>

                }

                <input

                    type="file"

                    hidden

                    accept="image/*"

                    onChange={(e) => onChange(e.target.files[0])}

                />

            </label>

        </div>

    );

}

export default ImageUploader;