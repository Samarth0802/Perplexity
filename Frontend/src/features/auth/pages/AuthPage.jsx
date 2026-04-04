import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import SignupForm from '../components/SignupForm'
import OtpVerify from '../components/OtpVerify'
import { useAuth } from '../Hooks/auth.hook'

const AuthPage = ({ mode = "login" }) => {
  const [authStep, setAuthStep] = useState(mode)
  const [email, setEmail] = useState('')
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && user.verified) {
      navigate('/')
    }
  }, [user, navigate])

  const handleSignupSuccess = (userEmail) => {
    setEmail(userEmail)
    setAuthStep('verify')
  }

  const handleLoginSuccess = () => {
    navigate('/')
  }

  const handleVerificationSuccess = () => {
    setAuthStep('login')
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0b] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[#0d0e0e] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-15%] left-[-15%] w-[50%] h-[50%] bg-[#6366f1]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] bg-[#a855f7]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#191a1a] border border-white/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[32px] p-8 md:p-10 transition-all duration-500"
        >

          <div className="mb-10 flex flex-col items-center gap-4">
            <motion.div 
                whileHover={{ rotate: 90 }}
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform bg-[#6366f1]" 
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
              </svg>
            </motion.div>
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold text-white tracking-tight">Perplexity<span className="text-[#6366f1] ml-0.5">.</span></h1>
                <p className="text-white/40 text-[13px] mt-1 font-medium">Where knowledge begins</p>
            </div>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
                <motion.div
                    key={authStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
            {authStep === 'login' && (
              <LoginForm
                onToggleSignup={() => setAuthStep('signup')}
                onLoginSuccess={handleLoginSuccess}
              />
            )}
            {authStep === 'signup' && (
              <SignupForm
                onToggleLogin={() => setAuthStep('login')}
                onSignupSuccess={handleSignupSuccess}
              />
            )}
            {authStep === 'verify' && (
              <OtpVerify
                email={email}
                onVerificationSuccess={handleVerificationSuccess}
              />
            )}
                </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="mt-8 text-center">
          <p className="text-white/20 text-[11px] uppercase tracking-[0.2em] font-bold">
            Secure AI Environment
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
