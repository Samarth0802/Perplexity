import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ApiKeyErrorPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-[#1a1a1a] border border-red-500/30 w-full max-w-md rounded-2xl p-8 shadow-2xl shadow-red-500/10 relative overflow-hidden"
        >
          {/* Decorative background glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/10 blur-[100px] rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-red-500/10 blur-[100px] rounded-full" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
              <svg 
                className="w-8 h-8 text-red-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">API Key Exhausted</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Oh no! It looks like our API limits have been reached. To fix this and continue searching, please contact us.
            </p>

            <div className="w-full bg-[#242424] rounded-xl p-4 mb-6 border border-white/5 group transition-colors hover:border-red-500/30">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Send Email To</p>
              <a 
                href="mailto:samvarshney36@gmail.com" 
                className="text-lg font-medium text-red-400 hover:text-red-300 transition-colors break-all"
              >
                samvarshney36@gmail.com
              </a>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 px-6 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-xl hover:from-red-500 hover:to-red-400 transform transition-all active:scale-[0.98] shadow-lg shadow-red-900/20"
            >
              Got it!
            </button>
            
            <p className="mt-4 text-xs text-gray-500 italic">
              Issues will be fixed once the key is updated.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ApiKeyErrorPopup;
