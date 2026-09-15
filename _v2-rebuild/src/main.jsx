import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Order matters: fonts declare the families, tokens declare the values,
// base consumes both. Nothing else may be imported before these.
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
