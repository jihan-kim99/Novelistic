import JSZip from "jszip";
import { db } from "./db";
import { Novel, Episode } from "../types/database";

interface EpubChapter {
  title: string;
  content: string;
  order: number;
}

const getImageAsBase64 = async (imageBuffer: Uint8Array): Promise<string> => {
  const blob = new Blob([imageBuffer], { type: "image/png" });
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

async function extractChapterContent(
  text: string,
  zip: JSZip
): Promise<string> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");

  // Find the main content section
  const content = doc.querySelector("body section") || doc.body;

  // Convert all relative image paths to base64 (if any)
  const images = content.querySelectorAll("img");
  for (const img of images) {
    const src = img.getAttribute("src");
    if (src) {
      try {
        // Handle the relative path to OEBPS/images
        let imagePath = src;
        if (src.startsWith("../images/")) {
          // Direct path to OEBPS/images folder
          imagePath = `OEBPS/images/${src.replace("../images/", "")}`;
        } else if (src.includes("images/")) {
          // Handle other possible image paths
          imagePath = `OEBPS/${src}`;
        }

        const imageFile = zip.file(imagePath);
        if (imageFile) {
          const imageBuffer = await imageFile.async("uint8array");
          const base64Data = await getImageAsBase64(imageBuffer);
          img.setAttribute("src", base64Data);
        } else {
          console.warn(`Image not found in EPUB: ${imagePath}`);
        }
      } catch (error) {
        console.error(`Failed to process image: ${src}`, error);
      }
    }

    // Remove any existing classes
    img.removeAttribute("class");
    // Ensure proper self-closing tag format
    img.outerHTML = img.outerHTML.replace(/>$/, "/>");
  }

  return content.innerHTML.trim();
}

async function parseEpub(
  file: File,
  title: string
): Promise<{ novel: Novel; episodes: Episode[] }> {
  const zip = await JSZip.loadAsync(file);

  // Find the OPF file
  const containerXml = await zip.file("META-INF/container.xml")?.async("text");
  if (!containerXml) throw new Error("Invalid EPUB: Missing container.xml");

  const opfPath = containerXml.match(/full-path="([^"]+)"/)?.[1];
  if (!opfPath) throw new Error("Invalid EPUB: Cannot find OPF file path");

  const opfContent = await zip.file(opfPath)?.async("text");
  if (!opfContent) throw new Error("Invalid EPUB: Missing OPF file");

  const parser = new DOMParser();
  const opfDoc = parser.parseFromString(opfContent, "text/xml");

  // Extract metadata
  const author = opfDoc.querySelector("dc\\:creator")?.textContent || "Unknown";

  // Get the spine order and manifest items
  const itemRefs = Array.from(opfDoc.querySelectorAll("spine itemref")).map(
    (item) => item.getAttribute("idref")
  );
  const manifestItems = new Map(
    Array.from(opfDoc.querySelectorAll("manifest item")).map((item) => [
      item.getAttribute("id"),
      item.getAttribute("href"),
    ])
  );

  // Get the EPUB root directory from OPF path
  const rootDir = opfPath.split("/").slice(0, -1).join("/");
  const chapters: EpubChapter[] = [];

  // Process each chapter in spine order
  let order = 0;
  for (const idref of itemRefs) {
    if (!idref) continue;
    const href = manifestItems.get(idref);
    if (!href) continue;

    // Skip nav and cover files
    if (href.includes("nav") || href.includes("cover")) continue;

    const chapterPath = `${rootDir}/${href}`;
    const chapterContent = await zip.file(chapterPath)?.async("text");
    if (!chapterContent) continue;

    const chapterDoc = parser.parseFromString(chapterContent, "text/html");
    const title =
      chapterDoc.querySelector("title")?.textContent ||
      chapterDoc.querySelector("h1")?.textContent ||
      `Chapter ${order + 1}`;

    const content = await extractChapterContent(chapterContent, zip);

    chapters.push({
      title,
      content,
      order: order++,
    });
  }

  // Create novel and episodes
  const novel: Novel = {
    title,
    author,
    createdAt: new Date(),
    updatedAt: new Date(),
    notes: {
      characters: [],
      settings: [],
      plotPoints: [],
    },
  };

  // Save novel first to get its ID
  const novelId = await db.saveNovel(novel);
  novel.id = novelId;

  // Create and save episodes
  const episodes: Episode[] = await Promise.all(
    chapters.map(async (chapter) => {
      const episode: Episode = {
        novelId,
        title: chapter.title,
        content: chapter.content,
        order: chapter.order,
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: {
          characters: [],
          settings: [],
          plotPoints: [],
          style: "",
        },
      };
      const episodeId = await db.saveEpisode(episode);
      episode.id = episodeId;
      return episode;
    })
  );

  return { novel, episodes };
}

export const uploadNovel = async (
  file: File,
  title: string
): Promise<{ novel: Novel; episodes: Episode[] }> => {
  try {
    if (!file.name.toLowerCase().endsWith(".epub")) {
      throw new Error("Invalid file type. Please upload an EPUB file.");
    }

    const result = await parseEpub(file, title);
    return result;
  } catch (error) {
    console.error("Error uploading novel:", error);
    throw error;
  }
};
