import pptxgen from "pptxgenjs";
import { marked } from "marked";

interface Frontmatter {
  title?: string;
  description?: string;
  presenter?: string;
  date?: string;
  [key: string]: string | undefined;
}

/**
 * Converts markdown content to plain text by stripping HTML tags and handling basic markdown
 */
function markdownToPlainText(markdown: string): string {
  // Parse markdown to HTML first
  const html = marked.parse(markdown) as string;
  
  // Strip HTML tags
  const withoutTags = html.replace(/<[^>]*>/g, "");
  
  // Decode HTML entities
  const textarea = document.createElement("textarea");
  textarea.innerHTML = withoutTags;
  const decoded = textarea.value;
  
  // Clean up excessive whitespace
  return decoded
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");
}

/**
 * Extracts images from markdown
 */
function extractImages(markdown: string): Array<{ url: string; alt: string }> {
  const images: Array<{ url: string; alt: string }> = [];
  
  // Match markdown images: ![alt](url) or ![alt](url "title")
  const markdownImageRegex = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let match;
  
  while ((match = markdownImageRegex.exec(markdown)) !== null) {
    images.push({
      alt: match[1] || "",
      url: match[2],
    });
  }
  
  // Also check for HTML img tags
  const htmlImageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi;
  while ((match = htmlImageRegex.exec(markdown)) !== null) {
    images.push({
      url: match[1],
      alt: match[2] || "",
    });
  }
  
  // Also check for img tags with alt before src
  const htmlImageRegex2 = /<img[^>]+alt=["']([^"']*)["'][^>]*src=["']([^"']+)["'][^>]*>/gi;
  while ((match = htmlImageRegex2.exec(markdown)) !== null) {
    images.push({
      url: match[2],
      alt: match[1] || "",
    });
  }
  
  return images;
}

/**
 * Extracts text content from markdown, preserving structure for slides
 * Now also removes image syntax to avoid duplicate text
 */
function extractSlideContent(markdown: string): string[] {
  // Remove images from markdown before processing text
  const withoutImages = markdown
    .replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, "") // Remove ![alt](url)
    .replace(/<img[^>]*>/gi, ""); // Remove <img> tags
  
  const html = marked.parse(withoutImages) as string;
  const lines: string[] = [];
  
  // Create a temporary element to parse HTML
  const temp = document.createElement("div");
  temp.innerHTML = html;
  
  // Extract text from each element, preserving some structure
  const elements = temp.querySelectorAll("h1, h2, h3, h4, h5, h6, p, li, pre, code, blockquote");
  
  elements.forEach((el) => {
    let text = el.textContent?.trim() || "";
    if (text) {
      // Add bullet for list items
      if (el.tagName === "LI") {
        text = "• " + text;
      }
      lines.push(text);
    }
  });
  
  // If no elements found, fall back to plain text
  if (lines.length === 0) {
    const plainText = markdownToPlainText(withoutImages);
    if (plainText.trim()) {
      return plainText.split("\n");
    }
  }
  
  return lines;
}

/**
 * Creates a title slide with frontmatter information
 */
function createTitleSlide(
  pptx: pptxgen,
  frontmatter: Frontmatter
): void {
  const slide = pptx.addSlide();
  
  // Background color matching the app's light theme
  slide.background = { color: "FFFFFF" };
  
  // Title - centered, large
  if (frontmatter.title) {
    slide.addText(frontmatter.title, {
      x: 0.5,
      y: 2.0,
      w: 9.0,
      h: 1.5,
      fontSize: 44,
      bold: true,
      color: "1F2937", // gray-800
      align: "center",
      valign: "middle",
    });
  }
  
  // Description/Subtitle
  if (frontmatter.description) {
    slide.addText(frontmatter.description, {
      x: 1.0,
      y: 3.7,
      w: 8.0,
      h: 0.8,
      fontSize: 20,
      color: "4B5563", // gray-600
      align: "center",
      valign: "middle",
    });
  }
  
  // Presenter and Date at the bottom
  // Check multiple possible field names for presenter
  const presenter = frontmatter.presenter || frontmatter.author || frontmatter.by || frontmatter.presenters || frontmatter.authors;
  const date = frontmatter.date;
  
  // Slide height is 5.625 inches, so position near bottom but within bounds
  let bottomY = 4.5;
  
  if (presenter) {
    slide.addText(presenter, {
      x: 1.0,
      y: bottomY,
      w: 8.0,
      h: 0.4,
      fontSize: 16,
      color: "6B7280", // gray-500
      align: "center",
    });
    bottomY += 0.5;
  }
  
  if (date) {
    slide.addText(date, {
      x: 1.0,
      y: bottomY,
      w: 8.0,
      h: 0.4,
      fontSize: 14,
      color: "9CA3AF", // gray-400
      align: "center",
    });
  }
}

/**
 * Creates a content slide from markdown
 */
async function createContentSlide(
  pptx: pptxgen,
  markdown: string
): Promise<void> {
  const slide = pptx.addSlide();
  
  // Background color matching the app's light theme
  slide.background = { color: "FFFFFF" };
  
  // Extract images first
  const images = extractImages(markdown);
  
  // Extract content lines (with images removed)
  const lines = extractSlideContent(markdown);
  
  // Check if this is an image-only slide (no text content)
  const isImageOnly = images.length > 0 && lines.length === 0;
  
  if (isImageOnly) {
    // Image-only slide: center the image(s)
    if (images.length === 1) {
      // Single image - center it and make it large
      try {
        slide.addImage({
          path: images[0].url,
          x: 1.0,
          y: 0.75,
          w: 8.0,
          h: 4.5,
          sizing: { type: "contain", w: 8.0, h: 4.5 },
        });
      } catch (error) {
        console.warn(`Failed to add image: ${images[0].url}`, error);
        // Fallback: show alt text if image fails to load
        slide.addText(images[0].alt || "Image failed to load", {
          x: 0.5,
          y: 2.5,
          w: 9.0,
          h: 1.0,
          fontSize: 18,
          color: "9CA3AF",
          align: "center",
          italic: true,
        });
      }
    } else {
      // Multiple images - arrange in a grid
      const imagesPerRow = 2;
      const imageWidth = 4.0;
      const imageHeight = 2.5;
      const spacing = 0.5;
      const startX = 1.0;
      const startY = 1.0;
      
      for (let i = 0; i < images.length; i++) {
        const row = Math.floor(i / imagesPerRow);
        const col = i % imagesPerRow;
        const x = startX + col * (imageWidth + spacing);
        const y = startY + row * (imageHeight + spacing);
        
        try {
          slide.addImage({
            path: images[i].url,
            x,
            y,
            w: imageWidth,
            h: imageHeight,
            sizing: { type: "contain", w: imageWidth, h: imageHeight },
          });
        } catch (error) {
          console.warn(`Failed to add image: ${images[i].url}`, error);
        }
      }
    }
    return;
  }
  
  // Regular slide with text (and possibly images)
  
  // Find the title (first line that looks like a heading)
  let title = "";
  let contentStartIdx = 0;
  
  // Check if first line could be a title (longer, or looks important)
  if (lines[0] && lines[0].length > 0) {
    // If first line doesn't start with bullet, treat it as title
    if (!lines[0].startsWith("•")) {
      title = lines[0];
      contentStartIdx = 1;
    }
  }
  
  // Add title if found
  if (title) {
    slide.addText(title, {
      x: 0.5,
      y: 0.5,
      w: 9.0,
      h: 0.8,
      fontSize: 32,
      bold: true,
      color: "1F2937", // gray-800
      valign: "top",
    });
  }
  
  // Determine layout based on presence of images
  const contentY = title ? 1.5 : 0.5;
  const contentLines = lines.slice(contentStartIdx);
  
  if (images.length > 0) {
    // Split layout: text on left, images on right
    const textWidth = 4.5;
    const imageWidth = 4.0;
    const imageX = 5.5;
    
    if (contentLines.length > 0) {
      const content = contentLines.join("\n");
      
      slide.addText(content, {
        x: 0.5,
        y: contentY,
        w: textWidth,
        h: 5.5,
        fontSize: 16,
        color: "374151", // gray-700
        valign: "top",
        bullet: false,
        lineSpacing: 20,
      });
    }
    
    // Add images on the right
    if (images.length === 1) {
      try {
        slide.addImage({
          path: images[0].url,
          x: imageX,
          y: contentY,
          w: imageWidth,
          h: 4.0,
          sizing: { type: "contain", w: imageWidth, h: 4.0 },
        });
      } catch (error) {
        console.warn(`Failed to add image: ${images[0].url}`, error);
      }
    } else {
      // Stack images vertically
      const imageHeight = 2.0;
      const imageSpacing = 0.3;
      
      for (let i = 0; i < Math.min(images.length, 2); i++) {
        const y = contentY + i * (imageHeight + imageSpacing);
        try {
          slide.addImage({
            path: images[i].url,
            x: imageX,
            y,
            w: imageWidth,
            h: imageHeight,
            sizing: { type: "contain", w: imageWidth, h: imageHeight },
          });
        } catch (error) {
          console.warn(`Failed to add image: ${images[i].url}`, error);
        }
      }
    }
  } else {
    // No images - full width text
    if (contentLines.length > 0) {
      const content = contentLines.join("\n");
      
      slide.addText(content, {
        x: 0.5,
        y: contentY,
        w: 9.0,
        h: 5.5,
        fontSize: 18,
        color: "374151", // gray-700
        valign: "top",
        bullet: false, // We've already added bullets to list items
        lineSpacing: 24,
      });
    }
  }
}

/**
 * Exports a presentation to PPTX format
 */
export async function exportToPptx(
  presentationName: string,
  _markdown: string,
  slides: string[],
  frontmatter: Frontmatter
): Promise<void> {
  const pptx = new pptxgen();
  
  // Set presentation properties
  pptx.author = frontmatter.presenter || "slides.md";
  pptx.title = presentationName;
  pptx.subject = frontmatter.description || presentationName;
  
  // Standard 16:9 layout (10 x 5.625 inches)
  pptx.layout = "LAYOUT_16x9";
  
  // Create title slide if frontmatter exists and first slide is title marker
  if (slides[0] === "__TITLE_SLIDE__" && Object.keys(frontmatter).length > 0) {
    createTitleSlide(pptx, frontmatter);
    
    // Process remaining content slides
    for (let i = 1; i < slides.length; i++) {
      await createContentSlide(pptx, slides[i]);
    }
  } else {
    // No title slide, process all slides as content
    for (const slide of slides) {
      await createContentSlide(pptx, slide);
    }
  }
  
  // Generate and download the file
  const sanitizedTitle = presentationName.replace(/[^a-z0-9]/gi, "_");
  const timestamp = Date.now();
  const fileName = `${sanitizedTitle}__${timestamp}.pptx`;
  await pptx.writeFile({ fileName });
}
