import { useState } from "react";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { getFileExtension } from "../utils/functions";
import { DRIVE_DIR } from "../utils/constants";

function FileUpload() {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const uploadFile = () => {
        console.log(file);
        // return;
        if (file) {
            const storage = getStorage();
            const storageRef = ref(
                storage,
                `${DRIVE_DIR}/${uuidv4()}.${getFileExtension(file.name)}`
            );

            uploadBytes(storageRef, file).then((snapshot) => {
                console.log("Uploaded a blob or file!");
            });
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={uploadFile}>Upload</button>
        </div>
    );
}

export default FileUpload;
