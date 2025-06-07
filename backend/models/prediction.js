const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  battingTeam: {
    type: String,
    required: true
  },
  bowlingTeam: {
    type: String,
    required: true
  },
  currentScore: {
    type: Number,
    required: true
  },
  overs: {
    type: Number,
    required: true
  },
  wickets: {
    type: Number,
    required: true
  },
  runsLast5: {
    type: Number,
    required: true
  },
  wicketsLast5: {
    type: Number,
    required: true
  },
  predictedScore: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Prediction', predictionSchema);