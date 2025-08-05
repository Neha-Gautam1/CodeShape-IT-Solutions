import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import { BrowserRouter } from 'react-router-dom';
// axios.js or before any axios request
import axios from 'axios';

axios.defaults.withCredentials = true;


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
 <AuthProvider>
  <App/>
</AuthProvider>
  </BrowserRouter>
)
