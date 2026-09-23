import React from "react";
import ReactDOM from "react-dom/client";

import App
    from "./App";

import {
    AuthProvider,
} from "./features/auth/context/AuthContext";

import {
    ToastProvider,
} from "./shared/components/Toast/ToastContext";

import "./styles/index.css";
import "./styles/public-index.css";

ReactDOM.createRoot(
    document.getElementById("root")
).render(
    <React.StrictMode>
        <ToastProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ToastProvider>
    </React.StrictMode>
);