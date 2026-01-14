import React from 'react'
import ReactDOM from 'react-dom/client'
import { PrimeReactProvider } from "primereact/api";
import App from './App'


// PrimeReact core + theme + icons
import "primereact/resources/themes/md-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import "./index.css";

import { AuthProvider } from "./context/AuthContext.jsx";
import { GigsProvider } from "./context/GigsContext.jsx";
import { BidsProvider } from "./context/BidsContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <GigsProvider>
      <BidsProvider>
        <PrimeReactProvider>
          <App />
        </PrimeReactProvider>
      </BidsProvider>
    </GigsProvider>
  </AuthProvider>


)