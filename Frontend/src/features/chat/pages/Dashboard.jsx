import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../auth/Hooks/auth.hook'
import { useSocket } from '../Hooks/socket.hook'
import { useChat } from '../Hooks/chat.hook'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'

const Dashboard = () => {
    const { handleLogout, user } = useAuth()
    const [searchPrompt, setSearchPrompt] = useState('')
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const socket = useSocket()

    const {
        chats,
        currentChat,
        messages,
        handleGetChats,
        handleGetMessages,
        handleSendMessage,
        handleSetCurrentChat,
        handleDeleteChat
    } = useChat()

    const messagesEndRef = useRef(null)

    // Ensure we start with a clean slate (New Chat) on every mount/refresh
    useEffect(() => {
        handleNewChat()
        handleGetChats()
    }, [])

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    const handleChatSelect = async (chat) => {
        handleSetCurrentChat(chat)
        await handleGetMessages(chat._id)
    }

    const handleNewChat = () => {
        handleSetCurrentChat(null)
        setSearchPrompt('')
    }

    const submitMessage = async () => {
        if (!searchPrompt.trim() || isSending) return;
        const msg = searchPrompt.trim();
        setSearchPrompt('');
        setIsSending(true);

        try {
            const res = await handleSendMessage(msg, currentChat?._id);
            if (!currentChat && res.data?.chat) {
                handleSetCurrentChat(res.data.chat);
                await handleGetChats();
                await handleGetMessages(res.data.chat._id);
            } else if (currentChat) {
                await handleGetMessages(currentChat._id);
            }
        } catch (err) {
            console.error("Failed to send message", err);
        } finally {
            setIsSending(false);
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitMessage();
        }
    }

    const suggestionQuestions = [
        "How does quantum computing work?",
        "Best travel spots in 2024",
        "Explain French Revolution",
        "Healthy dinner recipes"
    ];

    const StellarIcon = ({ size = 18 }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
        </svg>
    );

    return (
        <div className="h-screen flex bg-[#191a1a] text-[#ececec] font-sans overflow-hidden selection:bg-[#6366f1]/30 selection:text-white">
            {/* Sidebar */}
            <aside
                className={`flex-shrink-0 bg-[#0d0e0e] border-r border-white/5 z-20 transition-[width] duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] relative ${isSidebarOpen ? 'w-[260px]' : 'w-[72px]'}`}
                onMouseEnter={() => setIsSidebarOpen(true)}
                onMouseLeave={() => setIsSidebarOpen(false)}
            >
                <div className="w-full h-full flex flex-col pt-5 pb-5 overflow-hidden">
                    {/* Logo Section */}
                    <div onClick={handleNewChat} className="flex items-center gap-3 px-6 mb-8 transition-all cursor-pointer group">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:rotate-90 bg-[#6366f1]">
                            <StellarIcon size={18} />
                        </div>
                        <span className={`font-semibold text-[21px] tracking-tight text-white transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                            Perplexity
                        </span>
                    </div>

                    <div className="px-3 mb-6 relative">
                        <button
                            onClick={handleNewChat}
                            className={`flex items-center h-10 rounded-full border border-white/10 text-[14px] font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300 group/btn ${isSidebarOpen ? 'w-full px-4 justify-start bg-white/5 shadow-sm' : 'w-10 px-0 justify-center mx-auto border-transparent bg-transparent hover:bg-white/5 active:scale-95'}`}
                        >
                            <div className={`flex-shrink-0 flex items-center justify-center transition-transform duration-300 ${!isSidebarOpen ? 'scale-110' : 'group-hover/btn:rotate-90'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                            </div>
                            <AnimatePresence>
                                {isSidebarOpen && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="ml-4 whitespace-nowrap font-semibold tracking-tight"
                                    >
                                        New Thread
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-hide py-2 px-3">
                        {/* Recent Chats Section */}
                        {isSidebarOpen && chats && chats.length > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
                                <div className="px-3 text-[11px] font-bold text-white/30 uppercase tracking-[0.1em] mb-3">Recent</div>
                                <div className="space-y-1">
                                    {chats.slice().reverse().map(chat => (
                                        <div key={chat._id} className="relative group/chat">
                                            <button
                                                onClick={() => handleChatSelect(chat)}
                                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all pr-10 truncate ${currentChat?._id === chat._id ? 'text-white bg-white/10' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}
                                            >
                                                <span className="truncate">{chat.title || 'Untitled'}</span>
                                            </button>
                                            <button
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    const confirmDelete = window.confirm("Delete this thread?");
                                                    if (!confirmDelete) return;
                                                    try {
                                                        await handleDeleteChat(chat._id);
                                                        if (currentChat?._id === chat._id) handleNewChat();
                                                        await handleGetChats();
                                                    } catch (err) { console.error("Error", err); }
                                                }}
                                                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-white/20 opacity-0 group-hover/chat:opacity-100 hover:text-red-400 hover:bg-red-400/10 transition-all z-10"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-white/5 mt-auto px-3 space-y-1">
                        <button className="w-full flex items-center gap-4 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all text-white/50 hover:text-white hover:bg-white/5">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#6366f1] to-[#a855f7]"></div>
                            <span className={`truncate transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>{user?.username || 'User'}</span>
                        </button>
                        <button onClick={handleLogout} className="w-full flex items-center gap-4 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all text-white/50 hover:text-red-400 hover:bg-red-400/5">
                            <div className="flex-shrink-0 flex items-center justify-center w-5 text-inherit">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                            </div>
                            <span className={`transition-opacity duration-300 whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center h-full relative overflow-hidden bg-[#191a1a]">
                <AnimatePresence mode="wait">
                    {!currentChat ? (
                        <motion.div
                            key="new-chat"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="w-full h-full flex flex-col items-center justify-center"
                        >
                            <motion.div
                                layoutId="search-container"
                                className="w-full max-w-xl flex flex-col px-4 md:px-0"
                            >
                                <motion.h1
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="text-3xl md:text-[42px] font-normal tracking-tight text-center mb-10 text-white/95"
                                    style={{ fontFamily: "'Outfit', sans-serif" }}
                                >
                                    Where knowledge begins
                                </motion.h1>

                                <div className="w-full relative shadow-[0_8px_30px_rgb(0,0,0,0.2)] rounded-2xl bg-[#202222] border border-white/5 hover:border-white/10 focus-within:border-white/20 transition-all duration-300 flex flex-col p-4">
                                    <textarea
                                        className="w-full bg-transparent border-none outline-none text-[#ececec] placeholder-white/30 resize-none min-h-[52px] text-[16px] leading-relaxed focus:ring-0 scrollbar-hide py-1"
                                        placeholder="Ask anything..."
                                        value={searchPrompt}
                                        onChange={(e) => setSearchPrompt(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        disabled={isSending}
                                    />

                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-1.5">
                                            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-medium text-white/40 hover:text-white/80 hover:bg-white/5 transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                                Focus
                                            </button>
                                            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-medium text-white/40 hover:text-white/80 hover:bg-white/5 transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                                                Attach
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={submitMessage}
                                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${(searchPrompt.trim() && !isSending) ? 'bg-[#6366f1] text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:scale-105 active:scale-95' : 'bg-[#2a2a2a] text-white/20'}`}
                                            >
                                                {isSending ? (
                                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full" />
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full flex flex-wrap justify-center gap-2 mt-8">
                                    {suggestionQuestions.map((q, i) => (
                                        <motion.button
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * i }}
                                            onClick={() => {
                                                setSearchPrompt(q);
                                                setTimeout(() => {
                                                    const textarea = document.querySelector('textarea');
                                                    if (textarea) textarea.focus();
                                                }, 50);
                                            }}
                                            className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-white/40 text-[13px] hover:text-white/80 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer whitespace-nowrap"
                                        >
                                            {q}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="active-chat"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-2xl flex flex-col h-full bg-[#191a1a]"
                        >
                            {/* Messages Scroll Area */}
                            <div className="flex-1 overflow-y-auto px-4 md:px-0 py-10 space-y-10 scrollbar-hide">
                                {messages?.map((msg, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                                        className={`w-full flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                                    >
                                        {msg.role !== 'user' && (
                                            <div className="flex items-center gap-2 mb-4 text-white font-medium text-[15px]">
                                                <div className="w-5 h-5 rounded flex items-center justify-center transition-transform hover:rotate-90" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}>
                                                    <StellarIcon size={12} />
                                                </div>
                                                Answer
                                            </div>
                                        )}
                                        <div className={`leading-relaxed ${msg.role === 'user' ? 'bg-[#2a2b2e] text-white px-5 py-3 rounded-2xl max-w-[85%] text-[16px]' : 'bg-transparent text-white/90 px-0 w-full prose prose-invert prose-p:leading-relaxed prose-pre:bg-[#202222] prose-pre:border prose-pre:border-white/5 max-w-none text-[17px]'}`}>
                                            {msg.role === 'user' ? (
                                                <span className="whitespace-pre-wrap">{msg.content}</span>
                                            ) : (
                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                            )}
                                        </div>

                                        {msg.role !== 'user' && (
                                            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5 w-full">
                                                <button className="text-white/20 hover:text-white/60 transition-colors">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                                                </button>
                                                <button className="text-white/20 hover:text-white/60 transition-colors">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" /></svg>
                                                </button>
                                                <button className="text-white/20 hover:text-white/60 transition-colors">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}

                                {isSending && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-start">
                                        <div className="flex items-center gap-2 mb-4 text-white font-medium text-[15px]">
                                            <div className="w-5 h-5 rounded flex items-center justify-center animate-spin-slow" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}>
                                                <StellarIcon size={12} />
                                            </div>
                                            Thinking...
                                        </div>
                                        <div className="flex items-center gap-1.5 pl-1">
                                            {[0, 1, 2].map(i => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                                                    className="w-1.5 h-1.5 rounded-full bg-white/20"
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} className="h-4" />
                            </div>

                            {/* Fixed Bottom Input */}
                            <motion.div
                                layoutId="search-container"
                                className="w-full max-w-2xl flex flex-col px-4 md:px-0 pb-6 pt-2 bg-[#191a1a]"
                            >
                                <div className="w-full relative shadow-[0_8px_30px_rgb(0,0,0,0.2)] rounded-2xl bg-[#202222] border border-white/5 hover:border-white/10 focus-within:border-white/20 transition-all duration-300 flex flex-col p-4">
                                    <textarea
                                        className="w-full bg-transparent border-none outline-none text-[#ececec] placeholder-white/30 resize-none min-h-[52px] text-[16px] leading-relaxed focus:ring-0 scrollbar-hide py-1"
                                        placeholder="Ask anything..."
                                        value={searchPrompt}
                                        onChange={(e) => setSearchPrompt(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        disabled={isSending}
                                    />

                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-1.5">
                                            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-medium text-white/40 hover:text-white/80 hover:bg-white/5 transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                                Focus
                                            </button>
                                            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-medium text-white/40 hover:text-white/80 hover:bg-white/5 transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                                                Attach
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={submitMessage}
                                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${(searchPrompt.trim() && !isSending) ? 'bg-[#6366f1] text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:scale-105 active:scale-95' : 'bg-[#2a2a2a] text-white/20'}`}
                                            >
                                                {isSending ? (
                                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full" />
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}

export default Dashboard
