import { validUrl } from "@/util";
import { askGeminiAI } from "@/util/gemini";
import redis from "@/util/redis";

import { scrapePage } from "@/util/scrapper";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { url, question } = await req.json();

  if (!url) {
    return NextResponse.json({
      success: false,
      message: "url not found",
    });
  }

  try {
    const isValid = await validUrl(url);

    if (!isValid) {
      return NextResponse.json({
        success: false,
        message: "Invalid URL",
      });
    }
    const cachedHtml = await redis.get(`scraped-html:${url}`);

    let parsedHtml;

    if (cachedHtml) {
      console.log("Using cached HTML from Redis.");
      parsedHtml = JSON.parse(cachedHtml);
    } else {
      console.log("Scraping the page for HTML.");
      parsedHtml = await scrapePage(url);

      await redis.set(
        `scraped-html:${url}`,
        JSON.stringify(parsedHtml),
        "EX",
        1800
      );
    }

    const response = await askGeminiAI(parsedHtml, question, url);

    return NextResponse.json({
      success: true,
      message: "URL is valid",
      data: response,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "something went wrong",
    });
  }
}
