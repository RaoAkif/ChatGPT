import Groq from "groq-sdk";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface PostRequestBody {
  url: string;
  query: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body: PostRequestBody = await req.json();
    const { url, query } = body;

    if (!url || !query) {
      return new Response(JSON.stringify({ error: "Missing required parameters: url or query" }), { status: 400 });
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const htmlContent: string = await page.content();
    await browser.close();

    cheerio.load(htmlContent);

    const completion: string = await groq.chat.completions
      .create({
        messages: [{ role: "user", content: query }],
        model: "llama3-8b-8192",
      })
      .then((chatCompletion) => chatCompletion.choices[0]?.message?.content || "");

    return new Response(JSON.stringify({ data: completion }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}