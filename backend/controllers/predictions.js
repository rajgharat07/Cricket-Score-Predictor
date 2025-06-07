const axios = require('axios');
const Prediction = require('../models/prediction');

// ML API URL from environment variable
const ML_API_URL = process.env.ML_API_URL || 'https://cricket-score-predictor-ml.onrender.com';

// Get all predictions
exports.getAllPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find().sort({ createdAt: -1 });
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching predictions', error: error.message });
  }
};

// Get a single prediction by ID
exports.getPredictionById = async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id);
    if (!prediction) {
      return res.status(404).json({ message: 'Prediction not found' });
    }
    res.json(prediction);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prediction', error: error.message });
  }
};

// Create a new prediction
exports.createPrediction = async (req, res) => {
  try {
    // Make request to ML API
    const response = await axios.post(`${ML_API_URL}/predict`, req.body);
    
    // Save prediction to database
    const newPrediction = new Prediction({
      battingTeam: response.data.batting_team,
      bowlingTeam: response.data.bowling_team,
      currentScore: response.data.current_score,
      overs: response.data.overs,
      predictedScore: response.data.predicted_score,
      wickets: req.body.wickets,
      runsLast5: req.body.runs_last_5,
      wicketsLast5: req.body.wickets_last_5
    });
    
    const savedPrediction = await newPrediction.save();
    res.status(201).json(savedPrediction);
  } catch (error) {
    // Handle ML API specific errors
    if (error.response) {
      return res.status(error.response.status).json({ 
        message: 'Error from prediction service', 
        error: error.response.data 
      });
    }
    res.status(500).json({ message: 'Error creating prediction', error: error.message });
  }
};

// Get teams list from ML API
exports.getTeamsList = async (req, res) => {
  try {
    const response = await axios.get(`${ML_API_URL}/teams`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teams', error: error.message });
  }
};