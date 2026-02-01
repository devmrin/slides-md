
/**
 * Calculates the active slide index based on the cursor line number in the markdown editor.
 * This function replicates the slide splitting and filtering logic from useSlides.ts to map
 * editor lines effectively to the viewed slide.
 * 
 * @param markdown The full markdown content
 * @param cursorLine The 1-based line number of the cursor
 * @returns The 0-based index of the slide corresponding to the cursor
 */
export function getSlideIndexFromCursor(markdown: string, cursorLine: number): number {
    if (!markdown) return 0;
    
    // Normalize newlines and split
    const lines = markdown.split(/\r?\n/);
    const totalLines = lines.length;
    
    // 1. Check Frontmatter
    let hasFrontmatter = false;
    let fmEndLine = -1; // 0-based index of last line of frontmatter
    
    // Check if first line starts with @@@ (ignoring whitespace? parseFrontmatter trims...)
    // parseFrontmatter: `const match = text.match(/^@@@([\s\S]*?)@@@/);`
    // This implies it must start at the beginning of the text.
    if (lines[0]?.trim() === "@@@") {
      // Find closing @@@
      for (let i = 1; i < totalLines; i++) {
          if (lines[i]?.trim() === "@@@") {
              hasFrontmatter = true;
              fmEndLine = i;
              break;
          }
      }
    }
  
    // If cursor is in or before frontmatter end, return 0 (Title Slide)
    // cursorLine is 1-based
    if (hasFrontmatter) {
      if (cursorLine <= fmEndLine + 1) { 
          return 0;
      }
    }
  
    // 2. Parse Raw Slides
    // We scan from fmEndLine + 1
    interface RawSlide {
      index: number;
      startLine: number; // 0-based
      endLine: number; // 0-based, inclusive of the content. (Delimiter of next slide is NOT included in content check, but acts as boundary)
      hasContent: boolean;
    }
  
    const rawSlides: RawSlide[] = [];
    let currentRawSlideStart = hasFrontmatter ? fmEndLine + 1 : 0;
    
    let inFence = false;
    let fenceChar: string | null = null;
    let fenceLen = 0;

    const isDelimiterLine = (line: string, inFenceState: boolean) => {
        return !inFenceState && (/^\s*---(?:\s+.*)?\s*$/.test(line) || /^\s*===(?:\s+.*)?\s*$/.test(line));
    };

    // Helper to finish a slide
    const finishSlide = (endLine: number) => {
      let hasContent = false;
      for (let i = currentRawSlideStart; i <= endLine; i++) {
          const line = lines[i];
          if (!line) continue;
          
          // Identify if this specific line is a delimiter
          if (isDelimiterLine(line, false)) {
              // This is a delimiter. It is structural, not content.
              continue; 
          }
          
          if (line.trim().length > 0) {
              hasContent = true;
              break;
          }
      }
      
      rawSlides.push({
          index: rawSlides.length,
          startLine: currentRawSlideStart,
          endLine,
          hasContent
      });
    };
  
    for (let i = (hasFrontmatter ? fmEndLine + 1 : 0); i < totalLines; i++) {
        const line = lines[i];

        // Track code fences
        const fenceMatch = line.match(/^\s*(```+|~~~+)(.*)$/);
        if (fenceMatch) {
            const fence = fenceMatch[1];
            const char = fence[0];
            if (!inFence) {
                inFence = true;
                fenceChar = char;
                fenceLen = fence.length;
            } else if (fenceChar === char && fence.length >= fenceLen) {
                inFence = false;
                fenceChar = null;
                fenceLen = 0;
            }
        }

        // Check for delimiter
        if (isDelimiterLine(line, inFence)) {
            // This line starts a new slide.
            // The PREVIOUS slide ends at i - 1.
            if (i > (hasFrontmatter ? fmEndLine + 1 : 0)) {
                 finishSlide(i - 1);
            }
            currentRawSlideStart = i; 
        }
    }
    // Finish last slide
    finishSlide(totalLines - 1);
  
    // 3. Filter Logic (Replicating useSlides)
    // useSlides:
    // - Filter out empty slides (content.trim().length === 0)
    // - UNLESS they are between two non-empty slides ("intentional")
    // - Leading/Trailing empty slides are always removed.
  
    const keptIndices = new Set<number>();
    
    // We need to know which raw slides are effectively "kept".
    // Note: useSlides iterates `slides` array.
    // My `rawSlides` corresponds to that array.
    
    rawSlides.forEach((slide, i) => {
      if (slide.hasContent) {
          keptIndices.add(i);
      } else {
          // Check surrounding
          // We need content before and after in the sequence of raw slides
          const hasContentBefore = rawSlides.slice(0, i).some(s => s.hasContent);
          const hasContentAfter = rawSlides.slice(i + 1).some(s => s.hasContent);
          if (hasContentBefore && hasContentAfter) {
              keptIndices.add(i);
          }
      }
    });
  
    // 4. Map Raw Slides to Final Index
    const rawToFinalMap = new Map<number, number>();
    let currentFinalIndex = hasFrontmatter ? 1 : 0; // If FM exists, title is 0, first content is 1.
  
    rawSlides.forEach((_, i) => {
        if (keptIndices.has(i)) {
            rawToFinalMap.set(i, currentFinalIndex);
            currentFinalIndex++;
        }
    });
  
    // 5. Determine Cursor Slide
    const cursorZero = cursorLine - 1;
    
    // Find which raw slide the cursor is in.
    const inRawSlide = rawSlides.find(s => cursorZero >= s.startLine && cursorZero <= s.endLine);
  
    if (!inRawSlide) {
        // Fallback: if cursor is past end? (Should be covered by last slide going to totalLines-1)
        // If file is empty?
        return 0; 
    }
  
    // If the raw slide is kept, return its index.
    if (keptIndices.has(inRawSlide.index)) {
        return rawToFinalMap.get(inRawSlide.index)!;
    }
  
    // If not kept (it's empty and leading/trailing)
    // If leading (before any kept slide):
    const firstKeptRawIndex = rawSlides.findIndex(s => keptIndices.has(s.index));
    
    if (firstKeptRawIndex === -1) {
        // No slides kept at all.
        return 0;
    }
  
    if (inRawSlide.index < firstKeptRawIndex) {
        // Leading empty slide -> map to Title (0) if FM exists, or First content (0 or 1).
        // If FM exists, 0 is Title. 
        // If not, 0 is first content.
        // If I am editing empty space before first slide, I probably want to see the first slide (or title).
        return 0; 
    } else {
        // Trailing empty slide -> map to last kept slide.
        // We find the last kept raw index.
        let lastKeptRawIndex = -1;
        for (let k = rawSlides.length - 1; k >= 0; k--) {
            if (keptIndices.has(k)) {
                lastKeptRawIndex = k;
                break;
            }
        }
        return rawToFinalMap.get(lastKeptRawIndex)!;
    }
  }
