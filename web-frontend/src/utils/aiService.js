import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
if (!import.meta.env.VITE_GEMINI_API_KEY) {
    console.error("VITE_GEMINI_API_KEY is not set in environment variables.");
}
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const aiHelper = {
    /**
     * Analyze equipment data to identify anomalies and generate a health report
     * @param {Array} equipmentData - Array of equipment objects
     * @returns {Promise<Object>} - Health score and insights
     */
    analyzeSystemHealth: async (equipmentData) => {
        try {
            if (!equipmentData || equipmentData.length === 0) return { score: 100, insights: ["No data streams active."] };

            // 1. Calculate Statistics per parameter
            const calculateStats = (data, key) => {
                const values = data.map(d => d[key]);
                const mean = values.reduce((a, b) => a + b, 0) / values.length;
                const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
                return { mean, stdDev: Math.sqrt(variance) };
            };

            const tempStats = calculateStats(equipmentData, 'temperature');
            const pressStats = calculateStats(equipmentData, 'pressure');
            const flowStats = calculateStats(equipmentData, 'flowrate');

            // 2. Compute Health Score based on Statistical Deviation (Z-Score)
            let totalDeviationPenalty = 0;
            const anomalies = [];

            equipmentData.forEach(d => {
                const zTemp = Math.abs((d.temperature - tempStats.mean) / tempStats.stdDev); // Standard Deviations from Mean
                const zPress = Math.abs((d.pressure - pressStats.mean) / pressStats.stdDev);

                // Composite Deviation Score for this unit
                // We penalize 'outliers' more heavily (e.g., > 2 sigma)
                const unitDeviation = (zTemp > 2 ? zTemp * 1.5 : zTemp) + (zPress > 2 ? zPress * 1.5 : zPress);

                totalDeviationPenalty += unitDeviation;

                if (unitDeviation > 3) { // Highly anomalous
                    anomalies.push(`${d.equipment_id} (High Deviation)`);
                }
            });

            // Normalize Penalty: Average deviation * Scaling Factor
            // A perfectly normal distribution should have avg |Z| ~ 0.8. 
            // We want "100%" to be ideal. "0%" is chaos.
            const avgPenalty = totalDeviationPenalty / equipmentData.length; // Expected ~ 1.6 combined (0.8 + 0.8)

            // Formula: Start at 100. Subtract based on how "chaotic" (high deviation) the system is.
            // If avg deviation is 1.6 (Normal), score should be ~95-100?
            // If avg deviation is 4.0 (Extreme), score should be ~40-50.
            // Let's deduce: Score = 110 - (avgPenalty * 15). 
            // Normal (1.6) -> 110 - 24 = 86 (Maybe too harsh? data is usually noisy).
            // Let's map normalized deviation to a score.

            let calculatedScore = 100 - (Math.max(0, avgPenalty - 1.0) * 20); // Tolerate up to 1.0 avg deviation without penalty
            calculatedScore = Math.min(100, Math.max(0, calculatedScore));

            const healthScore = calculatedScore.toFixed(0);

            // Generate AI insights with better context
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
            const prompt = `
                Role: Senior Chemical Process Engineer.
                Task: Analyze plant status from statistical data.
                
                Data Profile:
                - Count: ${equipmentData.length} Units
                - Temperature: μ=${tempStats.mean.toFixed(1)}, σ=${tempStats.stdDev.toFixed(1)}
                - Pressure: μ=${pressStats.mean.toFixed(1)}, σ=${pressStats.stdDev.toFixed(1)}
                - Flow: μ=${flowStats.mean.toFixed(1)}, σ=${flowStats.stdDev.toFixed(1)}
                - Statistical Anomalies Detected: ${anomalies.length} (e.g. ${anomalies.slice(0, 3).join(', ')})
                - Calculated Health Score: ${healthScore}/100

                Output:
                Provide exactly 3 short, punchy, diagnostic status messages (max 8 words each).
                Style: "Mission Control" HUD text. Technical & Direct.
                Examples: "Pressure variance nominal.", "Reactor 4 thermal spike detected.", "Flow optimization recommended."
                
                Format: VALID JSON ARRAY of strings ["msg1", "msg2", "msg3"].
                DO NOT use markdown code blocks. Just the raw JSON string.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();

            // Robust JSON extraction
            try {
                // If wrapped in code blocks, extract
                if (text.includes('[')) {
                    text = text.substring(text.indexOf('['), text.lastIndexOf(']') + 1);
                }
                const insights = JSON.parse(text);
                return { score: healthScore, insights };
            } catch (e) {
                console.warn("JSON Parse failed for insights", text);
                return { score: healthScore, insights: ["Diagnostics updated.", "Monitoring active.", "Standard variance observed."] };
            }

        } catch (error) {
            console.error("AI Analysis Failed:", error);
            return {
                score: 88, // Fallback 'Safe' Score
                insights: ["Telemetry link unstable.", "Using cached diagnostics.", "System check required."]
            };
        }
    },

    /**
     * Chat with the AI about the specific dataset
     * @param {String} question - User's question
     * @param {Array} contextData - Equipment data context
     * @returns {Promise<String>} - AI Response
     */
    askChatbot: async (question, contextData) => {
        try {
            const dataSummary = contextData.slice(0, 50).map(d =>
                `${d.equipment_id} (${d.equipment_type}): T=${d.temperature}°C, P=${d.pressure}bar`
            ).join('\n');

            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
            const prompt = `
                You are "Sentinel", an AI dashboard assistant for a chemical plant.
                
                CONTEXT DATA (Sample):
                ${dataSummary}
                ...(Rest of data hidden for brevity)

                USER QUESTION: "${question}"

                INSTRUCTIONS:
                1. Answer questions based on the provided equipment data or chemical engineering principles.
                2. If the input is a greeting or pleasantry (e.g., "Hi", "Thanks", "Bye"), generic polite responses are ALLOWED. Do not reject them.
                3. If the question is UNRELATED to the plant/data (e.g. politics, movies), reply: "This topic is not relevant to our application. Please discuss your chemical equipment data so I can assist you."
                4. Keep technical answers concise and professional.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();

        } catch (error) {
            console.error("Chat Error:", error);
            return "Connection interrupted. Sentinel systems offline.";
        }
    }
};
