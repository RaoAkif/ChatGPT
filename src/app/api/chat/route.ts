import Groq from "groq-sdk";
import { scrapeUrl } from "../utils/scrapeUrl";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Type definition for incoming request body
interface PostRequestBody {
  query: string;
}

const academicPrompt = `You are an academic expert; you always cite your sources and base your responses only on the context that you have been provided.`;
const markdownPrompt = `
You are tasked with generating a Markdown document. Ensure:
- Proper use of headings (e.g., ##, ###).
- No repeated or redundant sections.
- Clean, readable Markdown formatting.
- Avoid duplicating content or breaking list formatting.
`;

const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([a-zA-Z0-9()@:%.~#?&//=]*)/;

/**
 * Utility function to clean and format Markdown output.
 * - Removes duplicate lines
 * - Trims spaces
 * - Ensures proper spacing between sections
 */
function cleanMarkdown(response: string): string {
  return response
    .split("\n") // Split into lines
    .filter((line, idx, arr) => {
      const trimmed = line.trim();
      // Keep only unique trimmed lines (avoids accidental duplicates)
      return trimmed !== "" && arr.indexOf(trimmed) === idx;
    })
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{2,}/g, "\n\n");
}

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

    // Check if the user query contains a URL
    const urls = query.match(urlPattern);
    let scrapedContent = "";

    // If we find a URL, scrape content from the first match
    if (urls) {
      const scrapedData = await scrapeUrl(urls[0]);
      scrapedContent = scrapedData?.content || "";
    }

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

    // 2) Generate the Markdown response
    const markdownResponse = await groq.chat.completions
      .create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: markdownPrompt },
          { role: "user", content: academicResponse },
        ],
      })
      .then((chatCompletion) => chatCompletion.choices?.[0]?.message?.content || "");

    // Clean the Markdown output
    const cleanedMarkdown = cleanMarkdown(markdownResponse);

    return new Response(
      JSON.stringify({ data: cleanedMarkdown }),
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
