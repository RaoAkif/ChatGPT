// utils/scrapeUrl.ts
import axios from "axios";
import * as cheerio from "cheerio";
import { cleanText } from "./cleanText";

export interface ScrapedData {
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

export async function scrapeUrl(url: string): Promise<ScrapedData> {
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
