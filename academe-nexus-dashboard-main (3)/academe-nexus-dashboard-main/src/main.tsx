import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <App />
);
// To use a custom domain like ypu.localhost, ensure your hosts file maps 127.0.0.1 ypu.localhost
// and access the app via http://ypu.localhost:8080
