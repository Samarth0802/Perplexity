import { tool } from "@langchain/core/tools";
import { TavilySearch } from "@langchain/tavily";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { z } from "zod";
import dotenv from "dotenv";
import { ChatMistralAI } from "@langchain/mistralai";
dotenv.config();

const internetSearch = tool(
  async (query) => {
    console.log("🌐 [TOOL] internet_search triggered for:", query);

    const tavilySearch = new TavilySearch({
      tavilyApiKey: process.env.TAVILY_API_KEY,
    });
    return await tavilySearch.invoke(query);
  },
  {
    name: "internet_search",
    description: "Run a web search to find current/latest information",
    schema: z.string().describe("The search query"),
  }
);

console.log("🤖 Initializing Gemini Model...");
const googleModel = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-1.5-flash",
    maxOutputTokens: 2048,
})
console.log("✅ Model Initialized");

const agent = createReactAgent({
  llm: googleModel,
  tools: [internetSearch],
  stateModifier: `You are an expert researcher. 
Always use the internet_search tool to find current/latest information before answering. 
After receiving ANY search result, you MUST stop searching immediately and synthesize your final answer.
NEVER call the search tool more than once per user request. 
Format your final answer using clean Markdown with inline citations like [1], [2].
Provide a concise and professional response based ONCE you have search data.`,
});


export default agent