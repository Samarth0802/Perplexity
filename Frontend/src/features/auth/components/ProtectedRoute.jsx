import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../Hooks/auth.hook'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0b] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!user.verified) {
    // Optional: Redirect to a verification page if you have one specifically for unverified logged-in users.
    // For now, we assume if they logged in, they are verified or can be handled at the root.
  }

  return children
}

export default ProtectedRoute
