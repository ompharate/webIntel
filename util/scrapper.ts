import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapePage(url: string): Promise<string> {
    try {
      const { data: html } = await axios.get(url);
      const $ = cheerio.load(html);
 
      const extractedText = $('body')
        .find('h1, h2, h3, p, li') 
        .map((i, el) => $(el).text())
        .get()
        .join('\n'); 
  
      return extractedText ? extractedText : 'No content found';
    } catch (error) {
      console.error('Error scraping the page:', error);
      throw new Error('Failed to scrape the page');
    }
  }
