import { useDispatch, useSelector } from "react-redux";
import { setChats, setCurrentChat, setMessages, setLoading, setError } from "../chat.slice";
import { getChats, getMessages, deleteChat, sendMessage } from "../services/chat.api";

export const useChat = () => {
    const dispatch = useDispatch();
    const { chats, currentChat, messages, loading, error } = useSelector((state) => state.chat);

    const handleGetChats = async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await getChats();
            dispatch(setChats(response.data));
            return response;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to get chats";
            dispatch(setError(message));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleGetMessages = async (chatId) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await getMessages(chatId);
            dispatch(setMessages(response.data));
            return response;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to get messages";
            dispatch(setError(message));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleDeleteChat = async (chatId) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await deleteChat(chatId);
            return response;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to delete chat";
            dispatch(setError(message));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleSendMessage = async (message, chatId) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await sendMessage(message, chatId);
            return response;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to send message";
            dispatch(setError(message));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleSetCurrentChat = (chat) => {
        dispatch(setCurrentChat(chat));
    };

    return {
        chats,
        currentChat,
        messages,
        loading,
        error,
        handleGetChats,
        handleGetMessages,
        handleDeleteChat,
        handleSendMessage,
        handleSetCurrentChat
    };
};