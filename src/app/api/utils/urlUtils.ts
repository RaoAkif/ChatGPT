import { scrapeUrl } from "./scrapeUrl";

const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([a-zA-Z0-9()@:%.~#?&//=]*)/;

/**
 * Extracts URLs from a given text.
 * @param text The input text to extract URLs from.
 * @returns An array of extracted URLs.
 */
export function extractUrls(text: string): string[] {
  return text.match(urlPattern) || [];
}

/**
 * Scrapes content from the given URL.
 * @param url The URL to scrape.
 * @returns Scraped content as a string.
 */
export async function fetchScrapedContent(url: string): Promise<string> {
  try {
    const scrapedData = await scrapeUrl(url);
    return scrapedData?.content || "";
  } catch (error) {
    console.error(`Failed to scrape content from ${url}:`, error);
    return "";
  }
}
