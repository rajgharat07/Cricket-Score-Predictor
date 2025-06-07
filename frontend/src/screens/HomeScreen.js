import React from 'react';
import { Link } from 'react-router-dom';
import './HomeScreen.css';

const HomeScreen = () => {
  return (
    <div className="home-screen">
      <div className="hero">
        <h1>Cricket Score Predictor</h1>
        <p>Predict IPL cricket match scores with our advanced machine learning model</p>
        <Link to="/predict" className="btn btn-accent">Make a Prediction</Link>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <h2>Accurate Predictions</h2>
          <p>Our machine learning model is trained on historical IPL data to provide accurate score predictions.</p>
        </div>
        <div className="feature-card">
          <h2>Real-time Analysis</h2>
          <p>Get instant predictions based on current match statistics and historical team performance.</p>
        </div>
        <div className="feature-card">
          <h2>Track History</h2>
          <p>Review your past predictions and their accuracy to improve your cricket analysis skills.</p>
        </div>
      </div>
      
      <div className="how-it-works">
        <h2>How It Works</h2>
        <ol className="steps">
          <li>Enter the current match details including batting team, bowling team, and current score</li>
          <li>Provide information about the recent performance (last 5 overs)</li>
          <li>Get an instant prediction of the final score based on our machine learning model</li>
          <li>Save your prediction to track its accuracy later</li>
        </ol>
      </div>
    </div>
  );
};

export default HomeScreen;