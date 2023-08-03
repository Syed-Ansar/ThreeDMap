import { useState } from "react";
import Map from "./components/Map";
import ThreeDScene from "./components/ThreeDScene";
import './App.css'

function App() {
    const [capturedImage, setCapturedImage] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);
    
  return (
    <div className="AppContainer">
      <h1>Map Rendering on 3D Cuboid</h1>
      <div className="App">
        <Map
          isCapturing={isCapturing}
          setIsCapturing={setIsCapturing}
          setCapturedImage={setCapturedImage}
        />
        {capturedImage && <ThreeDScene capturedImage={capturedImage} />}
      </div>
    </div>
  );
}

export default App;
