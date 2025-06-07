import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { getAllPredictions } from '../services/api';
import './HistoryScreen.css';

const HistoryScreen = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        const data = await getAllPredictions();
        setPredictions(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch prediction history. Please try again later.');
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="history-screen">
      <h1>Prediction History</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {predictions.length === 0 ? (
        <div className="no-predictions">
          <p>You haven't made any predictions yet.</p>
          <Link to="/predict" className="btn">Make a Prediction</Link>
        </div>
      ) : (
        <>
          <div className="predictions-count">
            <p>Showing {predictions.length} predictions</p>
          </div>
          
          <div className="predictions-list">
            {predictions.map((prediction) => (
              <div key={prediction._id} className="prediction-card">
                <div className="prediction-header">
                  <h3>{prediction.battingTeam} vs {prediction.bowlingTeam}</h3>
                  <span className="prediction-date">
                    {new Date(prediction.createdAt).toLocaleDateString()} at {new Date(prediction.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="prediction-details">
                  <div className="prediction-score">
                    <p>
                      <span className="score-label">Current Score:</span> 
                      <span className="score-value">{prediction.currentScore}/{prediction.wickets}</span>
                    </p>
                    <p>
                      <span className="score-label">Overs:</span> 
                      <span className="score-value">{prediction.overs}</span>
                    </p>
                    <p>
                      <span className="score-label">Last 5 overs:</span> 
                      <span className="score-value">{prediction.runsLast5} runs, {prediction.wicketsLast5} wickets</span>
                    </p>
                  </div>
                  
                  <div className="prediction-result">
                    <p className="predicted-score">
                      <span className="score-label">Predicted Score:</span>
                      <span className="score-value">{prediction.predictedScore}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="history-actions">
            <Link to="/predict" className="btn">Make Another Prediction</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default HistoryScreen;