import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "placeholder"}
    >
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
);

// 220550497171 - lbbpv50m44l8eejf86lm1ebt2u21gf8k.apps.googleusercontent.com;
// client sectret ->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
