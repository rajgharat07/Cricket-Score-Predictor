import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import PredictorScreen from './screens/PredictorScreen';
import HistoryScreen from './screens/HistoryScreen';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/predict" element={<PredictorScreen />} />
          <Route path="/history" element={<HistoryScreen />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;