import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


import App from './App.jsx'
import { AuthProvider } from './services/AuthContext.jsx';
import "react-datepicker/dist/react-datepicker.css";
import './index.css';
createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <StrictMode>
    <App />
  </StrictMode>
  </AuthProvider>,

)
