// utils/models.ts

// Define the valid models that Groq supports with descriptions
export const VALID_MODELS = [
    {
      label: "DeepSeek R1 Distill (70B)",
      value: "deepseek-r1-distill-llama-70b",
      description: "Optimized for high-quality responses with efficient performance.",
    },
    {
      label: "Mixtral 8x7B",
      value: "mixtral-8x7b-32768",
      description: "Balances performance and speed for general-purpose tasks.",
    },
    {
      label: "Llama 3.3 70B Versatile",
      value: "llama-3.3-70b-versatile",
      description: "Versatile model suitable for a wide range of applications.",
    },
    {
      label: "Llama 3.1 8B Instant",
      value: "llama-3.1-8b-instant",
      description: "Provides quick responses for lightweight tasks.",
    },
    {
      label: "Llama 3.2 1B Preview",
      value: "llama-3.2-1b-preview",
      description: "Preview model for experimental features and testing.",
    },
    {
      label: "Llama 3.2 3B Preview",
      value: "llama-3.2-3b-preview",
      description: "Mid-sized preview model for development and evaluation.",
    },
  ] as const;
  
  // Define a type that enforces only the listed models
  export type ValidModel = typeof VALID_MODELS[number]['value'];
  
  // Default model (Ensure it's one of the supported types)
  export const DEFAULT_MODEL: ValidModel = "llama-3.3-70b-versatile";
  