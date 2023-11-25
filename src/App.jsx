// src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsComponent from './NewsComponent';
import './index.css';

function App() {
  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Trading Dashboard</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="col-span-2">
          <NewsComponent />
        </div>

        {/* Future widgets */}
        {/* <div className="widget">Widget 2</div> */}
        {/* <div className="widget">Widget 3</div> */}
      </div>
    </div>
  );
}

export default App;
