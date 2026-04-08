import React, { useEffect, useState } from 'react'
import AllRoutes from '../AllRoutes'
import { useAuth } from '../features/auth/Hooks/auth.hook'
import ApiKeyErrorPopup from '../components/ApiKeyErrorPopup'

const App = () => {
  const { handleGetUser } = useAuth()
  const [isApiKeyError, setIsApiKeyError] = useState(false)

  useEffect(() => {
    handleGetUser()

    const handleApiKeyError = () => {
      setIsApiKeyError(true);
    };

    window.addEventListener('api-key-exhausted', handleApiKeyError);
    return () => window.removeEventListener('api-key-exhausted', handleApiKeyError);
  }, [])

  return (
    <>
      <AllRoutes />
      <ApiKeyErrorPopup 
        isOpen={isApiKeyError} 
        onClose={() => setIsApiKeyError(false)} 
      />
    </>
  )
}

export default App