import { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';

const BarcodeScanner = ({ onCodeDetected, onError }) => {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  const startScanner = () => {
    if (scannerRef.current) {
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment" // Cámara trasera
          }
        },
        locator: {
          patchSize: "medium",
          halfSample: true
        },
        numOfWorkers: 2,
        frequency: 10,
        decoder: {
          readers: [
            "ean_reader",      // EAN-13
            "ean_8_reader",    // EAN-8
            "code_128_reader", // Code 128
            "code_39_reader",  // Code 39
            "codabar_reader"   // Codabar
          ]
        },
        locate: true
      }, (err) => {
        if (err) {
          console.error('Error inicializando Quagga:', err);
          onError && onError(err.message);
          return;
        }
        
        Quagga.start();
        setIsScanning(true);
      });

      Quagga.onDetected(handleDetected);
    }
  };

  const stopScanner = () => {
    if (isScanning) {
      Quagga.stop();
      Quagga.offDetected(handleDetected);
      setIsScanning(false);
    }
  };

  const handleDetected = (result) => {
    const code = result.codeResult.code;
    
    // Validar código
    if (code && code.length >= 8) {
      onCodeDetected && onCodeDetected(code);
      stopScanner();
    }
  };

  useEffect(() => {
    return () => {
      if (isScanning) {
        Quagga.stop();
      }
    };
  }, [isScanning]);

  return (
    <div className="barcode-scanner">
      <div 
        ref={scannerRef} 
        className="scanner-container"
        style={{ width: '100%', height: '400px' }}
      />
      
      <div className="scanner-controls">
        {!isScanning ? (
          <button onClick={startScanner} className="btn-start">
            Iniciar Escáner
          </button>
        ) : (
          <button onClick={stopScanner} className="btn-stop">
            Detener Escáner
          </button>
        )}
      </div>
      
      <style jsx>{`
        .scanner-container {
          border: 2px dashed #ccc;
          border-radius: 8px;
          position: relative;
          overflow: hidden;
        }
        
        .scanner-controls {
          margin-top: 1rem;
          text-align: center;
        }
        
        .btn-start, .btn-stop {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
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
      `}</style>
    </div>
  );
};

export default BarcodeScanner;