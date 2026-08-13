import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, Info, X } from "@phosphor-icons/react";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const addToast = useCallback((message, type = "info") => {
    const id = ++idCounter;
    setToasts((t) => [...t.slice(-2), { id, message, type }]); // max 3
    setTimeout(() => dismiss(id), 4000);
  }, [dismiss]);

  const toast = {
    success: (msg) => addToast(msg, "success"),
    error:   (msg) => addToast(msg, "error"),
    info:    (msg) => addToast(msg, "info"),
  };

  const iconMap = {
    success: <CheckCircle size={18} weight="fill" style={{ color: "#6FCF97", flexShrink: 0 }} />,
    error:   <XCircle    size={18} weight="fill" style={{ color: "#EB5757", flexShrink: 0 }} />,
    info:    <Info       size={18} weight="fill" style={{ color: "#DE9CA0", flexShrink: 0 }} />,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast animate-slideInRight">
            {iconMap[t.type]}
            <span style={{ fontSize: "0.875rem", lineHeight: 1.4, flex: 1 }}>{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              style={{ color: "rgba(243,236,229,0.5)", background: "none", border: "none", cursor: "pointer", padding: "0 2px", flexShrink: 0 }}
              aria-label="Dismiss"
            >
              <X size={14} weight="bold" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
