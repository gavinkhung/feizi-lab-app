import { AuthContext } from "@/lib/AuthProvider";
import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useContext, useEffect, useRef, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { db, storage } from "../lib/firebase";

function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(",")[1]);
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  var blob = new Blob([ab], { type: mimeString });
  return blob;
}

export default function Segment({ bgImage, label }) {
  const { user } = useContext(AuthContext);
  const canvas = useRef();

  let [eraser, setEraser] = useState(false);
  let [message, setMessage] = useState("");

  useEffect(() => {
    setMessage("");
  }, [bgImage, label]);

  useEffect(() => {
    canvas.current.eraseMode(eraser);
    setMessage("");
  }, [eraser]);

  return (
    <>
      <ReactSketchCanvas
        ref={canvas}
        style={{
          border: "0.0625rem solid #9c9c9c",
          borderRadius: "0.25rem",
        }}
        width="100%"
        height="24rem"
        strokeWidth={4}
        strokeColor="red"
        canvasColor="0000ffff"
        backgroundImage={bgImage}
        exportWithBackgroundImage={true}
      />

      <button
        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4
        focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md
        sm:w-auto px-5 py-2.5 text-center "
        onClick={() => setEraser(!eraser)}
      >
        {eraser ? "Disable Eraser" : "Enable Eraser"}
      </button>

      <br />

      <button
        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4
        focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md
        sm:w-auto px-5 py-2.5 text-center "
        onClick={async () => {
          canvas.current
            .exportImage("png")
            .then(async (data) => {
              // https://stackoverflow.com/questions/46405773/saving-base64-image-with-filesaver-js
              const time = Date.now();
              console.log(data);

              const storageRef = ref(storage, `${user.uid}/${label}/${time}`);
              setMessage("Uploading segmented data to Google Cloud.");
              try {
                const snapshot = await uploadBytes(
                  storageRef,
                  dataURItoBlob(data)
                );
                const url = await getDownloadURL(
                  ref(storage, `${user.uid}/${label}/${time}`)
                );

                const segmentedRef = doc(db, "segmented", user.uid);
                const obj = {};
                obj[label] = arrayUnion(url);
                await setDoc(segmentedRef, obj, { merge: true });
                setMessage(
                  "Segmentation data has been uploaded to Google Cloud. Go to the home page to see all of the segmentations and labeled images."
                );
                canvas.current.resetCanvas();
              } catch (error) {
                setMessage("");
                console.log(JSON.stringify(error));
                setError(JSON.stringify(error));
              }
            })
            .catch((e) => {
              console.log(e);
            });
        }}
      >
        {" "}
        Save Segmentation
      </button>
      <p className="font-bold text-green-800">{message}</p>
    </>
  );
}
