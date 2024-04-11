
import { NextRequest, NextResponse } from "next/server";
import { JSDOM } from 'jsdom';
import { streamToString } from "@/utils/streamToString";

async function crawlWebsite(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch the website url' + url + ' with status code ' + response.status + ' and status text ' + response.statusText);
    }
    const html = await response.text();
    const dom = new JSDOM(html);
    const novelHonbun = dom.window.document.querySelector('#novel_honbun');
    const novelSubTitle = dom.window.document.querySelector('p.novel_subtitle');
    const novelJson = {
      subTitle: novelSubTitle?.textContent,
      honbun: novelHonbun?.textContent,
    };
    return JSON.stringify(novelJson);

  } catch (error) {
    console.error('Error occurred while crawling the website:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  const body = await streamToString(req.body)

  const url = JSON.parse(body).url;

  const lightJson = await crawlWebsite(url);

  const lightText = JSON.parse(lightJson).honbun;
  const subTitle = JSON.parse(lightJson).subTitle;
  
  return NextResponse.json({ lightText: lightText, subTitle: subTitle }, { status: 200 });
}
