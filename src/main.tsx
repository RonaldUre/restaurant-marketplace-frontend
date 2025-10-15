// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./features/auth/context/AuthProvider.tsx";
import { CartProvider } from "./context/CartProvider.tsx"; 

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <CartProvider>
        <App />
        </CartProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);