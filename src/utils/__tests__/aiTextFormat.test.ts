import { describe, it, expect } from 'vitest';
import { detectAIText, escapeHtml, formatForRichPreview } from '../aiTextFormat';

describe('aiTextFormat', () => {
  it('escapes HTML entities', () => {
    expect(escapeHtml('<b>"x"&\'')).toBe('&lt;b&gt;&quot;x&quot;&amp;&#39;');
  });

  it('detects markdown-heavy AI text', () => {
    const result = detectAIText("Here's a **bold** list:\n- one\n- two\n```code```");
    expect(result.detected).toBe(true);
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('formats rich preview safely', () => {
    const html = formatForRichPreview('Hello <script>\n\n• Item');
    expect(html).toContain('<p>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('<li>Item</li>');
  });
});
