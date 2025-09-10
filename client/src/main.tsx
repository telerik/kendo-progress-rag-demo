import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// Kendo theme (choose one: default/material/bootstrap)
import '@progress/kendo-theme-bootstrap/dist/all.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)