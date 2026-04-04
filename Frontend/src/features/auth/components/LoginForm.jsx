import React, { useState } from 'react'
import { motion } from 'framer-motion'
import AuthInput from './AuthInput'
import AuthButton from './AuthButton'
import { useAuth } from '../Hooks/auth.hook'

const LoginForm = ({ onToggleSignup, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  })
  const { handleLogin, loading, error } = useAuth()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await handleLogin(formData.identifier, formData.password)
      onLoginSuccess()
    } catch (err) {
      // Error handled by hook
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 items-center text-center px-4">
        <h2 className="text-3xl font-bold text-white tracking-tight">Welcome back</h2>
        <p className="text-white/40 text-[15px] leading-relaxed">Sign in to continue your journey with Perplexity AI.</p>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        <AuthInput
          label="Email or Username"
          name="identifier"
          placeholder="johndoe@example.com"
          value={formData.identifier}
          onChange={handleChange}
        />
        <AuthInput
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
        />
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
          Sign In
        </AuthButton>
        <p className="text-[14px] text-white/40 text-center">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onToggleSignup}
            className="text-[#6366f1] font-bold hover:text-[#a855f7] transition-all"
          >
           Create account
          </button>
        </p>
      </div>
    </form>
  )
}

export default LoginForm
