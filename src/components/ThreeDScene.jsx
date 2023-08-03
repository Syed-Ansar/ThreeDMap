/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import * as BABYLON from "babylonjs";

const ThreeDScene = ({ capturedImage }) => {
  const canvasRef = useRef(null);
  const boxRef = useRef(null);
  const sceneRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new BABYLON.Engine(canvas, true);
    engineRef.current = engine;

    const createScene = () => {
      const scene = new BABYLON.Scene(engine);
      sceneRef.current = scene;

      // Create a camera and set its position
      const camera = new BABYLON.ArcRotateCamera(
        "camera",
        Math.PI / 2,
        Math.PI / 4,
        10,
        BABYLON.Vector3.Zero(),
        scene
      );
      camera.attachControl(canvas, true);

      // Create a light
      new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0, 1, 0),
        scene
      );
      scene.clearColor = BABYLON.Color3(0.5, 0.8, 0.5);
      scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);

      // Create a box with the captured image as a texture
      const box = BABYLON.MeshBuilder.CreateBox("box", { size: 4 }, scene);
      boxRef.current = box;
      const boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
      boxMaterial.diffuseTexture = new BABYLON.Texture(capturedImage, scene);
      box.material = boxMaterial;

      return scene;
    };

    const scene = createScene();

    engine.runRenderLoop(() => {
      scene.render();
      // Rotate the box around the Y-axis
      if (boxRef.current) {
        boxRef.current.rotation.y += 0.01;
      }
    });

    window.addEventListener("resize", () => {
      engine.resize();
    });

    return () => {
      engine.stopRenderLoop();
      scene.dispose();
      engine.dispose();
    };
  }, [capturedImage]);

  // Function to stop the animation loop and reset the box rotation

  return (
    <div
      className="threeDBox"
    >
      <canvas
        ref={canvasRef}
        style={{
          width: 500,
          height: 500,
        }}
      />
    </div>
  );
};

export default ThreeDScene;
