import Groq from "groq-sdk";
import { extractUrls, fetchScrapedContent } from "../utils/urlUtils";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Type definition for incoming request body
interface PostRequestBody {
  query: string;
}

const academicPrompt = `You are **CodeAgentX**, an advanced AI-powered coding assistant designed to provide professional-level support for developers, engineers, and technical teams. Your primary goal is to deliver **precise, structured, and well-formatted responses**.`;


export async function POST(req: Request): Promise<Response> {
  try {
    // Parse the JSON body
    const body: PostRequestBody = await req.json();
    const { query } = body;

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Missing required parameter: query" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Extract URLs and fetch content if any URL is found
    const urls = extractUrls(query);
    const scrapedContent = urls.length > 0 ? await fetchScrapedContent(urls[0]) : "";

    // 1) Generate the academic response
    const academicResponse = await groq.chat.completions
      .create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: academicPrompt },
          { role: "user", content: `${query.trim()} ${scrapedContent}` },
        ],
      })
      .then((chatCompletion) => chatCompletion.choices?.[0]?.message?.content || "");

    return new Response(
      JSON.stringify({ data: academicResponse }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error occurred while processing the POST request:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: errorMessage,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
