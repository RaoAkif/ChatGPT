import Groq from "groq-sdk"; 
import { extractUrls, fetchScrapedContent } from "../utils/urlUtils";
import { VALID_MODELS, ValidModel, DEFAULT_MODEL } from "../utils/models";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface PostRequestBody {
  query: string;
  model?: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body: PostRequestBody = await req.json();
    const { query, model } = body;

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Missing required parameter: query" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate the selected model and default to DEFAULT_MODEL if invalid
    const selectedModel: ValidModel = VALID_MODELS.includes(model as ValidModel) ? (model as ValidModel) : DEFAULT_MODEL;

    const urls = extractUrls(query);
    const scrapedContent = urls.length > 0 ? await fetchScrapedContent(urls[0]) : "";

    const academicResponse = await groq.chat.completions
      .create({
        model: selectedModel,  // ✅ Now dynamically selected
        messages: [
          { role: "system", content: "You are an advanced AI assistant providing expert-level responses." },
          { role: "user", content: `${query.trim()} ${scrapedContent}` },
        ],
      })
      .then((chatCompletion) => chatCompletion.choices?.[0]?.message?.content || "");

    return new Response(
      JSON.stringify({ data: academicResponse }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: errorMessage,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
