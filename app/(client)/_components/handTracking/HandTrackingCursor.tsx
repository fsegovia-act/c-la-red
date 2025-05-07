import { useEffect, useRef, useState } from "react";

interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

interface HandsResults {
  multiHandLandmarks?: HandLandmark[][];
  image: HTMLVideoElement | HTMLImageElement;
}

interface Hands {
  setOptions(options: {
    maxNumHands?: number;
    modelComplexity?: number;
    minDetectionConfidence?: number;
    minTrackingConfidence?: number;
  }): void;
  onResults(callback: (results: HandsResults) => void): void;
  send(options: { image: HTMLVideoElement | HTMLImageElement }): Promise<void>;
  close(): void;
}

interface Camera {
  start(): Promise<void>;
  stop(): void;
}

export default function HandTrackingCursor() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load MediaPipe script dynamically
  useEffect(() => {
    // Function to load a script and return a promise
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Check if script is already loaded
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(script);
      });
    };

    // Load required scripts
    const loadDependencies = async () => {
      try {
        // Load MediaPipe hands and camera utils
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands.min.js"
        );
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
        );
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load MediaPipe libraries");
        console.error(err);
      }
    };

    loadDependencies();
  }, []);

  // Set up hand tracking when library is loaded and tracking is enabled
  useEffect(() => {
    if (isLoading || !isTracking || !videoRef.current || !window.Hands) return;

    let hands: Hands;
    let camera: Camera;

    try {
      // Initialize MediaPipe Hands
      hands = new window.Hands({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`;
        },
      });

      // Configure hands
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      // Process results
      hands.onResults((results: HandsResults) => {
        if (canvasRef.current && debugMode) {
          drawLandmarks(canvasRef.current, results);
        }

        if (
          results.multiHandLandmarks &&
          results.multiHandLandmarks.length > 0
        ) {
          // Use index finger tip (landmark 8) to control cursor
          const indexFinger = results.multiHandLandmarks[0][8];

          // Map to screen coordinates
          const x = (1 - indexFinger.x) * window.innerWidth;
          const y = indexFinger.y * window.innerHeight;

          // Move cursor
          moveCursor(x, y);
        }
      });

      // Initialize camera
      camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) {
            await hands.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480,
      });

      // Start camera
      camera.start().catch((err) => {
        setError(
          "Failed to start camera. Please make sure you have granted camera permissions."
        );
        console.error(err);
      });

      // Cleanup function
      return () => {
        if (camera) camera.stop();
        if (hands) hands.close();
      };
    } catch (err) {
      setError("Error initializing hand tracking");
      console.error(err);
      return () => {};
    }
  }, [isLoading, isTracking, debugMode]);

  // Function to move cursor
  const moveCursor = (x: number, y: number) => {
    const cursor = document.getElementById("virtual-cursor");
    if (cursor) {
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
    }
  };

  // Function to draw landmarks on canvas
  const drawLandmarks = (canvas: HTMLCanvasElement, results: HandsResults) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to match video
    canvas.width = videoRef.current?.videoWidth || 640;
    canvas.height = videoRef.current?.videoHeight || 480;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw video feed (mirrored)
    if (videoRef.current) {
      ctx.save();
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(
        videoRef.current,
        -canvas.width,
        0,
        canvas.width,
        canvas.height
      );
      ctx.restore();
    }

    // Draw hands
    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        // Draw connections between landmarks
        const connections = [
          // Thumb
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
          // Index finger
          [0, 5],
          [5, 6],
          [6, 7],
          [7, 8],
          // Middle finger
          [0, 9],
          [9, 10],
          [10, 11],
          [11, 12],
          // Ring finger
          [0, 13],
          [13, 14],
          [14, 15],
          [15, 16],
          // Pinky
          [0, 17],
          [17, 18],
          [18, 19],
          [19, 20],
          // Palm
          [0, 5],
          [5, 9],
          [9, 13],
          [13, 17],
        ];

        // Draw connections
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#00FF00";

        for (const [start, end] of connections) {
          // Flip the x coordinates (mirror effect)
          const startX = (1 - landmarks[start].x) * canvas.width;
          const startY = landmarks[start].y * canvas.height;
          const endX = (1 - landmarks[end].x) * canvas.width;
          const endY = landmarks[end].y * canvas.height;

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }

        // Draw landmarks
        for (let i = 0; i < landmarks.length; i++) {
          // Flip the x coordinate (mirror effect)
          const x = (1 - landmarks[i].x) * canvas.width;
          const y = landmarks[i].y * canvas.height;

          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);

          // Highlight index finger tip in red
          if (i === 8) {
            ctx.fillStyle = "#FF0000";
          } else {
            ctx.fillStyle = "#FFFFFF";
          }

          ctx.fill();
        }
      }
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row gap-4 p-4">
        <div className="relative min-w-[320px] bg-gray-100 rounded-lg overflow-hidden aspect-video">
          {/* Hidden video for MediaPipe processing */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover scale-x-[-1]"
            style={{ display: debugMode ? "none" : "block" }}
            playsInline
          />

          {/* Canvas for debug visualization */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            style={{ display: debugMode ? "block" : "none" }}
          />

          {/* Error message */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-800 p-4">
              <p>{error}</p>
            </div>
          )}

          {/* Loading state */}
          {isLoading && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <p className="text-gray-700">Loading MediaPipe libraries...</p>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-4">
          <h2 className="text-xl font-bold">Hand Tracking Controls</h2>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsTracking(!isTracking)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-md text-white ${
                isTracking ? "bg-red-500" : "bg-green-500"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isTracking ? "Stop Tracking" : "Start Tracking"}
            </button>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="debug-mode"
                checked={debugMode}
                onChange={() => setDebugMode(!debugMode)}
                disabled={isLoading}
              />
              <label
                htmlFor="debug-mode"
                className={isLoading ? "text-gray-400" : ""}
              >
                Debug Mode
              </label>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click "Start Tracking" to begin hand tracking</li>
              <li>Position your hand in view of the camera</li>
              <li>Use your index finger tip to control the cursor</li>
              <li>Enable Debug Mode to see hand landmarks</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Custom cursor element that follows hand movement */}
      <div
        id="virtual-cursor"
        className="fixed w-4 h-4 bg-red-400 rounded-full pointer-events-none z-50 shadow-md"
        style={{ display: isTracking ? "block" : "none" }}
      />
    </div>
  );
}

// Add global window type definition
declare global {
  interface Window {
    Hands: new (options?: { locateFile?: (file: string) => string }) => Hands;
    Camera: new (
      videoElement: HTMLVideoElement,
      options?: {
        onFrame: () => Promise<void>;
        width?: number;
        height?: number;
      }
    ) => Camera;
  }
}
