import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const initialInput = {
  kloc: 50,
  cost_per_pm: 12000,
  mode: 'organic',
  RELY: 1.1,
  DATA: 1.08,
  CPLX: 1.17,
  TIME: 1.11,
  STOR: 1.2,
};

export default function CocomoEstimation() {
  const [input, setInput] = useState(initialInput);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: name === 'mode' ? value : Number(value),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('http://localhost:5000/api/estimate/cocomo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ['Effort (PM)', 'Time (months)', 'Team size', 'Total cost'],
    datasets: [
      {
        label: 'COCOMO Estimation',
        data: result
          ? [result.effort_pm, result.time_months, result.team_size, result.total_cost]
          : [0, 0, 0, 0],
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(255, 99, 132, 0.7)',
        ],
      },
    ],
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>COCOMO Estimation</h2>
      {Object.entries(input).map(([key, value]) => (
        <div key={key} style={{ marginBottom: '1rem' }}>
          <label style={{ fontWeight: 'bold', display: 'block' }}>{key}</label>
          {key === 'mode' ? (
            <select name={key} value={value} onChange={handleChange} style={{ width: '100%', padding: '0.4rem' }}>
              <option value="organic">organic</option>
              <option value="semi-detached">semi-detached</option>
              <option value="embedded">embedded</option>
            </select>
          ) : (
            <input
              type="number"
              name={key}
              value={value}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.4rem' }}
            />
          )}
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          padding: '0.6rem 1.2rem',
          fontWeight: 'bold',
          backgroundColor: loading ? '#ccc' : '#4caf50',
          color: 'white',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          borderRadius: '6px',
        }}
      >
        {loading ? 'Calculating...' : 'Calculate'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>Error: {error}</p>}

      {result && (
        <>
          <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold', border: '1px solid #ddd', padding: '8px' }}>Model</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.model}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', border: '1px solid #ddd', padding: '8px' }}>Effort (PM)</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.effort_pm.toFixed(2)}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', border: '1px solid #ddd', padding: '8px' }}>Time (months)</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.time_months.toFixed(2)}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', border: '1px solid #ddd', padding: '8px' }}>Team size</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.team_size.toFixed(2)}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', border: '1px solid #ddd', padding: '8px' }}>Total cost</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>${result.total_cost.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: '2rem' }}>
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        </>
      )}
    </div>
  );
}
