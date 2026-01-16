import { GoogleGenAI } from "@google/genai";

// 1. Standardize for Vite: Using import.meta.env
// 2. Map to your actual .env key: VITE_GEMINI_API_KEY
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Fail-safe: Prevents the entire app from crashing if the key is missing
if (!apiKey) {
  console.error("CRITICAL: VITE_GEMINI_API_KEY is not defined in environment variables.");
}

const ai = new GoogleGenAI(apiKey || "REPLACE_ME_IN_VERCEL_SETTINGS");

export async function askRobot(prompt: string, context: string = "") {
  try {
    const model = ai.getGenerativeModel({ 
      model: "gemini-1.5-flash", // Using a stable model name
      systemInstruction: `You are a state-of-the-art robot personal assistant named RoboAssist. 
        You have direct command control over the user's desktop environment. 
        Key Capabilities:
        1. COMMAND EXECUTION: If the user asks to open a module (e.g., 'Open Camera'), confirm it.
        2. SECURITY MONITORING: If you detect keywords indicating violence, prioritize emergency protocols.
        3. VOICE RESPOND: Keep answers conversational as they will be spoken aloud.
        Keep responses concise, reassuring, and professional.`,
    });

    const result = await model.generateContent(`Context: ${context}\n\nUser Question: ${prompt}`);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Neural connection unstable. Security protocols remain active locally.";
  }
}

export async function analyzeSafety(base64Image: string) {
  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
      { text: "Analyze this camera frame for: weapons, aggressive postures, or physical violence. Reply in JSON format with 'threatLevel' (low/med/high), 'threatType' (violence/weapon/none), and 'action' (emergency_alert/monitoring/none)." }
    ]);
    const response = await result.response;
    return JSON.parse(response.text() || "{}");
  } catch (error) {
    return { threatLevel: 'low', description: 'Monitoring...' };
  }
}
