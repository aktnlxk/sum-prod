import React, { useState } from 'react';
import './App.css';

const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [xInput, setXInput] = useState('');
  const [yInput, setYInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleCalculate = async () => {
    setError('');
    setResult(null);

    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}?x=${xInput}&y=${yInput}`
      );

      // Check if response is OK before parsing
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      
      const data = await response.json();

      if (data.type === 'error') {
        setError(data.message);
      } else if (data.type === 'success') {
        setResult({
          sum: data.sum,
          prod: data.prod
        });
      }
    } catch (err) {
      setError('Failed to connect to backend');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Calculate Sum and Product</h1>
      
      <input
        type="text"
        value={xInput}
        onChange={(e) => setXInput(e.target.value)}
        placeholder="Enter a number for X"
      />
      
      <input
        type="text"
        value={yInput}
        onChange={(e) => setYInput(e.target.value)}
        placeholder="Enter a number for Y"
      />
      
      <button onClick={handleCalculate}>Calculate</button>

      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="calcResult">
          <p>X + Y = {result.sum}</p>
          <p>X * Y = {result.prod}</p>
        </div>
      )}
    </div>
  );
}

export default App;
