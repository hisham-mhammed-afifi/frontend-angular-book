import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import 'highlight.js/styles/github.css';
import './styles/hljs-dark.css';
import './styles/globals.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/topic/:topicId" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
