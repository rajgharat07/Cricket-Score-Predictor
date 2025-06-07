import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { fetchTeams, createPrediction } from '../services/api';
import './PredictorScreen.css';

const PredictorScreen = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    batting_team: '',
    bowling_team: '',
    runs: '',
    wickets: '',
    overs: '',
    runs_last_5: '',
    wickets_last_5: ''
  });

  useEffect(() => {
    const getTeams = async () => {
      try {
        setLoading(true);
        const teamsData = await fetchTeams();
        setTeams(teamsData.teams);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch teams. Please try again.');
        setLoading(false);
      }
    };
    
    getTeams();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (!formData.batting_team || !formData.bowling_team) {
      setError('Please select both batting and bowling teams');
      return false;
    }
    
    if (formData.batting_team === formData.bowling_team) {
      setError('Batting and bowling teams cannot be the same');
      return false;
    }
    
    if (!formData.runs || !formData.overs || formData.wickets === '') {
      setError('Please fill in all required fields');
      return false;
    }
    
    const overs = parseFloat(formData.overs);
    if (overs < 5 || overs > 20) {
      setError('Overs must be between 5 and 20');
      return false;
    }
    
    const wickets = parseInt(formData.wickets);
    if (wickets < 0 || wickets > 10) {
      setError('Wickets must be between 0 and 10');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      // Convert string values to numbers
      const prediction = await createPrediction({
        ...formData,
        runs: parseFloat(formData.runs),
        wickets: parseInt(formData.wickets),
        overs: parseFloat(formData.overs),
        runs_last_5: parseFloat(formData.runs_last_5) || 0,
        wickets_last_5: parseInt(formData.wickets_last_5) || 0
      });
      
      setResult(prediction);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to create prediction. Please try again.');
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      batting_team: '',
      bowling_team: '',
      runs: '',
      wickets: '',
      overs: '',
      runs_last_5: '',
      wickets_last_5: ''
    });
    setResult(null);
    setError('');
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  if (loading && !result) {
    return <Loader />;
  }

  return (
    <div className="predictor-screen">
      <h1>Predict Cricket Score</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {!result ? (
        <div className="predictor-form-container">
          <form onSubmit={handleSubmit} className="predictor-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="batting_team" className="form-label">Batting Team *</label>
                <select
                  id="batting_team"
                  name="batting_team"
                  className="form-control"
                  value={formData.batting_team}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Batting Team</option>
                  {teams.map((team) => (
                    <option key={`batting-${team}`} value={team}>{team}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="bowling_team" className="form-label">Bowling Team *</label>
                <select
                  id="bowling_team"
                  name="bowling_team"
                  className="form-control"
                  value={formData.bowling_team}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Bowling Team</option>
                  {teams.map((team) => (
                    <option key={`bowling-${team}`} value={team}>{team}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="runs" className="form-label">Current Runs *</label>
                <input
                  type="number"
                  id="runs"
                  name="runs"
                  min="0"
                  className="form-control"
                  value={formData.runs}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="wickets" className="form-label">Current Wickets *</label>
                <input
                  type="number"
                  id="wickets"
                  name="wickets"
                  min="0"
                  max="10"
                  className="form-control"
                  value={formData.wickets}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="overs" className="form-label">Current Overs *</label>
                <input
                  type="number"
                  id="overs"
                  name="overs"
                  min="5"
                  max="20"
                  step="0.1"
                  className="form-control"
                  value={formData.overs}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="runs_last_5" className="form-label">Runs in Last 5 Overs</label>
                <input
                  type="number"
                  id="runs_last_5"
                  name="runs_last_5"
                  min="0"
                  className="form-control"
                  value={formData.runs_last_5}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="wickets_last_5" className="form-label">Wickets in Last 5 Overs</label>
                <input
                  type="number"
                  id="wickets_last_5"
                  name="wickets_last_5"
                  min="0"
                  max="10"
                  className="form-control"
                  value={formData.wickets_last_5}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn">Predict Score</button>
              <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="prediction-result">
          <div className="result-card">
            <h2>Prediction Result</h2>
            <div className="result-content">
              <div className="teams-info">
                <p><strong>Batting Team:</strong> {result.battingTeam}</p>
                <p><strong>Bowling Team:</strong> {result.bowlingTeam}</p>
              </div>
              
              <div className="score-info">
                <p><strong>Current Score:</strong> {result.currentScore}/{formData.wickets} ({result.overs} overs)</p>
                <p className="predicted-score"><strong>Predicted Final Score:</strong> {result.predictedScore}</p>
              </div>
            </div>
            
            <div className="result-actions">
              <button type="button" className="btn" onClick={handleReset}>Make Another Prediction</button>
              <button type="button" className="btn btn-secondary" onClick={handleViewHistory}>View History</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictorScreen;