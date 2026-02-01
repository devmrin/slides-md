/**
 * Downloads markdown content as a file
 * @param markdown The markdown content to download
 * @param presentationName The name of the presentation
 */
export function exportMarkdown(markdown: string, presentationName: string) {
  // Create UTC timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  
  // Sanitize presentation name for filename
  const sanitizedName = presentationName.replace(/[^a-z0-9_-]/gi, "_");
  
  // Create filename
  const filename = `${sanitizedName}_${timestamp}.md`;
  
  // Create blob and download
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
