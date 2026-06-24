import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 3.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          let typeStyles = '';
          let Icon = Info;
          
          switch (toast.type) {
            case 'success':
              typeStyles = 'border-l-4 border-l-green-500 shadow-[0_4px_20px_rgba(34,197,94,0.15)] text-green-400';
              Icon = CheckCircle2;
              break;
            case 'error':
              typeStyles = 'border-l-4 border-l-red-500 shadow-[0_4px_20px_rgba(239,68,68,0.15)] text-red-400';
              Icon = XCircle;
              break;
            case 'warning':
              typeStyles = 'border-l-4 border-l-yellow-500 shadow-[0_4px_20px_rgba(234,179,8,0.15)] text-yellow-400';
              Icon = AlertCircle;
              break;
            case 'info':
            default:
              typeStyles = 'border-l-4 border-l-primary shadow-[0_4px_20px_rgba(79,70,229,0.15)] text-indigo-400';
              Icon = Info;
              break;
          }

          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 p-4 rounded-xl bg-[#1e293b]/90 backdrop-blur-md border border-white/5 pointer-events-auto transition-all duration-300 animate-toast-in ${typeStyles}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm font-medium text-gray-200 leading-relaxed">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
