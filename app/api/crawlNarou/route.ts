
import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { text } from "stream/consumers";


async function crawlWebsite(url: string): Promise<string> {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
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

export async function POST(req: NextApiRequest) {
  const body = await text(req.body);

  const url = JSON.parse(body).url;

  const lightJson = await crawlWebsite(url);

  const lightText = JSON.parse(lightJson).honbun;
  const subTitle = JSON.parse(lightJson).subTitle;
  
  return NextResponse.json({ lightText: lightText, subTitle: subTitle }, { status: 200 });
}