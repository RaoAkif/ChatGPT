// api/chat/route.ts
import Groq from "groq-sdk";
import puppeteer from "puppeteer";
import * as cheerio from 'cheerio';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface PostRequestBody {
  query: string;
}

const prompt = `You are an expert to generate a beautiful, well-structured Markdown-formatted answer for the following query:`;

async function fetchHTML(url: string): Promise<string> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  const content = await page.content();
  await browser.close();
  return content;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body: PostRequestBody = await req.json();
    const { query } = body;

    console.log(query);

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Missing required parameter: query" }),
        { status: 400 }
      );
    }

    // Check for a URL in the query
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = query.match(urlRegex);

    let scrapedContent = '';
    
    if (urls) {
      scrapedContent = await fetchHTML(urls[0]);
      const $ = cheerio.load(scrapedContent);
      scrapedContent = $('body').text();
    }

    const completion: string = await groq.chat.completions
      .create({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: `${query.trim()} ${scrapedContent}` },
        ],
      })
      .then((chatCompletion) => chatCompletion.choices[0]?.message?.content || "");

    return new Response(JSON.stringify({ data: completion }), {
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
