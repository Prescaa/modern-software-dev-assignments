/**
 * Extracts action items from note content
 * Finds lines that:
 * 1. Start with "TODO:" (case-insensitive)
 * 2. End with "!"
 */
export function extractActionItems(content: string): string[] {
  if (!content) return [];

  const lines = content.split('\n');
  const actionItems: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Check if line starts with TODO: (case-insensitive)
    if (trimmedLine.match(/^TODO:/i)) {
      const item = trimmedLine.replace(/^TODO:\s*/i, '').trim();
      if (item) {
        actionItems.push(item);
      }
    }
    // Check if line ends with !
    else if (trimmedLine.endsWith('!') && trimmedLine.length > 1) {
      actionItems.push(trimmedLine);
    }
  }

  return actionItems;
}
