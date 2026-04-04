import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import AuthButton from './AuthButton'
import { useAuth } from '../Hooks/auth.hook'

const OtpVerify = ({ email, onVerificationSuccess }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()]
  const { handleVerify, loading, error } = useAuth()

  const handleChange = (index, value) => {
    if (isNaN(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs[index + 1].current.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpValue = otp.join('')
    if (otpValue.length !== 6) return
    try {
      await handleVerify({ otp: otpValue })
      onVerificationSuccess()
    } catch (err) {
      // Error handled by hook
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 items-center text-center px-4">
        <h2 className="text-3xl font-bold text-white tracking-tight">Verify email</h2>
        <p className="text-white/40 text-[15px] leading-relaxed">We've sent a 6-digit code to <span className="text-[#6366f1] font-bold">{email}</span></p>
      </div>

      <div className="flex justify-center gap-3 mt-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={inputRefs[index]}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-14 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl font-bold text-white focus:ring-4 focus:ring-[#6366f1]/10 focus:border-[#6366f1]/50 outline-none transition-all duration-300"
          />
        ))}
      </div>

      {error && (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl"
        >
           <p className="text-[13px] text-red-400 font-semibold text-center">{error}</p>
        </motion.div>
      )}

      <div className="flex flex-col gap-4 mt-2">
        <AuthButton type="submit" loading={loading} variant="primary">
          Verify OTP
        </AuthButton>
        <p className="text-[14px] text-white/40 text-center">
          Didn't receive the code?{' '}
          <button
            type="button"
            className="text-[#6366f1] font-bold hover:text-[#a855f7] transition-all"
          >
            Resend
          </button>
        </p>
      </div>
    </form>
  )
}

export default OtpVerify
