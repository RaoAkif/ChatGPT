import Groq from "groq-sdk";
import { scrapeUrl } from "../utils/scrapeUrl";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface PostRequestBody {
  query: string;
}

const academicPrompt = `You are an academic expert, you always cite your sources and base your responses only on the context that you have been provided`;
const markdownPrompt = `
You are tasked with generating a Markdown document. Ensure:
- Proper use of headings (e.g., ##, ###).
- No repeated or redundant sections.
- Clean, readable Markdown formatting.
- Avoid duplicating content or breaking list formatting.
`;

const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([a-zA-Z0-9()@:%.~#?&//=]*)/;

// Utility function to clean and format Markdown
function cleanMarkdown(response: string): string {
  return response
    .split("\n") // Split into lines
    .filter((line, index, lines) => lines.indexOf(line.trim()) === index) // Remove duplicates
    .map((line) => line.trim()) // Trim extra spaces
    .join("\n") // Join back into a string
    .replace(/\n{2,}/g, "\n\n"); // Ensure proper spacing between sections
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body: PostRequestBody = await req.json();
    const { query } = body;

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Missing required parameter: query" }),
        { status: 400 }
      );
    }

    const urls = query.match(urlPattern);
    let scrapedContent = "";

    if (urls) {
      const scrapedData = await scrapeUrl(urls[0]);
      scrapedContent = scrapedData.content;
    }

    // Generate the academic response
    const academicResponse: string = await groq.chat.completions
      .create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: academicPrompt },
          { role: "user", content: `${query.trim()} ${scrapedContent}` },
        ],
      })
      .then((chatCompletion) => chatCompletion.choices[0]?.message?.content || "");

    // Generate the Markdown response
    const markdownResponse: string = await groq.chat.completions
      .create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: markdownPrompt },
          { role: "user", content: academicResponse },
        ],
      })
      .then((chatCompletion) => chatCompletion.choices[0]?.message?.content || "");

    // Clean the Markdown response
    const cleanedMarkdown = cleanMarkdown(markdownResponse);

    console.log(cleanedMarkdown);

    return new Response(JSON.stringify({ data: cleanedMarkdown }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error occurred while processing POST request:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
