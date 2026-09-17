import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)


// WORLD UI: prevent copying app text while keeping form fields usable.
document.addEventListener('copy', (e) => {
  if (!['INPUT','TEXTAREA'].includes(e.target?.tagName)) e.preventDefault()
})
document.addEventListener('cut', (e) => {
  if (!['INPUT','TEXTAREA'].includes(e.target?.tagName)) e.preventDefault()
})
document.addEventListener('contextmenu', (e) => {
  if (!['INPUT','TEXTAREA'].includes(e.target?.tagName)) e.preventDefault()
})
