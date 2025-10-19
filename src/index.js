import React from 'react';
import ReactDOM from 'react-dom/client';
import CustomerApp from './customer-app/App'; // Assuming the main customer app is here
import './styles/index.css'; // Corrected path for global styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CustomerApp />
  </React.StrictMode>
);
