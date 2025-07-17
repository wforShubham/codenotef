require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const cn = require("../middleware/cn");

const router = express.Router();
const API_KEY = process.env.OPENROUTER_KEY;

// List of models to try (fallback if one fails)
const models = [
  "google/gemini-2.5-pro-exp-03-25:free", // First choice (Gemini)
  "gpt-4-turbo",                           // Second choice (GPT-4 Turbo)
  "mistral-7b"                             // Third choice (Mistral 7B)
];

async function analyzeComplexity(code) {
  for (let model of models) {
    try {
      console.log(`Trying model: ${model}...`);
      
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "user",
              content: `Analyze the following code and provide only time complexity and space complexity in format: 
                        Space Complexity: (value)
                        Time Complexity: (value)\n\n${code}`,
            },
          ],
        }),
      });

      if (response.status === 429) {
        console.warn(`Quota exceeded for ${model}, trying next model...`);
        continue; // Try the next model in the list
      }

      const data = await response.json();
      
      if (data.error) {
        console.error(`Error from ${model}:`, data.error.message);
        continue; // Try next model if an error occurs
      }

      return data.choices[0]?.message?.content || "Analysis failed"; // Return the complexity analysis
    } catch (error) {
      console.error(`Failed with ${model}:`, error);
    }
  }

  return "All models failed, please try again later."; // If all models fail
}

// Route to analyze complexity
router.post("/analyze-complexity", cn, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }

    const complexity = await analyzeComplexity(code);
    res.json({ complexity });
  } catch (error) {
    console.error("Error analyzing complexity:", error);
    res.status(500).json({ error: "Failed to analyze complexity" });
  }
});

// ✅ Correct CommonJS export
module.exports = router;
