import { describe, expect, it } from 'vitest';
import { detectDelimiter, parseCSV, filterRows, sortRows, serializeCSV, serializeTable, toTable, paginate } from '../csvViewer';

describe('csvViewer', () => {
  it('detects delimiter from first line', () => {
    expect(detectDelimiter('a;b;c\n1;2;3')).toBe(';');
    expect(detectDelimiter('a\tb\tc')).toBe('\t');
  });

  it('parses quoted fields and escapes', () => {
    const { headers, rows } = parseCSV('name,note\n"Ada","hello, ""world"""\n', ',');
    expect(headers).toEqual(['name', 'note']);
    expect(rows[0]).toEqual(['Ada', 'hello, "world"']);
  });

  it('filters, sorts, paginates, and serializes', () => {
    const rows = [['b', '2'], ['a', '10']];
    expect(filterRows(rows, 'a')).toEqual([['a', '10']]);
    expect(sortRows(rows, 1, 'asc').map((r) => r[1])).toEqual(['2', '10']);
    expect(paginate(rows, 1, 1).slice).toEqual([['b', '2']]);
    expect(serializeCSV(['n', 'v'], rows, ',')).toContain('b,2');
  });

  it('supports headerless tables', () => {
    const parsed = parseCSV('a,b\n1,2\n', ',');
    const table = toTable(parsed, false);
    expect(table.headers).toEqual(['Column 1', 'Column 2']);
    expect(table.rows).toHaveLength(2);
  });

  it('exports json and markdown', () => {
    const headers = ['n', 'v'];
    const rows = [['a', '1']];
    expect(JSON.parse(serializeTable(headers, rows, 'json'))).toEqual([{ n: 'a', v: '1' }]);
    expect(serializeTable(headers, rows, 'md')).toContain('| n | v |');
    expect(serializeTable(headers, rows, 'tsv')).toBe('n\tv\na\t1');
  });
});
