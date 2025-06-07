from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
import uvicorn

# Initialize FastAPI app
app = FastAPI(title="Cricket Score Prediction API",
              description="API for predicting IPL cricket scores",
              version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model
model = joblib.load("random_forest_model.pkl")

# Define request model
class PredictionRequest(BaseModel):
    batting_team: str
    bowling_team: str
    runs: float
    wickets: int
    overs: float
    runs_last_5: float
    wickets_last_5: int
    
# Define response model
class PredictionResponse(BaseModel):
    predicted_score: int
    batting_team: str
    bowling_team: str
    current_score: int
    overs: float

# Teams list
CONST_TEAMS = [
    'Kolkata Knight Riders', 
    'Chennai Super Kings', 
    'Rajasthan Royals',
    'Mumbai Indians', 
    'Kings XI Punjab', 
    'Royal Challengers Bangalore',
    'Delhi Daredevils', 
    'Sunrisers Hyderabad'
]

@app.get("/")
def read_root():
    return {"message": "Welcome to the Cricket Score Prediction API"}

@app.get("/teams")
def get_teams():
    return {"teams": CONST_TEAMS}

@app.post("/predict", response_model=PredictionResponse)
def predict_score(request: PredictionRequest):
    # Validate teams
    if request.batting_team not in CONST_TEAMS:
        raise HTTPException(status_code=400, detail=f"Invalid batting team. Must be one of {CONST_TEAMS}")
    if request.bowling_team not in CONST_TEAMS:
        raise HTTPException(status_code=400, detail=f"Invalid bowling team. Must be one of {CONST_TEAMS}")
    if request.batting_team == request.bowling_team:
        raise HTTPException(status_code=400, detail="Batting and bowling teams cannot be the same")
    
    # Validate other inputs
    if request.overs < 5.0 or request.overs > 20.0:
        raise HTTPException(status_code=400, detail="Overs must be between 5.0 and 20.0")
    if request.wickets < 0 or request.wickets > 10:
        raise HTTPException(status_code=400, detail="Wickets must be between 0 and 10")
    
    # Create feature array for prediction
    try:
        from model import create_prediction_array
        features = create_prediction_array(
            batting_team=request.batting_team,
            bowling_team=request.bowling_team,
            runs=request.runs,
            wickets=request.wickets,
            overs=request.overs,
            runs_last_5=request.runs_last_5,
            wickets_last_5=request.wickets_last_5
        )
        
        # Make prediction
        prediction = model.predict(features)
        predicted_score = int(round(prediction[0]))
        
        return {
            "predicted_score": predicted_score,
            "batting_team": request.batting_team,
            "bowling_team": request.bowling_team,
            "current_score": int(request.runs),
            "overs": request.overs
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)