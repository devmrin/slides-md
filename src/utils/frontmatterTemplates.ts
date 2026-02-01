import { format } from "date-fns";

/**
 * Generate a sample frontmatter template with current date
 */
export function getSampleFrontmatter(): string {
  return `@@@
title: Sample presentation
description: Add presentation description
date: ${format(new Date(), "yyyyMMdd")}
presenter: My team
logo: https://slides.elnotes.com/logo.png
@@@
`;
}
