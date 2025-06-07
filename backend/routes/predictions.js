const express = require('express');
const router = express.Router();
const predictionsController = require('../controllers/predictions');

// Get all predictions
router.get('/', predictionsController.getAllPredictions);

// Get a single prediction by ID
router.get('/:id', predictionsController.getPredictionById);

// Create a new prediction
router.post('/', predictionsController.createPrediction);

// Get teams list
router.get('/teams/list', predictionsController.getTeamsList);

module.exports = router;