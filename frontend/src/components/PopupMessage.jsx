import React from 'react'
import { XCircle, CheckCircle, Info } from "lucide-react"

const typeStyles = {
  success: {
    bg: "bg-green-600/90",
    border: "border-green-400",
    icon: <CheckCircle className="w-6 h-6 text-green-300" />
  },
  failure: {
    bg: "bg-red-600/90",
    border: "border-red-400",
    icon: <XCircle className="w-6 h-6 text-red-300" />
  },
  info: {
    bg: "bg-yellow-600/90",
    border: "border-yellow-400",
    icon: <Info className="w-6 h-6 text-yellow-300" />
  }
}

const PopupMessage = ({ message, type = "info", onClose }) => {
  const style = typeStyles[type] || typeStyles.info

  return (
    <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 min-w-[260px] max-w-xs rounded-2xl shadow-2xl border-2 ${style.bg} ${style.border} flex items-center gap-3 font-orbitron animate-popup`}>
      {style.icon}
      <span className="flex-1 text-white font-bold tracking-wide">{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-2 p-1 rounded hover:bg-white/10 transition">
          <XCircle className="w-5 h-5 text-white" />
        </button>
      )}
      <style>
        {`
          .font-orbitron {
            font-family: 'Orbitron', 'Roboto Mono', monospace;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          @keyframes popup {
            0% { opacity: 0; transform: translateY(-20px) scale(0.95);}
            100% { opacity: 1; transform: translateY(0) scale(1);}
          }
          .animate-popup {
            animation: popup 0.5s cubic-bezier(.4,0,.2,1);
          }
        `}
      </style>
    </div>
  )
}

export default PopupMessage