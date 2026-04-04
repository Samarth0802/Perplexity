import AuthPage from "./features/auth/pages/AuthPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import Dashboard from "./features/chat/pages/Dashboard";

const AllRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<AuthPage mode="login" />} />
                <Route path='/register' element={<AuthPage mode="signup" />} />
                <Route
                    path='/'
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default AllRoutes