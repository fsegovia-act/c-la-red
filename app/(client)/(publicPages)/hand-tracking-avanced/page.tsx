"use client";

import dynamic from "next/dynamic";

const HandTrackingAdvanced = dynamic(
  () => import("../../_components/handTracking/HandTrackingAdvanced"),
  { ssr: false }
);

export default function HandTrackingPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Hand Tracking Mouse Control</h1>

      <div className="mb-6">
        <p className="text-gray-700">
          This demo uses MediaPipe Hands to track your hand movements through
          your webcam and translate them into cursor movements. Position your
          hand in front of the camera and use your index finger to control the
          virtual cursor.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden p-4">
        <HandTrackingAdvanced />
      </div>

      <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h2 className="text-xl font-bold text-blue-800 mb-2">
          Technical Information
        </h2>
        <p className="text-blue-700 mb-4">
          This component uses MediaPipe's hand tracking capabilities to analyze
          your webcam feed and detect hand positions in real-time. It loads
          MediaPipe libraries directly from CDN to avoid build and import
          issues.
        </p>
        <h3 className="font-bold text-blue-800 mb-1">How it works:</h3>
        <ul className="list-disc list-inside text-blue-700 space-y-1 mb-4">
          <li>MediaPipe Hands detects 21 landmarks on your hand</li>
          <li>
            Your index fingertip (landmark #8) controls the cursor position
          </li>
          <li>All processing happens locally in your browser</li>
          <li>Toggle debug mode to see the detected hand landmarks</li>
        </ul>
        <p className="text-blue-700 text-sm">
          Note: You must grant camera access when prompted. This demo uses a
          virtual cursor as browsers don't allow direct control of the system
          cursor for security reasons.
        </p>
      </div>
    </div>
  );
}
