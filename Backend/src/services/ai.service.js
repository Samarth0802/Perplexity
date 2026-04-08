import {ChatMistralAI} from "@langchain/mistralai"
import { HumanMessage,AIMessage } from "@langchain/core/messages";
import dotenv from "dotenv"
import {SystemMessage} from "@langchain/core/messages"
dotenv.config()
import agent from "./internet.service.js";
    
const mistralModel = new ChatMistralAI({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-small-latest"
})

export async function generateTitle(message) {
  try {
    const response = await mistralModel.invoke([
      new SystemMessage("You are a title generator for a chat conversation. Generate a concise and relevant title for the given conversation. Return only the title in 3-5 words only and create a very good title understand to user form one context only."),
      new HumanMessage(message)
    ]);
    return response.content;
  } catch (error) {
    console.error("Mistral Title Error:", error);
    if (error.message?.toLowerCase().includes("api key") || 
        error.message?.toLowerCase().includes("unauthorized") || 
        error.message?.toLowerCase().includes("quota")) {
      return "API_KEY_ERROR"; 
    }
    return "New Thread"; // Fallback title
  }
}

export async function generateReponse(messages){
  console.log("🤖 [AGENT] Generating response for", messages.length, "messages.");
  try {
    const input = {
        messages: messages.map((message) => {
            if(message.role === "user"){
                return new HumanMessage(message.content)
            }else{
                return new AIMessage(message.content)
            }
        })
    };

    console.log("🛠️ [AGENT] Invoking Langgraph Agent...");
    const response = await agent.invoke(input, { recursionLimit: 15 });
    const lastMessage = response.messages[response.messages.length - 1];
    
    let content = lastMessage.content;
    console.log("✅ [AGENT] Response type:", typeof content);

    // If content is an array (structured output), join text parts
    if (Array.isArray(content)) {
        content = content
            .map(part => part.type === 'text' ? part.text : '')
            .join('');
    }

    console.log("✅ [AGENT] Content length:", content.length);
    return content;
  } catch (error) {
    console.error("Agent Response Error:", error);
    if (error.message?.toLowerCase().includes("api key") || 
        error.message?.toLowerCase().includes("unauthorized") || 
        error.message?.toLowerCase().includes("quota") ||
        error.status === 401 || error.status === 403 || error.status === 429) {
      const apiKeyError = new Error("API_KEY_EXHAUSTED");
      apiKeyError.statusCode = 403;
      throw apiKeyError;
    }
    throw error;
  }
}

// console.log(await generateReponse("how is Harry Styles doing these days?"))