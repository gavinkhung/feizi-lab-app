import { useEffect, useState } from "react";

import { AuthContext } from "@/lib/AuthProvider";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useContext } from "react";
import { db } from "../lib/firebase";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [segmentationError, setSegmentationError] = useState("");
  const [images, setImages] = useState({});
  const [segmentations, setSegmentations] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setImages(userSnap.data());
        } else {
          setImages({});
          setError(
            "The database has no record of images. Please upload images and labels to begin segmentation on the label page."
          );
        }
      } catch (error) {
        console.log(error);
      }

      try {
        const userRef = doc(db, "segmented", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setSegmentations(userSnap.data());
        } else {
          setSegmentations({});
          setSegmentationError("Images have not been segmented.");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  console.log("images", images);
  console.log("keys img", Object.keys(images));
  console.log("segmentations", segmentations);
  console.log("keys seg", Object.keys(segmentations));
  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold underline decoration-blue-500">
        Image Upload and Segmentation
      </h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-black">Features</h2>
        <ul className="space-y-2 list-disc">
          <li className="text-lg text-gray-800">
            Sign in with email/password and Google
          </li>
          <li className="text-lg text-gray-800">
            Labeled images and segmented images are uploaded to Google Cloud
            Storage
          </li>
          <li className="text-lg text-gray-800">
            Segmentations can be exported to image and svg formats
          </li>
          <li className="text-lg text-gray-800">
            Firestore noSQL database is used to keep track of images and labels
          </li>
        </ul>
      </div>
      {!user ? (
        <>
          <p className="font-bold text-grey-800">
            Please{" "}
            <Link href="login" className="text-blue-500 underline">
              sign in
            </Link>{" "}
            to upload images to Google Cloud and segment the images
          </p>
        </>
      ) : (
        <>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-black">Labeled Images</h2>
            {Object.keys(images).length == 0 && (
              <p className="font-semibold text-grey-800">
                No images found. Please upload images on the{" "}
                <Link href="login" className="text-blue-500 underline">
                  upload page
                </Link>{" "}
                to begin.
              </p>
            )}
            {Object.keys(images).map((imageLabel) => (
              <>
                <h3 className="text-lg">{imageLabel}</h3>

                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                  {images[imageLabel] &&
                    images[imageLabel].map((imageImg) => (
                      <img
                        className="object-cover w-full h-48 border border-gray-200 rounded-lg shadow-md "
                        src={imageImg}
                      />
                    ))}
                </div>
              </>
            ))}
          </div>
          <hr />
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-black">Segmentations</h2>
            {Object.keys(segmentations).length == 0 && (
              <p className="font-semibold text-grey-800">
                No segmentations found. Please segment images on the{" "}
                <Link href="login" className="text-blue-500 underline">
                  label page
                </Link>{" "}
                to begin.
              </p>
            )}
            {Object.keys(segmentations).map((segmentationLabel) => (
              <>
                <h3 className="text-lg">{segmentationLabel}</h3>
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                  {segmentations[segmentationLabel] &&
                    segmentations[segmentationLabel].map((segmentationImg) => (
                      <img
                        className="object-cover w-full h-48 border border-gray-200 rounded-lg shadow-md"
                        src={segmentationImg}
                      />
                    ))}
                </div>
              </>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
