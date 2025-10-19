import React from 'react';
import ReactDOM from 'react-dom/client';
import CustomerApp from './App';
import '../../src/styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CustomerApp />
  </React.StrictMode>
);

