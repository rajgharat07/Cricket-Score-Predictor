"""
Train and save the IPL score prediction model

Usage:
    python train.py --data path/to/data.csv --output model_filename.pkl
"""
import argparse
from model import train_and_save_model

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train IPL cricket score prediction model")
    parser.add_argument("--data", type=str, required=True, help="Path to the CSV dataset")
    parser.add_argument("--output", type=str, default="random_forest_model.pkl", 
                        help="Output filename for the trained model")
    
    args = parser.parse_args()
    
    print(f"Training model using data from: {args.data}")
    print(f"Model will be saved to: {args.output}")
    
    try:
        results = train_and_save_model(args.data, args.output)
        print("Model training complete!")
        print(f"Training accuracy: {results['train_score']:.2f}%")
        print(f"Testing accuracy: {results['test_score']:.2f}%")
    except Exception as e:
        print(f"Error during model training: {str(e)}")