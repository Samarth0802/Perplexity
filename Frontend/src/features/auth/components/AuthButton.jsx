import React from 'react'

const AuthButton = ({ children, loading, onClick, type = "button", variant = "primary" }) => {
  const variants = {
    primary: "bg-[#6366f1] text-white hover:bg-[#585af2] active:scale-95",
    secondary: "bg-[#202222] text-[#ececec] hover:bg-[#2a2c2c] active:scale-95 border border-white/5",
    outline: "bg-transparent border border-white/10 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/5"
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`
        relative w-full py-3.5 px-4 rounded-2xl font-bold text-[15px]
        flex items-center justify-center gap-2 overflow-hidden
        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${variants[variant]}
        ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {loading ? (
        <div className="flex items-center gap-2 text-white">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="font-semibold">Processing...</span>
        </div>
      ) : children}
    </button>
  )
}

export default AuthButton
