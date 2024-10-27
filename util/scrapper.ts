import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapePage(url: string, customSelector?: string): Promise<string> {
    try {
        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);


        const selector = customSelector || 'body h1, body h2, body h3, body p, body li, body div, body span, body article';
        const extractedElements = $(selector);

        if (extractedElements.length === 0) {
            return 'No content found';
        }

        
        const extractedText = extractedElements
            .map((i, el) => $(el).text().trim())
            .get()
            .filter(text => text)  
            .join('\n');

        return extractedText || 'No content found';
    } catch (error) {
        console.error('Error scraping the page:', error);
        throw new Error('Failed to scrape the page');
    }
}
