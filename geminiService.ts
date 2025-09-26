import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Missing GEMINI_API_KEY environment variable. The app will not be able to generate AI reports.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: 'OBJECT',
  properties: {
    score: { type: 'NUMBER', description: 'The primary quantitative score for the test (e.g., height in cm for vertical jump, time in seconds for shuttle run).' },
    unit: { type: 'STRING', description: 'The unit for the score (e.g., "cm", "seconds", "reps").' },
    performanceMetrics: {
      type: 'ARRAY',
      description: 'An array of 4 performance metrics with their scores out of 100. The metrics must be: Form, Power, Agility, Consistency.',
      items: {
        type: 'OBJECT',
        properties: {
          metric: { type: 'STRING' },
          value: { type: 'INTEGER' },
        },
        required: ["metric", "value"],
      },
    },
    feedback: {
      type: 'OBJECT',
      properties: {
        strengths: { type: 'ARRAY', items: { type: 'STRING' }, description: 'A list of 1-2 strengths observed.' },
        weaknesses: { type: 'ARRAY', items: { type: 'STRING' }, description: 'A list of 1-2 weaknesses or areas for improvement.' },
        suggestions: { type: 'ARRAY', items: { type: 'STRING' }, description: 'A list of 1-2 actionable suggestions.' },
      },
      required: ["strengths", "weaknesses", "suggestions"],
    },
    verificationStatus: { type: 'STRING', description: "The verification status of the test. Must be either 'Verified' or 'Flagged for Review'." },
    reasoning: { type: 'STRING', description: "A brief, one-sentence reasoning ONLY if the status is 'Flagged for Review'. Otherwise, this should be an empty string." },
  },
  required: ["score", "unit", "performanceMetrics", "feedback", "verificationStatus", "reasoning"],
};

export const analyzeWorkoutVideo = async (videoFrames: string[], testType?: string, declaredDistance?: string) => {
    if (!API_KEY) throw new Error("AI features are disabled. Please configure your Gemini API key.");

    const imageParts = videoFrames.map(frame => ({
        inlineData: { mimeType: 'image/jpeg', data: frame }
    }));

    const distanceCheckPrompt = testType === 'endurance_run' && declaredDistance
        ? `**GPS vs. Distance Cross-Check:** The athlete has declared a distance of ${declaredDistance}. Cross-reference this with an estimated distance from mock GPS path data. Flag if there is a significant discrepancy.`
        : '';

    const prompt = `
        Act as a strict, expert athletic performance analyst and virtual proctor for the Sports Authority of India (SAI) National Standardized Tests. Your primary goal is to ensure the integrity and accuracy of the assessment.
        Analyze the following sequential video frames from an athlete performing the '${testType || 'general workout'}' test.

        **1. Quantitative Performance Analysis:**
        - Estimate the primary performance metric (e.g., height in cm for vertical jump, time in seconds for shuttle run).
        - Provide a score from 0-100 for these key indicators: Form, Power, Agility, and Consistency.

        **2. Integrity Verification & Cheat Detection (Crucial Task):**
        - Critically assess the video's integrity with high skepticism.
        - **Identity Verification:** The athlete's face was scanned prior to this test. You MUST verify that the person in these video frames is the same individual. Flag if there is a mismatch or if the face is consistently obscured.
        - **Physics Validation:** Analyze the athlete's movement. Does acceleration, velocity, or height achieved seem humanly possible? Flag any movement that seems physically improbable (e.g., unnaturally fast sprints, impossible jump heights) which suggests video speed manipulation.
        - ${distanceCheckPrompt}
        - **Video Tampering:** Look for temporal inconsistencies, unnatural cuts, or visual artifacts that suggest editing.
        - **Procedural Errors:** Was the test performed according to standard protocol? (e.g., did they start from a standstill? Did they touch the line in a shuttle run?).
        - Based on this, 'verificationStatus' MUST be "Verified" ONLY if all checks pass. Otherwise, it MUST be "Flagged for Review".
        - If flagged, you MUST provide a concise, specific 'reasoning' (e.g., "Athlete's acceleration in the first 10m seems physically improbable, suggesting video speed manipulation.").

        **3. Qualitative Feedback (Granular and Specific):**
        - Provide brief, constructive feedback on strengths, weaknesses, and actionable suggestions based ONLY on what is visible.

        Return a concise analysis as a single JSON object adhering to the provided schema. Do not add any extra text or explanation.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [...imageParts, { text: prompt }] },
            config: { responseMimeType: "application/json", responseSchema: analysisSchema },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error analyzing workout video:", error);
        throw new Error("Failed to get AI analysis for the video.");
    }
};

const reportSchema = {
    type: 'OBJECT',
    properties: {
        strengths: { type: 'STRING' },
        weaknesses: { type: 'STRING' },
        suggestions: { type: 'ARRAY', items: { type: 'STRING' } },
    },
    required: ["strengths", "weaknesses", "suggestions"],
};

export const generateAthleteReport = async (athleteName: string) => {
    if (!API_KEY) throw new Error("AI features are disabled.");
    const prompt = `Act as an expert sports performance analyst. Based on assumed performance data for an athlete named "${athleteName}", generate a concise report highlighting their key strengths, weaknesses, and 3-4 actionable training suggestions. Return a JSON object following the specified schema.`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: reportSchema },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating athlete report:", error);
        throw new Error("Failed to get AI analysis for the athlete.");
    }
};

const mealPlanSchema = {
    type: 'OBJECT', properties: {
        totalCalories: { type: 'NUMBER' },
        breakfast: { type: 'OBJECT', properties: { name: { type: 'STRING' }, description: { type: 'STRING' }, calories: { type: 'NUMBER' } } },
        lunch: { type: 'OBJECT', properties: { name: { type: 'STRING' }, description: { type: 'STRING' }, calories: { type: 'NUMBER' } } },
        dinner: { type: 'OBJECT', properties: { name: { type: 'STRING' }, description: { type: 'STRING' }, calories: { type: 'NUMBER' } } },
        snacks: { type: 'OBJECT', properties: { name: { type: 'STRING' }, description: { type: 'STRING' }, calories: { type: 'NUMBER' } } },
    }
};

export const generateDietPlan = async (options: { goal: string; diet: string; sport: string }) => {
    if (!API_KEY) throw new Error("AI features are disabled.");
    const { goal, diet, sport } = options;
    const prompt = `Act as an expert sports nutritionist. Create a one-day, high-protein, Indian cuisine-based meal plan for a competitive ${sport} athlete with a goal of ${goal} and a ${diet} preference. Calculate total calories and provide details for breakfast, lunch, dinner, and snacks. Return a JSON object following the specified schema.`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: mealPlanSchema, },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating diet plan:", error);
        throw new Error("Failed to get AI diet plan.");
    }
};

const careerAdviceSchema = {
    type: 'OBJECT', properties: {
        suggestedSports: { type: 'ARRAY', items: { type: 'STRING' } },
        potentialPathways: { type: 'ARRAY', items: { type: 'STRING' } },
        scholarships: { type: 'ARRAY', items: { type: 'STRING' } },
    }
};

export const generateCareerAdvice = async (strengths: string) => {
    if (!API_KEY) throw new Error("AI features are disabled.");
    const prompt = `Act as an AI career advisor for Indian athletes. An athlete's strengths are: "${strengths}". Based on this, suggest 2-3 other sports they might excel in, list 3 potential career pathways (e.g., national teams, university scholarships), and name 2-3 relevant Indian scholarships or government schemes. Return a JSON object following the specified schema.`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: careerAdviceSchema },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating career advice:", error);
        throw new Error("Failed to get AI career advice.");
    }
};

const drillsSchema = {
    type: 'ARRAY', items: {
        type: 'OBJECT', properties: {
            id: { type: 'STRING' },
            name: { type: 'STRING' },
            category: { type: 'STRING' },
            description: { type: 'STRING' },
        }
    }
};

export const generateDrills = async (sport: string) => {
    if (!API_KEY) throw new Error("AI features are disabled.");
    const prompt = `Act as a master coach. Generate a list of 5 essential training drills for the sport of ${sport}. For each drill, provide a unique ID, name, category (e.g., 'Agility', 'Shooting', 'Defense'), and a brief description. Return a JSON array of objects following the specified schema.`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: drillsSchema },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating drills:", error);
        throw new Error("Failed to get AI drills.");
    }
};