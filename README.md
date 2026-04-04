# Perplexity Clone - Stellar ✨

A high-performance, agentic AI search engine clone built with a premium "Stellar" aesthetic. This project utilizes LangGraph and LangChain to provide real-time internet search capabilities synthesized into clear, professional answers.

## 🚀 Key Features

- **Agentic AI Search**: Uses a LangGraph-powered agent to decide when to search the web for the latest information.
- **Advanced Summarization**: Synthesizes search results into concise Markdown responses with inline citations [1][2].
- **Dynamic UI**: A premium dark-mode interface with smooth animations and a "Stellar" indigo theme.
- **Real-time Chat**: Persistent chat history with title generation for every thread.
- **Secure Auth**: Full authentication flow including OTP verification.

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion, Axios, React-Markdown.
- **Backend**: Node.js, Express, MongoDB, Redis, LangChain, LangGraph.
- **AI Models**: Google Gemini 2.5 Flash, Mistral AI.
- **Search API**: Tavily Search.

## ⚠️ Important Note on API Usage

> [!IMPORTANT]
> This project currently operates on the **Free Tier** for all integrated AI and Search APIs (Google Gemini, Mistral, and Tavily).
>
> If you find that the AI is not returning results or is providing "Thinking..." for a long time without an answer, it most likely means:
> 1. **API Quota Exceeded**: You have reached the daily/minute limit for the free tier (e.g., 15 requests/min for Gemini).
> 2. **Usage Over**: The API key's free credits or daily allocation has been fully consumed.
>
> Please wait for the quota to reset or update the `.env` file with a new API key.

## 🔧 Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Samarth0802/Perplexity.git
   ```

2. **Backend Setup**:
   - Navigate to `/Backend`.
   - Create a `.env` file with your `GOOGLE_API_KEY`, `MISTRAL_API_KEY`, `TAVILY_API_KEY`, `MONGODB_URI`, and `REDIS_URL`.
   - Run `npm install` then `npm run dev`.

3. **Frontend Setup**:
   - Navigate to `/Frontend`.
   - Run `npm install` then `npm run dev`.


