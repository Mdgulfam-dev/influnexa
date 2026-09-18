import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './workflow.css'
import './productreview.css'
import './industryshowcase.css'
import './whychooseus.css'
import './testimonial.css'
import './creatornetwork.css'
import './industries.css'
import './shareexperience.css'
import './dataavailable.css'
import App from './App.jsx'
import './faq.css'
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    <Analytics />
  </StrictMode>,
)
