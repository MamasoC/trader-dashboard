// src/App.jsx
import React from 'react';
import NewsComponent from './NewsComponent';
import './index.css';

function App() {
  return (
    <div className="w-full bg-gray-100 min-h-screen p-8">
      <div className="max-w-12xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Trading Dashboard</h1>
        <NewsComponent />
      </div>
    </div>
  );
}

export default App;
