import JSZip from "jszip";
import { Novel, Episode } from "../types/database";
import { v4 as uuidv4 } from "uuid";

const generateContainerXml = () => `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
    <rootfiles>
        <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
    </rootfiles>
</container>`;

const extractImagesFromContent = (
  content: string
): { html: string; images: Array<{ data: string; id: string }> } => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const images: Array<{ data: string; id: string }> = [];

  // Find all images and replace them with references
  doc.querySelectorAll("img").forEach((img, index) => {
    const imageId = `image_${index}`;
    const src = img.getAttribute("src");
    if (src && src.startsWith("data:image/")) {
      images.push({ data: src, id: imageId });
      // Update img tag with correct path for EPUB and ensure it's self-closing
      img.setAttribute("src", `../images/${imageId}.png`);
      img.setAttribute("alt", `image ${imageId}`);
    }
  });

  return {
    html: doc.documentElement.outerHTML,
    images,
  };
};

const generateContentOpf = (
  novel: Novel,
  episodes: Episode[],
  imageIds: string[]
) => {
  const uuid = uuidv4();
  let manifest = "";
  let spine = "";

  // Add nav and style items
  manifest +=
    '        <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>\n';
  manifest +=
    '        <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>\n';
  manifest +=
    '        <item id="style" href="style.css" media-type="text/css"/>\n';

  // Add chapter items with proper order
  episodes.forEach((episode, index) => {
    const chapterId = `chapter${index + 1}`;
    manifest += `        <item id="${chapterId}" href="xhtml/${chapterId}.xhtml" media-type="application/xhtml+xml"/>\n`;
    spine += `        <itemref idref="${chapterId}"/>\n`;
  });

  // Add image items to manifest
  imageIds.forEach((imageId) => {
    manifest += `        <item id="${imageId}" href="images/${imageId}.png" media-type="image/png"/>\n`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id">
    <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
        <dc:identifier id="pub-id">urn:uuid:${uuid}</dc:identifier>
        <dc:title>${novel.title}</dc:title>
        <dc:creator id="creator">${novel.author || "Anonymous"}</dc:creator>
        <dc:language>en</dc:language>
        <dc:date>${new Date().toISOString().split("T")[0]}</dc:date>
        <meta property="dcterms:modified">${
          new Date().toISOString().split(".")[0]
        }Z</meta>
        <meta name="cover" content="cover-image" />
    </metadata>
    <manifest>
${manifest}    </manifest>
    <spine toc="ncx">
${spine}    </spine>
    <guide>
        <reference type="toc" title="Table of Contents" href="nav.xhtml"/>
        <reference type="text" title="Beginning" href="xhtml/chapter1.xhtml"/>
    </guide>
</package>`;
};

const generateNavXhtml = (novel: Novel, episodes: Episode[]) => {
  const chapters = episodes.map((episode, index) => ({
    id: `chapter${index + 1}`,
    title: episode.title,
  }));

  const chapterList = chapters
    .map(
      (chapter) =>
        `            <li><a href="xhtml/${chapter.id}.xhtml">${chapter.title}</a></li>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
<head>
    <meta charset="UTF-8"/>
    <title>${novel.title} - Table of Contents</title>
    <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
    <nav id="toc" epub:type="toc">
        <h1>Table of Contents</h1>
        <ol>
${chapterList}
        </ol>
    </nav>
</body>
</html>`;
};

const generateTocNcx = (novel: Novel, episodes: Episode[]) => {
  const navPoints = episodes
    .map(
      (episode, index) => `
    <navPoint id="chapter${index + 1}" playOrder="${index + 1}">
        <navLabel>
            <text>${episode.title}</text>
        </navLabel>
        <content src="xhtml/chapter${index + 1}.xhtml"/>
    </navPoint>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
    <head>
        <meta name="dtb:uid" content="urn:uuid:${uuidv4()}"/>
        <meta name="dtb:depth" content="1"/>
        <meta name="dtb:totalPageCount" content="0"/>
        <meta name="dtb:maxPageNumber" content="0"/>
    </head>
    <docTitle>
        <text>${novel.title}</text>
    </docTitle>
    <navMap>
${navPoints}
    </navMap>
</ncx>`;
};

const cleanHtml = (content: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");

  const cleanup = (node: Element) => {
    if (node.tagName.toLowerCase() === "img") {
      // Ensure img tag is properly formatted
      const src = node.getAttribute("src");
      const alt = node.getAttribute("alt");
      if (src) {
        node.setAttribute("src", src);
        node.setAttribute("alt", alt || "");
      }
      return;
    }

    // Clean other elements
    Array.from(node.attributes).forEach((attr) => {
      if (!["href", "src", "alt"].includes(attr.name)) {
        node.removeAttribute(attr.name);
      }
    });

    // Keep paragraphs that have images
    if (node.tagName.toLowerCase() === "p") {
      const hasImage = node.querySelector("img");
      const hasText = node.textContent?.trim();
      if (!hasImage && !hasText) {
        node.remove();
        return;
      }
    }

    // Process child elements
    Array.from(node.children).forEach(cleanup);
  };

  Array.from(doc.body.children).forEach(cleanup);

  // Ensure proper XML formatting for img tags
  const html = doc.body.innerHTML
    .replace(/<img([^>]*)>/g, "<img$1/>")
    .replace(/\s+/g, " ")
    .trim();

  return html;
};

const generateChapterXhtml = (episode: Episode) => {
  // First extract images and get processed HTML
  const { html: processedHtml, images } = extractImagesFromContent(
    episode.content
  );

  // Then clean the HTML while preserving img tags
  const cleanContent = cleanHtml(processedHtml);

  const chapterContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
<head>
    <meta charset="UTF-8"/>
    <title>${episode.title}</title>
    <link rel="stylesheet" type="text/css" href="../style.css"/>
</head>
<body>
    <section epub:type="chapter">
        <h1 id="chapter-heading">${episode.title}</h1>
        ${cleanContent}
    </section>
</body>
</html>`;

  return {
    content: chapterContent,
    images: images,
  };
};

// Update the CSS to better style the ToC
const generateStyleCss = () => `
body {
    margin: 5% auto;
    max-width: 800px;
    line-height: 1.6;
    font-size: 1.2em;
    color: #222;
    padding: 0 10px;
    font-family: system-ui, -apple-system, sans-serif;
}

h1 {
    line-height: 1.2;
    text-align: center;
    margin-bottom: 2em;
}

p {
    margin: 1em 0;
    text-indent: 1.5em;
}

div.chapter-content > * {
    margin: 1em 0;
}

nav[epub|type="toc"] {
    margin: 5% auto;
    max-width: 800px;
}

nav[epub|type="toc"] ol {
    list-style-type: none;
    margin: 1em 0;
    padding: 0;
}

nav[epub|type="toc"] li {
    margin: 0.5em 0;
}

nav[epub|type="toc"] a {
    color: #0066cc;
    text-decoration: none;
}

nav[epub|type="toc"] a:hover {
    text-decoration: underline;
}
`;

const processBase64Image = async (dataUrl: string): Promise<Blob> => {
  // Extract the base64 data from the data URL
  const base64Data = dataUrl.split(",")[1];
  // Convert base64 to blob
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  return new Blob([new Uint8Array(byteNumbers)], { type: "image/png" });
};

export const generateEpub = async (
  novel: Novel,
  episodes: Episode[]
): Promise<Blob> => {
  const zip = new JSZip();
  const allImages = new Map<string, string>();

  // Process all episodes to extract images and clean content
  const processedEpisodes = episodes.map((episode, episodeIndex) => {
    const { content, images } = generateChapterXhtml(episode);
    // Add episode index to ensure unique image IDs across chapters
    let newContent = content;
    for (const img of images) {
      const uniqueId = `ep${episodeIndex}_${img.id}`;
      allImages.set(uniqueId, img.data);
      // Update the content to use the new unique ID
      newContent = newContent.replace(
        new RegExp(`images/${img.id}.png`, "g"),
        `images/${uniqueId}.png`
      );
    }
    return {
      ...episode,
      newContent,
    };
  });

  // Add mimetype file (must be first and uncompressed)
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });

  // Add META-INF/container.xml
  zip.folder("META-INF")?.file("container.xml", generateContainerXml());

  // Add OEBPS content
  const oebps = zip.folder("OEBPS");
  if (!oebps) throw new Error("Failed to create OEBPS directory");

  // Add content.opf and nav files
  oebps.file(
    "content.opf",
    generateContentOpf(novel, processedEpisodes, Array.from(allImages.keys()))
  );
  oebps.file("nav.xhtml", generateNavXhtml(novel, processedEpisodes));
  oebps.file("toc.ncx", generateTocNcx(novel, processedEpisodes));

  // Add images
  const imagesFolder = oebps.folder("images");
  if (!imagesFolder) throw new Error("Failed to create images directory");

  // Process and add all images using the Map
  await Promise.all(
    Array.from(allImages.entries()).map(async ([id, data]) => {
      try {
        const imageBlob = await processBase64Image(data);
        imagesFolder.file(`${id}.png`, imageBlob);
      } catch (error) {
        console.error(`Failed to process image ${id}:`, error);
      }
    })
  );

  // Add other content
  oebps.file("style.css", generateStyleCss());

  // Create xhtml folder for chapters
  const xhtmlFolder = oebps.folder("xhtml");
  if (!xhtmlFolder) throw new Error("Failed to create xhtml directory");

  // Add chapters
  processedEpisodes.forEach((episode, index) => {
    xhtmlFolder.file(`chapter${index + 1}.xhtml`, episode.newContent);
  });

  // Generate the epub file with proper options
  return await zip.generateAsync({
    type: "blob",
    mimeType: "application/epub+zip",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
    platform: "UNIX",
  });
};

export const downloadNovel = async (novel: Novel, episodes: Episode[]) => {
  try {
    const epub = await generateEpub(novel, episodes);
    const url = URL.createObjectURL(epub);

    // Create and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = `${novel.title.replace(/[^\w\s-]/g, "")}.epub`.trim();

    // Need to append to document for Firefox
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error("Failed to generate EPUB:", error);
    throw error;
  }
};
