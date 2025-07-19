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
    <div className="barcode-scanner">
      <h2>Escáner de Códigos de Barras</h2>

      <div className="detected-code">
        <div className="field-info">Code: {code}</div>
        <div className="field-info">
          {isScanning ? "Escaneando..." : "Escáner Detenido"}
        </div>

        <div className="scanner-controls">
          {!isScanning ? (
            <button onClick={startScanner} className="btn-start">
              Iniciar
            </button>
          ) : (
            <button onClick={stopScanner} className="btn-stop">
              Detener
            </button>
          )}

          {code && (
            <button onClick={clearDetectedCode} className="btn-clear">
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div
        ref={scannerRef}
        className="scanner-container"
        style={{ width: "100%", height: "100px" }}
      />

      <style jsx>{`
        .barcode-scanner {
          max-width: 800px;
          margin: 0 auto;
          padding: 1rem;
        }

        .detected-code {
          background-color: #f0f9ff;
          border: 1px solid #0ea5e9;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .detected-code ul {
          list-style: none;
          padding: 0;
        }

        .field-info {
          background-color: #0ea5e9;
          color: white;
          padding: 0.5rem;
          margin: 0.25rem 0;
          border-radius: 4px;
          font-family: monospace;
          font-size: 1.1rem;
        }

        .scanner-container {
          border: 2px dashed #ccc;
          border-radius: 8px;
          position: relative;
          overflow: hidden;
          background-color: #000;
        }

        .scanner-controls {
          margin: 1rem 0;
          text-align: left;
        }

        .btn-start,
        .btn-stop,
        .btn-clear {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-right: 0.5rem;
        }

        .btn-start {
          background-color: #10b981;
          color: white;
        }

        .btn-start:hover {
          background-color: #059669;
        }

        .btn-stop {
          background-color: #ef4444;
          color: white;
        }

        .btn-stop:hover {
          background-color: #dc2626;
        }

        .btn-clear {
          background-color: #6b7280;
          color: white;
        }

        .btn-clear:hover {
          background-color: #4b5563;
        }
      `}</style>
    </div>
  );
};

export default BarcodeScanner;
