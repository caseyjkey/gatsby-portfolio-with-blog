export function extractPreview(raw: string, maxLen = 250) {
  if (!raw) return '';

  const withoutFrontmatter = raw.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
  const withoutCodeBlocks = withoutFrontmatter.replace(/```[\s\S]*?```/g, '');
  const withoutJsx = withoutCodeBlocks.replace(/<[^>]+>/g, ' ');

  const paragraphs = withoutJsx
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const firstMeaningful =
    paragraphs.find((paragraph) => !/^#{1,6}\s/.test(paragraph) && !/^[-*_]{3,}$/.test(paragraph)) ?? '';

  const text = firstMeaningful
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= maxLen) return text;
  const clipped = text.slice(0, maxLen);
  return `${clipped.replace(/\s+\S*$/, '').trim()}…`;
}
