import React, { useState } from "react";

function Detect() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPrediction(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/predict/`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>DeepFake Detector</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit" disabled={!file || loading}>
          {loading ? "Analyzing..." : "Upload & Predict"}
        </button>
      </form>

      {prediction && (
        <div className="result">
          <h2>Prediction: {prediction.prediction}</h2>
          <p>Real: {prediction.confidence.real.toFixed(4)}</p>
          <p>Fake: {prediction.confidence.fake.toFixed(4)}</p>
        </div>
      )}
    </div>
  );
}

export default Detect;
