/** Client-side CSV parse / filter / sort / export helpers. */

export type Delimiter = ',' | ';' | '\t' | '|';

export const DELIMITERS: { value: Delimiter; label: string }[] = [
  { value: ',', label: 'Comma' },
  { value: ';', label: 'Semicolon' },
  { value: '\t', label: 'Tab' },
  { value: '|', label: 'Pipe' },
];

export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_ROWS = 50_000;
export const PAGE_SIZE = 100;

export const SAMPLE_CSV =
  'name,email,role,joined\nAda Lovelace,ada@example.com,admin,2024-01-12\nAlan Turing,alan@example.com,analyst,2024-03-02\nGrace Hopper,grace@example.com,engineer,2023-11-18\nKatherine Johnson,kate@example.com,scientist,2025-06-01';

export function detectDelimiter(text: string): Delimiter {
  const line = text.split(/\r?\n/).find((l) => l.trim()) ?? '';
  let best: Delimiter = ',';
  let bestCount = -1;
  for (const d of DELIMITERS) {
    const n = line.split(d.value).length - 1;
    if (n > bestCount) {
      bestCount = n;
      best = d.value;
    }
  }
  return best;
}

/** RFC4180-ish parse; returns header + data rows (capped). */
export function parseCSV(text: string, delimiter: Delimiter): { headers: string[]; rows: string[][]; truncated: boolean } {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  const src = text.replace(/^\uFEFF/, '');

  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === delimiter) {
      row.push(field);
      field = '';
    } else if (c === '\n' || (c === '\r' && src[i + 1] === '\n')) {
      if (c === '\r') i++;
      row.push(field);
      field = '';
      if (row.some((cell) => cell.length) || row.length > 1) rows.push(row);
      row = [];
      if (rows.length > MAX_ROWS) break;
    } else if (c !== '\r') field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    if (row.some((cell) => cell.length) || row.length > 1) rows.push(row);
  }

  const truncated = rows.length > MAX_ROWS;
  const limited = truncated ? rows.slice(0, MAX_ROWS) : rows;
  if (!limited.length) return { headers: [], rows: [], truncated: false };

  const width = Math.max(...limited.map((r) => r.length));
  const normalized = limited.map((r) => {
    const copy = r.slice();
    while (copy.length < width) copy.push('');
    return copy;
  });

  return { headers: normalized[0], rows: normalized.slice(1), truncated };
}

/** Treat first row as header or as data. */
export function toTable(parsed: { headers: string[]; rows: string[][] }, hasHeader: boolean) {
  if (hasHeader) return parsed;
  const width = parsed.headers.length;
  return {
    headers: Array.from({ length: width }, (_, i) => `Column ${i + 1}`),
    rows: [parsed.headers, ...parsed.rows],
  };
}

export function filterRows(rows: string[][], query: string): string[][] {
  const q = query.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((row) => row.some((cell) => cell.toLowerCase().includes(q)));
}

export function sortRows(rows: string[][], col: number, dir: 'asc' | 'desc'): string[][] {
  if (col < 0) return rows;
  const mul = dir === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const av = a[col] ?? '';
    const bv = b[col] ?? '';
    const an = Number(av);
    const bn = Number(bv);
    if (av !== '' && bv !== '' && !Number.isNaN(an) && !Number.isNaN(bn)) return (an - bn) * mul;
    return av.localeCompare(bv, undefined, { sensitivity: 'base', numeric: true }) * mul;
  });
}

export function paginate<T>(rows: T[], page: number, size = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(rows.length / size) || 1);
  const p = Math.min(Math.max(1, page), totalPages);
  const start = (p - 1) * size;
  return { page: p, totalPages, start, slice: rows.slice(start, start + size) };
}

function escapeCell(value: string, delimiter: Delimiter): string {
  return /["\r\n]/.test(value) || value.includes(delimiter)
    ? `"${value.replace(/"/g, '""')}"`
    : value;
}

export function serializeCSV(headers: string[], rows: string[][], delimiter: Delimiter): string {
  return [headers, ...rows].map((r) => r.map((c) => escapeCell(c, delimiter)).join(delimiter)).join('\n');
}

export type ExportFormat = 'csv' | 'tsv' | 'json' | 'md';

export const EXPORT_FORMATS: { id: ExportFormat; label: string; ext: string; mime: string }[] = [
  { id: 'csv', label: 'CSV', ext: 'csv', mime: 'text/csv;charset=utf-8' },
  { id: 'tsv', label: 'TSV', ext: 'tsv', mime: 'text/tab-separated-values;charset=utf-8' },
  { id: 'json', label: 'JSON', ext: 'json', mime: 'application/json' },
  { id: 'md', label: 'Markdown', ext: 'md', mime: 'text/markdown;charset=utf-8' },
];

export function serializeTable(headers: string[], rows: string[][], format: ExportFormat): string {
  if (format === 'json') {
    return JSON.stringify(
      rows.map((r) => Object.fromEntries(headers.map((h, i) => [h || `col${i + 1}`, r[i] ?? '']))),
      null,
      2,
    );
  }
  if (format === 'md') {
    const esc = (c: string) => c.replace(/\|/g, '\\|');
    const line = (cells: string[]) => `| ${cells.map(esc).join(' | ')} |`;
    return [line(headers), `| ${headers.map(() => '---').join(' | ')} |`, ...rows.map(line)].join('\n');
  }
  return serializeCSV(headers, rows, format === 'tsv' ? '\t' : ',');
}

export function downloadTable(filename: string, content: string, format: ExportFormat): void {
  const meta = EXPORT_FORMATS.find((f) => f.id === format)!;
  const base = filename.replace(/\.[^.]+$/, '') || 'data';
  // UTF-8 BOM helps Excel open CSV correctly
  const payload = format === 'csv' ? `\uFEFF${content.replace(/^\uFEFF/, '')}` : content;
  const blob = new Blob([payload], { type: meta.mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${base}.${meta.ext}`;
  a.click();
  URL.revokeObjectURL(url);
}

