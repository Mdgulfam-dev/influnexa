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
import App from './App.jsx'
import './faq.css'
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
)
