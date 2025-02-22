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

    // Extract all valid model values into an array for easy checking
    const validModelValues: ValidModel[] = VALID_MODELS.map((m) => m.value);

    // Check if the provided model exists in the valid models
    const selectedModel: ValidModel = validModelValues.includes(model as ValidModel)
      ? (model as ValidModel)
      : DEFAULT_MODEL;

    const urls = extractUrls(query);
    const scrapedContent = urls.length > 0 ? await fetchScrapedContent(urls[0]) : "";

    const academicResponse = await groq.chat.completions
      .create({
        model: selectedModel,
        messages: [
          { role: "system", content: "You are an advanced AI assistant providing expert-level responses." },
          { role: "user", content: `${query.trim()} ${scrapedContent}` },
        ],
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((chatCompletion: { choices: { message: { content: any; }; }[]; }) => chatCompletion.choices?.[0]?.message?.content || "");

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
