import React, { useState, useRef, useEffect } from "react";
import { uploadImage } from "../api";
import '../identityDocuments.css';

const IdentityDocuments = () => {
  const [files, setFiles] = useState({ front: null, back: null });
  const [resultUrls, setResultUrls] = useState({ front: "", back: "" });
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [captureTarget, setCaptureTarget] = useState(null); // "front" or "back"
  const [uploadOption, setUploadOption] = useState({ front: "file", back: "file" }); // "file" or "camera"
  const [showResults, setShowResults] = useState(false); // Track whether to show the results or not
  const [photoCaptured, setPhotoCaptured] = useState({ front: false, back: false }); // Track if photo is captured for each side
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [copyText, setCopyText] = useState("Copy URL");
  const [copyText1, setCopyText1] = useState("Copy URL");

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(resultUrls.back);
    setCopyText("URL Copied");
  };

  const handleCopyUrl1 = () => {
    navigator.clipboard.writeText(resultUrls.front);
    setCopyText1("URL Copied");
  };
  const [videoDimensions, setVideoDimensions] = useState({
    width: 300,
    height: 200
  });

  // Adjust the video size dynamically based on window size
  useEffect(() => {
    const handleResize = () => {
      setVideoDimensions({
        width: window.innerWidth * 0.8,  // Adjust width to 80% of the window width
        height: (window.innerWidth * 0.8) * (9 / 16)  // Maintain 16:9 aspect ratio
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();  // Initial resize on component mount

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files.front || !files.back) {
      alert("Please ensure both front and back images are selected or captured.");
      return;
    }
    try {
      const frontResult = await uploadImage(files.front);
      const backResult = await uploadImage(files.back);
      setResultUrls({ front: frontResult.result, back: backResult.result });
      setShowResults(true); // Show results after upload
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const openCamera = (target) => {
    setCaptureTarget(target);
    setIsCameraOpen(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch((error) => console.error("Error accessing camera:", error));
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const capturedFile = new File([blob], `${captureTarget}_captured.jpg`, { type: "image/jpeg" });
          setFiles((prev) => ({ ...prev, [captureTarget]: capturedFile }));
          setPhotoCaptured((prev) => ({ ...prev, [captureTarget]: true }));
          setIsCameraOpen(false);
          videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
          alert(`${captureTarget.charAt(0).toUpperCase() + captureTarget.slice(1)} photo captured!`);
        } else {
          alert("Error capturing photo. Please try again.");
        }
      });
    }
  };

  return (
    <div className="container">
      <h1>Upload Identity Documents</h1>
      {!showResults ? (
        <form onSubmit={handleUpload} className="upload-form">
          <div className="upload-container">
            <div className="upload-item">
              <h2>Front of ID</h2>
              <label>
                <input
                  type="radio"
                  name="frontUploadOption"
                  value="file"
                  checked={uploadOption.front === "file"}
                  onChange={() => setUploadOption((prev) => ({ ...prev, front: "file" }))}
                />
                Upload File
              </label>
              <label>
                <input
                  type="radio"
                  name="frontUploadOption"
                  value="camera"
                  checked={uploadOption.front === "camera"}
                  onChange={() => setUploadOption((prev) => ({ ...prev, front: "camera" }))}
                />
                Use Camera
              </label>
              {uploadOption.front === "file" && !photoCaptured.front && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFiles((prev) => ({ ...prev, front: e.target.files[0] }))}
                />
              )}
              {uploadOption.front === "camera" && !photoCaptured.front && (
                <button type="button" onClick={() => openCamera("front")}>
                  Open Camera
                </button>
              )}
            </div>

            <div className="upload-item">
              <h2>Back of ID</h2>
              <label>
                <input
                  type="radio"
                  name="backUploadOption"
                  value="file"
                  checked={uploadOption.back === "file"}
                  onChange={() => setUploadOption((prev) => ({ ...prev, back: "file" }))}
                />
                Upload File
              </label>
              <label>
                <input
                  type="radio"
                  name="backUploadOption"
                  value="camera"
                  checked={uploadOption.back === "camera"}
                  onChange={() => setUploadOption((prev) => ({ ...prev, back: "camera" }))}
                />
                Use Camera
              </label>
              {uploadOption.back === "file" && !photoCaptured.back && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFiles((prev) => ({ ...prev, back: e.target.files[0] }))}
                />
              )}
              {uploadOption.back === "camera" && !photoCaptured.back && (
                <button type="button" onClick={() => openCamera("back")}>
                  Open Camera
                </button>
              )}
            </div>
          </div>

          <button type="submit">Upload</button>
        </form>
      ) : (
        <div className="result-container">
          {resultUrls.front && (
            <div>
              <p>Front of ID URL:</p>
              <a href={resultUrls.front} target="_blank" rel="noopener noreferrer">
                {resultUrls.front}
              </a>
              <button onClick={handleCopyUrl1}>{copyText1}</button>
            </div>
          )}
          {resultUrls.back && (
            <div>
              <p>Back of ID URL:</p>
              <a href={resultUrls.back} target="_blank" rel="noopener noreferrer">
                {resultUrls.back}
              </a>
              <button onClick={handleCopyUrl}>{copyText}</button>
            </div>
          )}
        </div>
      )}

      {isCameraOpen && (
        <div>
          <video
            ref={videoRef}
            width={videoDimensions.width}
            height={videoDimensions.height}
          />
          <canvas
            ref={canvasRef}
            width={videoDimensions.width}
            height={videoDimensions.height}
            style={{ display: "none" }}
          />
          <button onClick={capturePhoto}>Capture Photo</button>
        </div>
      )}
    </div>
  );
};

export default IdentityDocuments;




