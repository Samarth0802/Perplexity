import React, { useEffect } from 'react'
import AllRoutes from '../AllRoutes'
import { useAuth } from '../features/auth/Hooks/auth.hook'

const App = () => {
  const { handleGetUser } = useAuth()

  useEffect(() => {
    handleGetUser()
  }, [])

  return (
    <AllRoutes />
  )
}

export default App