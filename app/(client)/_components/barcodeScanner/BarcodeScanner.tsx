import { useEffect, useRef, useState } from "react";
import Quagga from "quagga";

const BarcodeScanner = ({ onCodeDetected, onError, code, setCode }) => {
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
        Quagga.stop();
      }
    };
  }, [isScanning]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">
        Escáner de Códigos de Barras
      </h2>

      <div className="bg-sky-50 border border-sky-500 rounded-lg p-4 mb-4">
        <div className="bg-sky-500 text-white p-2 my-1 rounded font-mono text-lg">
          Code: {code}
        </div>
        <div className="bg-sky-500 text-white p-2 my-1 rounded font-mono text-lg">
          {isScanning ? "Escaneando..." : "Escáner Detenido"}
        </div>

        <div className="my-4 text-left">
          {!isScanning ? (
            <button
              onClick={startScanner}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded border-none cursor-pointer transition-colors mr-2"
            >
              Iniciar
            </button>
          ) : (
            <button
              onClick={stopScanner}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded border-none cursor-pointer transition-colors mr-2"
            >
              Detener
            </button>
          )}

          {code && (
            <button
              onClick={clearDetectedCode}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded border-none cursor-pointer transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div
        ref={scannerRef}
        className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg relative overflow-hidden bg-black"
      />
    </div>
  );
};

export default BarcodeScanner;
