export const VALID_MODELS = [
    {
      label: "DeepSeek R1 Distill (70B)",
      value: "deepseek-r1-distill-llama-70b",
      description: "High-quality, efficient responses.",
    },
    {
      label: "Mixtral 8x7B",
      value: "mixtral-8x7b-32768",
      description: "Balanced speed and accuracy.",
    },
    {
      label: "Llama 3.3 70B Versatile",
      value: "llama-3.3-70b-versatile",
      description: "Versatile for many tasks.",
    },
    {
      label: "Llama 3.1 8B Instant",
      value: "llama-3.1-8b-instant",
      description: "Fast responses, low latency.",
    },
    {
      label: "Llama 3.2 1B Preview",
      value: "llama-3.2-1b-preview",
      description: "Lightweight preview model.",
    },
    {
      label: "Llama 3.2 3B Preview",
      value: "llama-3.2-3b-preview",
      description: "Mid-sized preview model.",
    },
] as const;

export type ValidModel = typeof VALID_MODELS[number]['value'];

export const DEFAULT_MODEL: ValidModel = "deepseek-r1-distill-llama-70b";
