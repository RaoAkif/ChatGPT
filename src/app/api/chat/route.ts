// api/chat/route.ts
import Groq from "groq-sdk";
import axios from "axios";
import * as cheerio from "cheerio";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface PostRequestBody {
  query: string;
}

const academicPrompt = `You are an academic expert, you always cite your sources and base your responses only on the context that you have been provided`;
const markdownPrompt = `Format this response keeping the following markdown formatting standard:

**Ideal Line Spacing, Indentation, and Formatting for Headings, Text, and Lists**

1. **Headings and Subheadings (hx tags)**:
    - **Heading 1 (h1)**:
        - **Spacing Above**: 1.5x line-height (provides clear separation from previous content).
        - **Spacing Below**: 1x line-height (keeps it distinct from the body text).
        - **Indentation**: None (align to the left margin).
        - **Font Size**: 36pt (for clear hierarchy).
        - **Font Weight**: Bold or extra bold to stand out.
    - **Heading 2 (h2)**:
        - **Spacing Above**: 1.5x line-height.
        - **Spacing Below**: 1x line-height.
        - **Indentation**: None (align to the left margin).
        - **Font Size**: 28pt.
        - **Font Weight**: Semi-bold.
    - **Heading 3 (h3)**:
        - **Spacing Above**: 1x line-height.
        - **Spacing Below**: 0.5x line-height.
        - **Indentation**: None (align to the left margin).
        - **Font Size**: 22pt.
        - **Font Weight**: Regular or semi-bold.
    - **Heading 4 (h4)**:
        - **Spacing Above**: 0.5x line-height.
        - **Spacing Below**: 0.5x line-height.
        - **Indentation**: None (align to the left margin).
        - **Font Size**: 18pt.
        - **Font Weight**: Regular.
    - **Heading 5 (h5)** and **Heading 6 (h6)**:
        - **Spacing Above**: 0.5x line-height.
        - **Spacing Below**: 0.5x line-height.
        - **Indentation**: None (align to the left margin).
        - **Font Size**: 14pt and 12pt respectively.
        - **Font Weight**: Regular.
    - **General**:
        - Use consistent font style throughout headings (e.g., sans-serif for a modern feel or serif for a formal approach).
        - Ensure line spacing is consistent throughout the document to improve readability (recommended line-height: 1.5x).
2. **Body Text**:
    - **Spacing Above**: 0.5x line-height.
    - **Spacing Below**: 1.0x line-height (creates visual balance between paragraphs).
    - **Indentation**:
        - **First Line of Paragraph**: 0.5 inches (to clearly distinguish each new paragraph).
        - **Subsequent Lines**: No additional indentation (standard paragraph style).
    - **Font Size**: 12pt (for comfortable reading).
    - **Line Spacing**: 1.5x (for readability).
    - **Alignment**: Left-aligned (widely accepted for readability).
3. **Lists**:
    - **Ordered List (OL)**:
        - **Spacing Above**: 1x line-height.
        - **Spacing Below**: 0.5x line-height.
        - **Indentation**:
            - First-level items: 1 inch from left margin.
            - Nested items: 1.5 inches (for clear hierarchical distinction).
        - **Numbering**: Standard numerals (1, 2, 3) for clear sequencing.
        - **Line Spacing**: 1.5x between list items for easy reading.
    - **Unordered List (UL)**:
        - **Spacing Above**: 1x line-height.
        - **Spacing Below**: 0.5x line-height.
        - **Indentation**:
            - First-level items: 1 inch from left margin.
            - Nested items: 1.5 inches.
        - **Bullet Style**: Standard dot bullet or square for a neat appearance.
        - **Line Spacing**: 1.5x between list items.
    - **Sub-lists**: Maintain consistent indentation (sublevel list items indented 1.5x more than their parent item).
4. **Blockquotes**:
    - **Spacing Above**: 1.5x line-height.
    - **Spacing Below**: 1.5x line-height.
    - **Indentation**: 1 inch from both left and right margins.
    - **Font Style**: Italicized or light italic for distinction.
    - **Line Spacing**: 1.5x for readability, ensuring the quote doesn’t look cramped.
5. **Other Elements (Hyperlinks, Footnotes, etc.)**:
    - **Hyperlinks**: Should be underlined with a distinct color (usually blue) to clearly stand out from regular text. Ensure no indentation.
    - **Footnotes/Endnotes**:
        - **Spacing Above**: 1x line-height.
        - **Spacing Below**: 1.5x line-height.
        - **Indentation**: 0.5 inches.
        - **Font Size**: Smaller than the body text, typically 10pt.`;

export const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([a-zA-Z0-9()@:%.~#?&//=]*)/;

interface CleanTextFunction {
  (text: string): string;
}

const cleanText: CleanTextFunction = (text: string): string => {
  return text.replace(/\s+/g, " ").trim();
};

interface ScrapedData {
  url: string;
  title: string;
  metaDescription: string;
  headings: {
    h1: string;
    h2: string;
  };
  paragraphs: string;
  listItems: string;
  links: { text: string; href: string }[];
  images: { alt: string; src: string }[];
  content: string;
  error: string | null;
}

async function scrapeUrl(url: string): Promise<ScrapedData> {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    $("script, style, noscript, iframe").remove();
    const title = cleanText($("title").text() || "No Title");
    const metaDescription = cleanText(
      $('meta[name="description"]').attr("content") || ""
    );
    const h1 = $("h1")
      .map((_, el) => cleanText($(el).text()))
      .get()
      .join(" ");
    const h2 = $("h2")
      .map((_, el) => cleanText($(el).text()))
      .get()
      .join(" ");
    const paragraphs = $("p")
      .map((_, el) => cleanText($(el).text()))
      .get()
      .join(" ");
    const listItems = $("li")
      .map((_, el) => cleanText($(el).text()))
      .get()
      .join(" ");
    const links = $("a[href]")
      .map((_, el) => ({
        text: cleanText($(el).text()),
        href: $(el).attr("href") || "",
      }))
      .get();
    const images = $("img[alt]")
      .map((_, el) => ({
        alt: cleanText($(el).attr("alt") || ""),
        src: $(el).attr("src") || "",
      }))
      .get();
    const allText = $("body *")
      .not("script, style, noscript, iframe")
      .map((_, el) => cleanText($(el).text()))
      .get()
      .join(" ");
    let combinedContent = [
      title,
      metaDescription,
      h1,
      h2,
      paragraphs,
      listItems,
      allText,
    ].join(" ");
    combinedContent = cleanText(combinedContent).slice(0, 10000);
    return {
      url,
      title,
      metaDescription,
      headings: {
        h1,
        h2,
      },
      paragraphs,
      listItems,
      links,
      images,
      content: combinedContent,
      error: null,
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return {
      url,
      title: "",
      metaDescription: "",
      headings: {
        h1: "",
        h2: "",
      },
      paragraphs: "",
      listItems: "",
      links: [],
      images: [],
      content: "",
      error: error instanceof Error ? error.message : String(error),
    };
  }
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

    console.log(scrapedContent)

    const academicResponse: string = await groq.chat.completions
      .create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: academicPrompt },
          { role: "user", content: `${query.trim()} ${scrapedContent}` },
        ],
      })
      .then((chatCompletion) => chatCompletion.choices[0]?.message?.content || "");

    const markdownResponse: string = await groq.chat.completions
      .create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: markdownPrompt },
          { role: "user", content: academicResponse },
        ],
      })
      .then((chatCompletion) => chatCompletion.choices[0]?.message?.content || "");

    return new Response(JSON.stringify({ data: markdownResponse }), {
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