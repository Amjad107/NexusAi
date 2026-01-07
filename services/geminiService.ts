import { GoogleGenAI, Type } from "@google/genai";
import { WebsiteSection } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SECTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: "A unique identifier for the section." },
    type: { 
      type: Type.STRING, 
      description: "The type of section: header, hero, features, cta, pricing, footer, or content." 
    },
    content: {
      type: Type.OBJECT,
      description: "The textual and media content of the section.",
      properties: {
        title: { type: Type.STRING },
        subtitle: { type: Type.STRING },
        cta: { type: Type.STRING },
        links: { type: Type.ARRAY, items: { type: Type.STRING } },
        items: { 
          type: Type.ARRAY, 
          items: { 
            type: Type.OBJECT, 
            properties: { 
              title: { type: Type.STRING }, 
              desc: { type: Type.STRING } 
            } 
          } 
        }
      }
    },
    styles: {
      type: Type.OBJECT,
      description: "The visual styling properties for the section.",
      properties: {
        backgroundColor: { type: Type.STRING },
        textColor: { type: Type.STRING },
        padding: { type: Type.STRING },
        titleFontSize: { type: Type.STRING },
        borderRadius: { type: Type.STRING },
        textAlign: { type: Type.STRING }
      }
    }
  },
  required: ["id", "type", "content", "styles"],
};

const WEBSITE_SCHEMA = {
  type: Type.ARRAY,
  items: SECTION_SCHEMA
};

export const generateWebsite = async (prompt: string): Promise<WebsiteSection[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{
        parts: [{
          text: `Create a professional website structure for the following request: "${prompt}". 
          Ensure the sections follow a logical landing page flow (Header -> Hero -> Features -> etc.). 
          Provide realistic placeholder content for a SaaS product.`
        }]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: WEBSITE_SCHEMA,
        thinkingConfig: { thinkingBudget: 2000 }
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as WebsiteSection[];
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return [
      { 
        id: '1', 
        type: 'header', 
        content: { title: 'NexusAI Site', links: ['Home', 'Features', 'Pricing'] }, 
        styles: { backgroundColor: '#ffffff', padding: '16px 32px' } 
      },
      { 
        id: '2', 
        type: 'hero', 
        content: { 
          title: 'Your Vision, Accelerated.', 
          subtitle: 'The professional site builder powered by cutting-edge intelligence.', 
          cta: 'Start Building' 
        }, 
        styles: { backgroundColor: '#f8fafc', padding: '100px 20px', titleFontSize: '64px' } 
      }
    ];
  }
};

export const editWebsite = async (prompt: string, currentSections: WebsiteSection[]): Promise<WebsiteSection[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{
        parts: [{
          text: `You are an expert web editor. Given the current website sections and a user request, update the sections. 
          Current Sections: ${JSON.stringify(currentSections)}
          User Request: "${prompt}"`
        }]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: WEBSITE_SCHEMA,
        thinkingConfig: { thinkingBudget: 2000 }
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as WebsiteSection[];
  } catch (error) {
    console.error("Gemini Edit Error:", error);
    return currentSections;
  }
};