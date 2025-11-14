"use client"
import { useState, useEffect } from "react";
import { X, CircleX, CheckCircle, Info, AlertTriangle } from "lucide-react";

// Toast Types
export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Toast Context/Store (simple implementation)
let toastListeners: ((toast: Toast) => void)[] = [];

export const showToast = (
  message: string,
  type: ToastType = "info",
  duration = 5000
) => {
  const toast: Toast = {
    id: Math.random().toString(36).substring(7),
    message,
    type,
    duration,
  };
  toastListeners.forEach((listener) => listener(toast));
};

// Toast Component
const ToastItem = ({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: () => void;
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onClose, 300);
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success-6" />,
    error: <CircleX className="w-5 h-5 text-error-5" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning-5" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const colors = {
    success:
      "border-success-6",
    error: "border-error-5",
    warning:
      "border-warning-5",
    info: "border-blue-400",
  };


  return (
    <div
      className={`
        relative flex items-center gap-3 px-[15px] py-3.5 rounded-[11px] border-b-2 bg-neutral-1 dark:bg-neutral-7
        ${colors[toast.type]}
        ${isExiting ? "animate-slide-out" : "animate-slide-in"}
        min-w-[300px] max-w-[450px]
      `}
    >
      {icons[toast.type]}
      <p className={`flex flex-col gap-1  `}>
        <span className="text-neutral-6 dark:text-neutral-0 text-sm font-medium capitalize">{toast.type}</span>
        <span className=" text-neutral-5 dark:text-neutral-4 font-normal text-xs">{toast.message}</span>        
      </p>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(onClose, 300);
        }}
        className={`absolute cursor-pointer top-2 right-2 transition`}
      >
        <X className="w-4 h-4 text-neutral-5 hover:text-neutral-3" />
      </button>
    </div>
  );
};

// Toast Container
export const ToastContainer = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts((prev) => [...prev, toast]);
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Demo Component
const ToastDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <ToastContainer />

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Toast Notification System
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Try Different Toast Types
          </h2>

          <button
            onClick={() =>
              showToast("Operation completed successfully!", "success")
            }
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition"
          >
            Show Success Toast
          </button>

          <button
            onClick={() =>
              showToast("Something went wrong. Please try again.", "error")
            }
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition"
          >
            Show Error Toast
          </button>

          <button
            onClick={() =>
              showToast(
                "Please review your input before submitting.",
                "warning"
              )
            }
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-lg transition"
          >
            Show Warning Toast
          </button>

          <button
            onClick={() =>
              showToast("Your changes have been saved automatically.", "info")
            }
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition"
          >
            Show Info Toast
          </button>

          <button
            onClick={() => {
              showToast("First notification", "info");
              setTimeout(
                () => showToast("Second notification", "success"),
                500
              );
              setTimeout(
                () => showToast("Third notification", "warning"),
                1000
              );
            }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition"
          >
            Show Multiple Toasts
          </button>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Usage Example
          </h2>
          <pre className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm">
            <code className="text-gray-800 dark:text-gray-200">
              {`import { showToast } from './toast';

// Show different types of toasts
showToast("Success message!", "success");
showToast("Error message!", "error");
showToast("Warning message!", "warning");
showToast("Info message!", "info");

// Custom duration (default is 5000ms)
showToast("Quick message", "info", 2000);`}
            </code>
          </pre>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slide-out {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-slide-out {
          animation: slide-out 0.3s ease-in;
        }
      `}</style>
    </div>
  );
};

export default ToastDemo;
