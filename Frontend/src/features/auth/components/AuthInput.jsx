import React from 'react'
import { motion } from 'framer-motion'

const AuthInput = ({ label, type = "text", value, onChange, placeholder, name, error }) => {
  return (
    <div className="flex flex-col gap-2 w-full mt-2">
      {label && (
        <label className="text-[13px] font-bold text-white/40 ml-1 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full px-5 py-4 bg-white/5 border rounded-2xl 
            text-white placeholder:text-white/20 outline-none
            transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
            focus:bg-white/[0.08] focus:ring-4 focus:ring-[#6366f1]/10
            ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-[#6366f1]/50'}
          `}
        />
        {error && (
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[12px] text-red-500 mt-1.5 ml-2 font-medium block"
          >
            {error}
          </motion.span>
        )}
      </div>
    </div>
  )
}

export default AuthInput
