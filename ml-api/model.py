import pandas as pd
import numpy as np

# List of teams supported by the model
CONST_TEAMS = [
    'Chennai Super Kings', 
    'Delhi Daredevils', 
    'Kings XI Punjab',
    'Kolkata Knight Riders', 
    'Mumbai Indians', 
    'Rajasthan Royals',
    'Royal Challengers Bangalore',
    'Sunrisers Hyderabad'
]

def create_prediction_array(batting_team, bowling_team, runs, wickets, overs, runs_last_5, wickets_last_5):
    """
    Creates a properly formatted input array for model prediction
    
    Args:
        batting_team (str): Name of the batting team
        bowling_team (str): Name of the bowling team
        runs (float): Current runs scored
        wickets (int): Current wickets fallen
        overs (float): Current overs completed
        runs_last_5 (float): Runs scored in last 5 overs
        wickets_last_5 (int): Wickets fallen in last 5 overs
        
    Returns:
        DataFrame: Properly formatted features for model prediction
    """
    # Initialize empty array
    prediction_array = []
    
    # One-hot encode batting team
    for team in CONST_TEAMS:
        prediction_array.append(1 if batting_team == team else 0)
    
    # One-hot encode bowling team
    for team in CONST_TEAMS:
        prediction_array.append(1 if bowling_team == team else 0)
    
    # Add match statistics
    prediction_array.extend([runs, wickets, overs, runs_last_5, wickets_last_5])
    
    # Create feature names - same order as used during training
    feature_names = []
    for team in CONST_TEAMS:
        feature_names.append(f'batting_team_{team}')
    for team in CONST_TEAMS:
        feature_names.append(f'bowling_team_{team}')
    feature_names.extend(['runs', 'wickets', 'overs', 'runs_last_5', 'wickets_last_5'])
    
    # Create DataFrame with proper column names
    prediction_df = pd.DataFrame([prediction_array], columns=feature_names)
    
    return prediction_df

def train_and_save_model(data_path, output_path="random_forest_model.pkl"):
    """
    Train the Random Forest model and save it as a pickle file
    
    Args:
        data_path (str): Path to the CSV dataset
        output_path (str): Path to save the trained model
    """
    import pandas as pd
    import numpy as np
    from sklearn.preprocessing import LabelEncoder, OneHotEncoder
    from sklearn.compose import ColumnTransformer
    from sklearn.ensemble import RandomForestRegressor
    from sklearn.model_selection import train_test_split
    import joblib
    
    # Read data
    data = pd.read_csv(data_path)
    
    # Remove irrelevant columns
    irrelevant = ['mid', 'date', 'venue', 'batsman', 'bowler', 'striker', 'non-striker']
    data = data.drop(irrelevant, axis=1)
    
    # Filter for consistent teams
    data = data[(data['batting_team'].isin(CONST_TEAMS)) & (data['bowling_team'].isin(CONST_TEAMS))]
    
    # Filter for matches with at least 5 overs
    data = data[data['overs'] >= 5.0]
    
    # Label encoding
    le = LabelEncoder()
    for col in ['batting_team', 'bowling_team']:
        data[col] = le.fit_transform(data[col])
    
    # One-hot encoding
    columnTransformer = ColumnTransformer([('encoder', OneHotEncoder(), [0, 1])], remainder='passthrough')
    data = np.array(columnTransformer.fit_transform(data))
    
    # Setup column names
    cols = []
    for team in CONST_TEAMS:
        cols.append(f'batting_team_{team}')
    for team in CONST_TEAMS:
        cols.append(f'bowling_team_{team}')
    cols.extend(['runs', 'wickets', 'overs', 'runs_last_5', 'wickets_last_5', 'total'])
    
    # Create DataFrame with encoded data
    df = pd.DataFrame(data, columns=cols)
    
    # Split features and target
    features = df.drop(['total'], axis=1)
    labels = df['total']
    
    # Train-test split
    train_features, test_features, train_labels, test_labels = train_test_split(
        features, labels, test_size=0.20, shuffle=True
    )
    
    # Train Random Forest model
    forest = RandomForestRegressor(n_estimators=100, random_state=42)
    forest.fit(train_features, train_labels)
    
    # Save the trained model
    joblib.dump(forest, output_path)
    
    # Return model accuracy
    train_score = forest.score(train_features, train_labels) * 100
    test_score = forest.score(test_features, test_labels) * 100
    
    return {
        "train_score": train_score,
        "test_score": test_score
    }