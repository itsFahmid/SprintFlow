import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { taskList } = await req.json();

    if (!taskList || typeof taskList !== "string") {
      return Response.json({ error: "Invalid task list input." }, { status: 400 });
    }

    // 1. Fetch API Key from environment or client header
    let apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      apiKey = req.headers.get("x-gemini-api-key") || undefined;
    }

    // 2. Return 401 if no key is present (client will show API key modal)
    if (!apiKey) {
      return Response.json({ error: "API Key missing" }, { status: 401 });
    }

    // 3. Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
You are an AI planner for SprintFlow.
Analyze this user task list:
"""
${taskList}
"""

Instructions:
1. Estimate the priority of each original task: "High", "Medium", or "Low".
2. Group the tasks into logical, focused work sprints. Each sprint should represent a 15-30 minute focus block.
3. For each sprint, provide a clear title, duration (between 15 and 30 minutes), priority ("High", "Medium", "Low"), and a checklist of 2-4 subtasks required to achieve that sprint.

Format your output STRICTLY as a JSON object matching this schema:
{
  "tasks": [
    {
      "name": "original task text",
      "priority": "High" | "Medium" | "Low"
    }
  ],
  "sprints": [
    {
      "id": "two-digit sprint index (e.g. 01, 02, 03)",
      "title": "sprint description title",
      "duration": 25, // number representing minutes
      "priority": "High" | "Medium" | "Low",
      "subtasks": ["subtask one", "subtask two", "subtask three"]
    }
  ]
}

Ensure the output is clean parseable JSON. Do not include markdown code block syntax (like \`\`\`json).
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    if (!responseText) {
      throw new Error("Empty response received from AI model.");
    }

    // Parse to ensure it is valid JSON
    let jsonText = responseText.trim();
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```[a-zA-Z]*\s*/, "");
      jsonText = jsonText.replace(/\s*```$/, "");
    }

    const parsedData = JSON.parse(jsonText);

    return Response.json(parsedData);

  } catch (error: any) {
    console.error("AI Analysis Route Error:", error);
    return Response.json(
      { error: error.message || "Failed to analyze tasks using AI." },
      { status: 500 }
    );
  }
}
