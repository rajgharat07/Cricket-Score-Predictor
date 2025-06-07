
# 🏏 Cricket Score Predictor

A machine learning-based cricket score prediction web app.

## 📦 Installation

### 1. Unzip the project
Extract the ZIP file and open the project folder.

### 2. Install dependencies

#### 📁 Frontend & Backend
In the root folder, run:
npm install

#### 📁 ML Model
cd ml-model
pip install -r requirements.txt

---

## 🚀 Run

### ▶️ Frontend
npm run start

### ▶️ Backend
npm run dev

### ▶️ ML API Server
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
