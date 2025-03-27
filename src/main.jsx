// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Ensure the correct path to App.jsx

// Ensure you're rendering to the correct DOM element
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />  {/* Your main App component */}
  </React.StrictMode>
);