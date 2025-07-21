import { useEffect, useRef, useState } from "react";
import Quagga from "quagga";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

const BarcodeScanner = ({
  onCodeDetected,
  onError,
  code,
  setCode,
  fnCallback,
}) => {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  const startScanner = () => {
    if (scannerRef.current) {
      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: scannerRef.current,
            constraints: {
              width: 640,
              height: 480,
              facingMode: "environment",
            },
          },
          locator: {
            patchSize: "large",
            halfSample: false,
          },
          numOfWorkers: 4,
          frequency: 5,
          decoder: {
            readers: ["code_128_reader"],
          },
          locate: true,
          debug: {
            showCanvas: true,
            showPatches: true,
            showFoundPatches: true,
            showSkeleton: true,
            showLabels: true,
            showPatchLabels: true,
            showRemainingPatchLabels: true,
            boxFromPatches: {
              showTransformed: true,
              showTransformedBox: true,
              showBB: true,
            },
          },
        },
        (err) => {
          if (err) {
            onError && onError(err.message);
            return;
          }

          Quagga.start();
          setIsScanning(true);
        }
      );

      Quagga.onDetected(handleDetected);
    }
  };

  const stopScanner = () => {
    if (isScanning) {
      setIsScanning(false);
      Quagga.stop();
      Quagga.offDetected(handleDetected);
    }
  };

  const playBeepSound = () => {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext!)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.8, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.2
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.log("The sound could not be played:", error);
    }
  };

  const handleDetected = (result) => {
    const detectedCode = result.codeResult.code;
    const format = result.codeResult.format;
    const quality =
      result.codeResult.decodedCodes
        .filter((code) => code.error !== undefined)
        .reduce((sum, code) => sum + code.error, 0) /
      result.codeResult.decodedCodes.length;

    if (detectedCode && detectedCode.length >= 6 && quality < 0.15) {
      if (detectedCode !== code) {
        onCodeDetected &&
          onCodeDetected({
            code: detectedCode,
            format: format,
            quality: quality,
          });
      }
    }
  };

  const clearDetectedCode = () => setCode("");

  useEffect(() => {
    return () => {
      if (isScanning) {
        setIsScanning(false);
        Quagga.stop();
        Quagga.offDetected(handleDetected);
      }
    };
  }, [isScanning]);

  useEffect(() => {
    if (code && code.length >= 6) {
      playBeepSound();
      stopScanner();
      fnCallback();
    }
  }, [code, fnCallback]);

  useEffect(() => {
    if (scannerRef.current) {
      startScanner();
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">
        {code ? `Código: ${code}` : "Escaneando..."}
      </h2>

      <div
        ref={scannerRef}
        className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg relative overflow-hidden bg-black"
      />
    </div>
  );
};

export default BarcodeScanner;
