import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App';

const container = document.getElementById('root'); // Or your main app container ID

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Failed to find the root element for React app mounting.');
}