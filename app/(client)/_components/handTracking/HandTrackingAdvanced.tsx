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

export default function HandTrackingAdvanced() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultRef = useRef<HandsResults | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isTracking, setIsTracking] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [mouseMode, setMouseMode] = useState<"hover" | "click">("hover");
  const [sensitivity, setSensitivity] = useState(1);
  const [smoothing, setSmoothing] = useState(3);

  // State for cursor position with smoothing
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const positionHistoryRef = useRef<Array<{ x: number; y: number }>>([]);

  // Reference to track if click gesture is active
  const isClickingRef = useRef(false);

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
          console.log({file})
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

      // Process hand landmarks
      hands.onResults((results: HandsResults) => {
        resultRef.current = results;

        if (canvasRef.current && debugMode) {
          drawDebugView(canvasRef.current, results);
        }

        // Process hand tracking data
        if (
          results.multiHandLandmarks &&
          results.multiHandLandmarks.length > 0
        ) {
          const landmarks = results.multiHandLandmarks[0];

          // Use index fingertip (landmark 8) for cursor position
          const indexFinger = landmarks[8];

          // Get screen coordinates (flip x-axis for mirror effect)
          const x = (1 - indexFinger.x) * window.innerWidth;
          const y = indexFinger.y * window.innerHeight;

          // Move cursor
          moveCursor(x, y);

          // Apply smoothing
          updateCursorWithSmoothing(x, y);

          // Detect gestures
          detectGestures(landmarks);

        }
      });

      // Setup camera
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

  // Function to apply position smoothing
  const updateCursorWithSmoothing = (x: number, y: number) => {
    // Add new position to history
    positionHistoryRef.current.push({ x, y });

    // Keep history limited to smoothing value
    while (positionHistoryRef.current.length > smoothing) {
      positionHistoryRef.current.shift();
    }

    // Calculate average position
    if (positionHistoryRef.current.length > 0) {
      const avgX =
        positionHistoryRef.current.reduce((sum, pos) => sum + pos.x, 0) /
        positionHistoryRef.current.length;
      const avgY =
        positionHistoryRef.current.reduce((sum, pos) => sum + pos.y, 0) /
        positionHistoryRef.current.length;

      // Apply sensitivity
      const currentX = cursorPos.x;
      const currentY = cursorPos.y;
      const newX = currentX + (avgX - currentX) * sensitivity * 0.1;
      const newY = currentY + (avgY - currentY) * sensitivity * 0.1;

      setCursorPos({ x: newX, y: newY });

      // Update virtual cursor position
      // const cursor = document.getElementById("virtual-cursor");
      // if (cursor) {
      //   cursor.style.left = `${newX}px`;
      //   cursor.style.top = `${newY}px`;
      // }
      // moveCursor(newX, newY);
    }
  };

  // Function to detect hand gestures
  const detectGestures = (landmarks: { x: number; y: number; z: number }[]) => {
    if (mouseMode === "click") {
      // Detect pinch gesture (thumb tip close to index tip)
      const thumbTip = landmarks[4];
      const indexTip = landmarks[8];

      // Calculate distance between thumb and index fingertips
      const distance = calculateDistance(thumbTip, indexTip);

      // Threshold for pinch detection (adjusted for normalized coordinates)
      const pinchThreshold = 0.05;
      const isPinching = distance < pinchThreshold;

      // Handle click actions
      if (isPinching && !isClickingRef.current) {
        // Pinch started - Mouse down
        isClickingRef.current = true;
        simulateMouseClick("down");
      } else if (!isPinching && isClickingRef.current) {
        // Pinch ended - Mouse up
        isClickingRef.current = false;
        simulateMouseClick("up");
      }
    }
  };

  // Calculate Euclidean distance between two 3D points
  const calculateDistance = (
    a: { x: number; y: number; z: number },
    b: { x: number; y: number; z: number }
  ) => {
    return Math.sqrt(
      Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2)
    );
  };

  // Function to simulate mouse clicks
  const simulateMouseClick = (type: "down" | "up") => {
    // Find element at cursor position
    const elementsAtPoint = document.elementsFromPoint(
      cursorPos.x,
      cursorPos.y
    );
    const targetElement = elementsAtPoint.find(
      (el) =>
        el.id !== "virtual-cursor" &&
        el !== canvasRef.current &&
        el !== videoRef.current
    );

    if (targetElement) {
      // Update cursor appearance
      const cursor = document.getElementById("virtual-cursor");
      if (cursor) {
        cursor.style.transform = type === "down" ? "scale(0.8)" : "scale(1)";
        cursor.style.backgroundColor = type === "down" ? "#FF0000" : "#FF5555";
      }

      // For a full implementation, you could dispatch mouse events:
      const event = new MouseEvent(type === 'down' ? 'mousedown' : 'mouseup', {
        bubbles: true,
        cancelable: true,
        clientX: cursorPos.x,
        clientY: cursorPos.y
      });
      targetElement.dispatchEvent(event);

      // For click completion
      if (type === "up") {
        // Flash the cursor to indicate click
        if (cursor) {
          cursor.style.backgroundColor = "#FF0000";
          setTimeout(() => {
            if (cursor) cursor.style.backgroundColor = "#FF5555";
          }, 100);
        }
      }
    }
  };

  // Function to draw debug visualization
  const drawDebugView = (canvas: HTMLCanvasElement, results: HandsResults) => {
    const ctx = canvas.getContext("2d");
    if (!ctx || !videoRef.current) return;

    // Set canvas size to match video
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw mirrored video feed as background
    if (videoRef.current) {
      ctx.save();
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    // Draw hand landmarks if available
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];

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

      for (const [startIdx, endIdx] of connections) {
        const startPoint = landmarks[startIdx];
        const endPoint = landmarks[endIdx];

        // Mirror the x coordinates for the visualization
        const startX = (1 - startPoint.x) * canvas.width;
        const startY = startPoint.y * canvas.height;
        const endX = (1 - endPoint.x) * canvas.width;
        const endY = endPoint.y * canvas.height;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      // Draw landmarks
      for (let i = 0; i < landmarks.length; i++) {
        const x = (1 - landmarks[i].x) * canvas.width;
        const y = landmarks[i].y * canvas.height;

        // Special highlighting for important landmarks
        if (i === 8) {
          // Index fingertip - main cursor control
          ctx.fillStyle = "#FF0000";
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, 2 * Math.PI);
          ctx.fill();
        } else if (i === 4) {
          // Thumb tip - used for gestures
          ctx.fillStyle = "#FFFF00";
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, 2 * Math.PI);
          ctx.fill();
        } else {
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, 2 * Math.PI);
          ctx.fill();
        }

        // Add landmark numbers in debug mode
        if (i % 4 === 0) {
          // Only show some landmark numbers to avoid clutter
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "10px Arial";
          ctx.fillText(i.toString(), x + 5, y - 5);
        }
      }

      // Display distance between thumb and index in click mode
      if (mouseMode === "click") {
        console.log("entra click")
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const distance = calculateDistance(thumbTip, indexTip);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "14px Arial";
        ctx.fillText(`Pinch distance: ${distance.toFixed(3)}`, 10, 20);
        ctx.fillText(
          `Pinch status: ${isClickingRef.current ? "ACTIVE" : "inactive"}`,
          10,
          40
        );
      }
    }
  };

  // Toggle camera and tracking
  const toggleTracking = () => {
    setIsTracking(!isTracking);
    if (!isTracking) {
      // Reset position history when starting
      positionHistoryRef.current = [];
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row gap-4 p-4">
        <div
          className="w-[50%] md:w-1/2"
        >
          {/* Video element - Hidden but used for processing */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover scale-x-[-1]"
            style={{ display: debugMode ? "none" : "block" }}
            playsInline
          />

          {/* Canvas for debug visualization */}
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover"
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

          {/* Message when tracking is off */}
          {!isTracking && (
            <div
              className="absolute w-[50%] md:w-1/2 inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 text-white"
            >
              <div className="text-center p-4">
                <p className="text-xl mb-4">
                  Camera access required for hand tracking
                </p>
                <button
                  onClick={toggleTracking}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
                >
                  Enable Camera and Start Tracking
                </button>
              </div>
            </div>
          )}

          {/* Debug mode message */}
          {isTracking && debugMode && (
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-sm p-2 rounded">
              Debug Mode: ON
            </div>
          )}
        </div>

        {/* Controls Panel */}
        <div className="w-[50%] md:w-1/2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Hand Tracking Controls</h2>

            {/* Main controls */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={toggleTracking}
                className={`px-4 py-2 rounded-md text-white ${
                  isTracking
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {isTracking ? "Stop Tracking" : "Start Tracking"}
              </button>

              <button
                onClick={() => setDebugMode(!debugMode)}
                className={`px-4 py-2 rounded-md ${
                  debugMode
                    ? "bg-purple-500 hover:bg-purple-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                {debugMode ? "Hide Debug View" : "Show Debug View"}
              </button>
            </div>

            {/* Mode Selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Mouse Mode</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setMouseMode("hover")}
                  className={`px-3 py-2 rounded ${
                    mouseMode === "hover"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Hover Mode
                </button>
                <button
                  onClick={() => setMouseMode("click")}
                  className={`px-3 py-2 rounded ${
                    mouseMode === "click"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Click Mode (Pinch to Click)
                </button>
              </div>
            </div>

            {/* Sensitivity Slider */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label htmlFor="sensitivity" className="font-semibold">
                  Cursor Sensitivity
                </label>
                <span>{sensitivity}x</span>
              </div>
              <input
                id="sensitivity"
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={sensitivity}
                onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Smoothing Slider */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label htmlFor="smoothing" className="font-semibold">
                  Smoothing
                </label>
                <span>{smoothing}</span>
              </div>
              <input
                id="smoothing"
                type="range"
                min="1"
                max="10"
                value={smoothing}
                onChange={(e) => setSmoothing(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 p-3 rounded-md">
              <h3 className="font-semibold mb-2 text-blue-700">
                Instructions:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Position your hand in view of the camera</li>
                <li>• Use your index finger tip to control the cursor</li>
                <li>
                  • In Click Mode, pinch your thumb and index finger together to
                  click
                </li>
                <li>• Enable Debug View to see hand landmarks</li>
                <li>• Adjust sensitivity and smoothing for better control</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Virtual cursor */}
      <div
        id="virtual-cursor"
        className="fixed w-4 h-4 bg-red-400 rounded-full pointer-events-none z-50 shadow-md"
        style={{
          display: isTracking ? "block" : "none",
          transition: "transform 0.1s ease-out",
        }}
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

