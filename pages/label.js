import PrivateRoute from "@/components/PrivateRoute";
import { AuthContext } from "@/lib/AuthProvider";
import { doc, getDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import Segment from "../components/Segment";
import { db } from "../lib/firebase";

export default function Label() {
  const { user } = useContext(AuthContext);
  const [label, setLabel] = useState("");
  const [labelImg, setLabelImg] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setData(userSnap.data());
        } else {
          setData(null);
          setError(
            "The database has no record of images. Please upload images and labels to begin segmentation on the label page. View all of your images and labels on the home page."
          );
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    chooseRandomImage();
  }, [data]);

  const chooseRandomImage = () => {
    setLoading(true);
    if (!data) {
      return;
    }
    const labels = Object.keys(data);
    if (!labels) {
      return;
    }
    setLabel("");
    setLabelImg("");
    const randomLabel = labels[Math.floor(Math.random() * labels.length)];
    const randomImg =
      data[randomLabel][Math.floor(Math.random() * data[randomLabel].length)];

    console.log(randomLabel);
    console.log(data[randomLabel]);
    console.log(randomImg);

    setLabel(randomLabel);
    setLabelImg(randomImg);
    setLoading(false);
  };

  const onNext = (e) => {
    e.preventDefault();
    chooseRandomImage();
  };

  return (
    <PrivateRoute>
      <div className="w-full space-y-4">
        <h1 className="text-3xl font-bold ">Segment the: {label}</h1>
        <p className="text-lg text-gray-800 ">
          Draw the segmentations with the mouse
        </p>
        <p className="font-bold text-red-800">{error}</p>
        <Segment bgImage={labelImg} label={label} />
        <br />
        <div className="text-right">
          <button
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md sm:w-auto px-5 py-2.5 text-center "
            onClick={(e) => onNext(e)}
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
              "Next Image"
            )}
          </button>
        </div>
      </div>
    </PrivateRoute>
  );
}
