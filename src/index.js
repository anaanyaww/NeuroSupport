import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Ensure this is the correct path to your App component
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
