import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading, setError } from "../auth.slice";
import { registerUser, verifyEmail, loginUser, getUser, logoutUser } from "../services/auth.service";

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    const handleRegister = async (username, email, password) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await registerUser(username, email, password);
            return response;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Registration failed";
            dispatch(setError(message));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleVerify = async (otp) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await verifyEmail(otp);
            return response;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Verification failed";
            dispatch(setError(message));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleLogin = async (identifier, password) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await loginUser(identifier, password);
            dispatch(setUser(response.user));
            return response;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Login failed";
            dispatch(setError(message));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleGetUser = async () => {
        dispatch(setLoading(true));
        try {
            const response = await getUser();
            dispatch(setUser(response.user));
            return response;
        } catch (err) {
            dispatch(setUser(null));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleLogout = async () => {
        dispatch(setLoading(true));
        try {
            await logoutUser();
            dispatch(setUser(null));
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        user,
        loading,
        error,
        handleRegister,
        handleVerify,
        handleLogin,
        handleGetUser,
        handleLogout
    };
};