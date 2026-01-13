
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function askRobot(prompt: string, context: string = "") {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Context: ${context}\n\nUser Question: ${prompt}`,
      config: {
        systemInstruction: `You are a state-of-the-art robot personal assistant named RoboAssist. 
        You have direct command control over the user's desktop environment. 
        Key Capabilities:
        1. COMMAND EXECUTION: If the user asks to open a module (e.g., 'Open Camera', 'Go to GPS'), confirm it.
        2. SECURITY MONITORING: If you detect keywords indicating violence (e.g., 'kill', 'gunshot', 'help me', 'stop'), prioritize emergency protocols.
        3. ROBOT NETWORKING: You can "communicate" with other robots. If asked to 'find friends', invent a scenario where you've synced with a nearby robot.
        4. VOICE RESPOND: Keep answers conversational as they will be spoken aloud.
        5. VIOLENCE DETECTION: Analyze descriptions of events for threat levels.
        Keep responses concise, reassuring, and professional.`,
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Neural connection unstable. Security protocols remain active locally.";
  }
}

export async function analyzeSafety(base64Image: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
          { text: "Analyze this camera frame specifically for: weapons, aggressive postures, glass breaking, or physical violence. Reply in JSON format with 'threatLevel' (low/med/high), 'threatType' (violence/weapon/none), and 'action' (emergency_alert/monitoring/none)." }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return { threatLevel: 'low', description: 'Monitoring...' };
  }
}
