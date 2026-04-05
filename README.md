# Perplexity Clone - Stellar ✨

A high-performance, agentic AI search engine clone built with a premium "Stellar" aesthetic. This project utilizes **LangGraph** and **LangChain** to provide real-time internet search capabilities synthesized into clear, professional answers with inline citations.

---

## 🚀 Key Features

- **Agentic AI Search**: Powered by a LangGraph agent that dynamically decides when to search the web, browse results, and synthesize answers.
- **"Stellar" Premium UI**: A sleek, modern interface featuring a dark-mode indigo theme, smooth micro-animations (Framer Motion), and responsive design.
- **Real-time Streaming**: Search results and AI responses stream in real-time via Socket.IO for a seamless conversational experience.
- **Advanced Summarization**: Automatically generates concise summaries and professional titles for every search thread.
- **Secure Authentication**: Robust user auth flow including JWT, password hashing (Bcrypt), and OTP verification via email.
- **Persistent History**: Full chat history management with Redis for caching and MongoDB for long-term storage.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Real-time**: [Socket.IO Client](https://socket.io/)
- **Markdown**: [React-Markdown](https://github.com/remarkjs/react-markdown) with plugin support for citations.

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- **Orchestration**: [LangChain](https://www.langchain.com/) & [LangGraph](https://langchain-ai.github.io/langgraph/)
- **AI Models**: Google Gemini 1.5 Flash (Core LLM), Mistral AI (Support/Summarization).
- **Search Engine**: [Tavily AI](https://tavily.com/) (Optimized for LLM search).
- **Databases**: [MongoDB](https://www.mongodb.com/) (Primary), [Redis](https://redis.io/) (Session/Cache).
- **Authentication**: JWT, Bcrypt, Google OAuth2 (for SMTP).

---

## 📜 Environment Variables (.env)

System configuration is split between the Backend and Frontend. You **must** create `.env` files in both directories.

### 🏠 Backend (`/Backend/.env`)

| Variable | Description | Example / Note |
| :--- | :--- | :--- |
| `PORT` | The port the backend server runs on. | `5000` |
| `HOST_URL` | The URL of your Frontend application. | `http://localhost:5173` |
| `NODE_ENV` | Development or Production mode. | `development` |
| `MONGODB_URI` | Your MongoDB connection string. | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for signing Auth tokens. | Any long random string. |
| `REDIS_HOST` | Redis server hostname. | `localhost` or Cloud provider host. |
| `REDIS_PORT` | Redis server port. | `6379` |
| `REDIS_PASSWORD` | Redis server password (if any). | Required for Managed Redis. |
| **AI API Keys** | | |
| `GOOGLE_API_KEY` | API Key for Gemini 1.5 Flash. | Get it from [Google AI Studio](https://aistudio.google.com/). |
| `MISTRAL_API_KEY`| API Key for Mistral models. | Get it from [Mistral Console](https://console.mistral.ai/). |
| `TAVILY_API_KEY` | API Key for Web Search capabilities. | Get it from [Tavily](https://tavily.com/). |
| **Email (OTP)** | | |
| `GMAIL_USER`     | The email address used to send OTPs. | `yourname@gmail.com` |
| `GMAIL_CLIENT_ID`| Google OAuth2 Client ID. | Required for secure SMTP. |
| `GMAIL_CLIENT_SECRET` | Google OAuth2 Client Secret. | Required for secure SMTP. |
| `GMAIL_REFRESH_TOKEN` | Google OAuth2 Refresh Token. | Required for secure SMTP. |

### 🌐 Frontend (`/Frontend/.env`)

| Variable | Description | Note |
| :--- | :--- | :--- |
| `VITE_API_URL` | The URL of your Backend server. | `http://localhost:5000` |

---

## 🔧 Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone [your-repo-link]
   cd Perplexity-Clone
   ```

2. **Backend Setup**:
   - Navigate to `/Backend`.
   - Install dependencies: `npm install`
   - Create `.env` file from the structure above.
   - Start server: `npm run dev`

3. **Frontend Setup**:
   - Navigate to `/Frontend`.
   - Install dependencies: `npm install`
   - Create `.env` file with `VITE_API_URL`.
   - Start application: `npm run dev`

---

## 🏗️ Architecture Overview

The core of Stellar is the **Agentic Search Pipeline**:
1. **User Query**: Received via Socket.IO.
2. **LangGraph Agent**: Analyzes the query and decides if a web search is needed.
3. **Tavily Search**: Retrieves the most relevant, content-rich snippets from the web.
4. **Synthesis**: Gemini 1.5 Flash processes the snippets to generate a cited response.
5. **Streaming**: The response is streamed back to the UI in Markdown format.

---

## 📜 License
This project is licensed under the MIT License.
