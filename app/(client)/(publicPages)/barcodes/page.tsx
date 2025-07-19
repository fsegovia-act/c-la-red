"use client";

import { useState } from 'react';
import BarcodeScanner from '../../_components/barcodeScanner/BarcodeScanner';

type ResultsInterface = {
  code: string,
  product: {
    name: string,
    description: string,
    price: number
  }
};

const ProductSearch = () => {
  const [searchResult, setSearchResult] = useState<ResultsInterface | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const results: ResultsInterface[] = [
    {
        code: '1',
        product: {
            name: 'nombre 1',
            description: 'description 1',
            price: 10,
        }
    },
        {
        code: '2',
        product: {
            name: 'nombre 2',
            description: 'description 2',
            price: 20,
        }
    },
        {
        code: '3',
        product: {
            name: 'nombre 3',
            description: 'description 3',
            price: 30,
        }
    }
  ]

  const handleCodeDetected = async (code: string) => {
    setLoading(true);
    setError('');
    
    try {
        const result: ResultsInterface | undefined  = results.find(p => (p.code === code));
        if (!result) return setSearchResult(null);
        setSearchResult({ code: result.code, product: result.product });
      
    } catch (err) {
      setError('Error al buscar producto: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScannerError = (errorMessage) => {
    setError('Error del escáner: ' + errorMessage);
  };

  const resetSearch = () => {
    setSearchResult(null);
    setError('');
  };

  return (
    <div className="container">
      <h1>Búsqueda de Productos</h1>
      
      {!searchResult && (
        <BarcodeScanner 
          onCodeDetected={handleCodeDetected}
          onError={handleScannerError}
        />
      )}
      
      {loading && (
        <div className="loading">
          <p>Buscando producto...</p>
        </div>
      )}
      
      {error && (
        <div className="error">
          <p>{error}</p>
          <button onClick={resetSearch}>Intentar de nuevo</button>
        </div>
      )}
      
      {searchResult && (
        <div className="result">
          <h2>Producto Encontrado</h2>
          <p><strong>Código:</strong> {searchResult.code}</p>
          <div className="product-info">
            <h3>{searchResult.product.name}</h3>
            <p>{searchResult.product.description}</p>
            <p><strong>Precio:</strong> ${searchResult.product.price}</p>
          </div>
          <button onClick={resetSearch}>Buscar Otro Producto</button>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;