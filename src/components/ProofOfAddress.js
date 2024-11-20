import React, { useState, useRef, useEffect } from "react";
import { uploadImage } from "../api"; // Import your uploadImage function
import '../addressUpload.css';

const ProofOfAddress = () => {
  const [file, setFile] = useState(null);
  const [resultUrl, setResultUrl] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [uploadOption, setUploadOption] = useState("file"); // "file" or "camera"
  const [isUploaded, setIsUploaded] = useState(false); // State to track upload status
  const [isCaptured, setIsCaptured] = useState(false); // New state to track if photo is captured
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [copyText, setCopyText] = useState("Copy URL");


  const handleCopyUrl = () => {
    navigator.clipboard.writeText(resultUrl);
    setCopyText("URL Copied");
  };
  

  // State to track video and canvas dimensions
  const [videoDimensions, setVideoDimensions] = useState({
    width: 300,
    height: 200
  });

  // Update video dimensions based on window size
  useEffect(() => {
    const updateVideoSize = () => {
      const newWidth = window.innerWidth * 0.8; // 80% of window width
      const newHeight = (newWidth * 3) / 4; // Maintain 4:3 aspect ratio
      setVideoDimensions({ width: newWidth, height: newHeight });
    };

    // Set initial size
    updateVideoSize();

    // Update video size on window resize
    window.addEventListener("resize", updateVideoSize);
    
    // Clean up event listener
    return () => {
      window.removeEventListener("resize", updateVideoSize);
    };
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("No file selected or captured. Please upload or capture a document.");
      return;
    }
    try {
      const result = await uploadImage(file);
      setResultUrl(result.result);
      setIsUploaded(true); // Set upload status to true
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const openCamera = () => {
    setIsCameraOpen(true);
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    });
  };

  const capturePhoto = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const capturedFile = new File([blob], "captured_image.jpg", { type: "image/jpeg" });
        setFile(capturedFile);
        setIsCaptured(true); // Set photo capture status to true
        setIsCameraOpen(false); // Close the camera
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        alert("Photo captured and ready for upload!");
      } else {
        alert("Error capturing photo. Please try again.");
      }
    });
  };

  return (
    <div className="address-container">
      <h1>Upload Proof of Address</h1>

      {/* Only show this if upload has not been completed */}
      {!isUploaded && (
        <div className="upload-options">
          <label>
            <input
              type="radio"
              name="uploadOption"
              value="file"
              checked={uploadOption === "file"}
              onChange={() => setUploadOption("file")}
            />
            Upload File
          </label>
          <label>
            <input
              type="radio"
              name="uploadOption"
              value="camera"
              checked={uploadOption === "camera"}
              onChange={() => setUploadOption("camera")}
            />
            Use Camera
          </label>
        </div>
      )}

      {/* Show the file upload form or camera options based on selected option */}
      {!isUploaded && uploadOption === "file" && (
        <form onSubmit={handleUpload}>
          <input type="file" onChange={handleFileChange} />
          <button type="submit">Upload</button>
        </form>
      )}

      {!isUploaded && uploadOption === "camera" && (
        <div>
          {isCameraOpen && !isCaptured ? (
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
              <button onClick={capturePhoto}>Capture</button>
            </div>
          ) : null}
          {!isCaptured && !isCameraOpen && (
            <button onClick={openCamera}>Open Camera</button>
          )}
          <button onClick={handleUpload}>Upload Captured Photo</button>
        </div>
      )}

      {/* Show the result container if the upload is complete */}
      {isUploaded && resultUrl && (
        <div className="result-container">
          <p>Proof of address URL:</p>
          <a href={resultUrl} target="_blank" rel="noopener noreferrer">
            {resultUrl}
          </a>
          <button onClick={handleCopyUrl}>{copyText}</button>

        </div>
      )}
    </div>
  );
};

export default ProofOfAddress;






