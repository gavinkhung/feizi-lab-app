import PrivateRoute from "@/components/PrivateRoute";
import { AuthContext } from "@/lib/AuthProvider";
import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useContext, useEffect, useState } from "react";
import { db, storage } from "../lib/firebase";

export default function Upload() {
  const { user } = useContext(AuthContext);
  const [label, setLabel] = useState("");
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState();
  const [message, setMessage] = useState(" ");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleFileSelected = (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files);
    console.log("files:", files[0]);
    setFile(files[0]);
    setMessage(" ");
    setError(" ");
  };

  const onUpload = async (e) => {
    e.preventDefault();
    if (label.trim() === "" || file == null) {
      setMessage(" ");
      setError("Choose a file and label the image before uploading.");
      return;
    }
    setLoading(true);
    setMessage("Uploading image to Google Cloud.");

    const time = Date.now();

    const storageRef = ref(storage, `${user.uid}/${label}/${time}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);

      const url = await getDownloadURL(
        ref(storage, `${user.uid}/${label}/${time}`)
      );

      const userRef = doc(db, "users", user.uid);
      const obj = {};
      obj[label] = arrayUnion(url);
      await setDoc(userRef, obj, { merge: true });

      setMessage(
        "Uploaded image to Google Cloud. View all of your images on the home page. Segment images on the label page."
      );
      setFile(undefined);
      setPreview("");
      setLabel("");
    } catch (error) {
      console.log(JSON.stringify(error));
      setError(JSON.stringify(error));
    }

    setLoading(false);
  };

  return (
    <PrivateRoute>
      <div className="w-full space-y-4">
        <h1 className="text-3xl font-bold ">Upload Images to Google Cloud</h1>
        {file ? (
          <img
            className="object-cover w-full border border-gray-200 rounded-lg shadow-md h-96 "
            src={preview}
          />
        ) : (
          <div className="w-full bg-gray-500 border border-gray-200 rounded-lg shadow-md h-96 "></div>
        )}

        <input onChange={handleFileSelected} type="file" />
        <label
          htmlFor="email"
          className="block mb-2 font-medium text-gray-900 text-md"
        >
          Label
        </label>
        <input
          type="email"
          id="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="label"
          required
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <p className="font-bold text-green-800">{message}</p>
        <p className="font-bold text-red-800">{error}</p>

        <button
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md sm:w-auto px-5 py-2.5 text-center "
          onClick={(e) => onUpload(e)}
        >
          {loading ? (
            <span className="flex">
              <svg
                class="animate-spin mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                {" "}
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>{" "}
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>{" "}
              </svg>
              {"Processing..."}
            </span>
          ) : (
            "Upload Image"
          )}
        </button>
      </div>
    </PrivateRoute>
  );
}
