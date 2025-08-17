import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'

// axios.js or before any axios request
import axios from 'axios';

axios.defaults.withCredentials = true;


createRoot(document.getElementById('root')).render(
 
 <AuthProvider>
  <App/>
</AuthProvider>

)
