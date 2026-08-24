import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Table2, Upload, Copy, Check, Download, RotateCcw, ArrowUpDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import PageContainer from '../components/PageContainer';
import PageSection from '../components/PageSection';
import CustomSelect from '../components/CustomSelect';
import { usePageTitle } from '../hooks/usePageTitle';
import { useMetaTags } from '../hooks/useMetaTags';
import {
  DELIMITERS,
  EXPORT_FORMATS,
  MAX_FILE_BYTES,
  SAMPLE_CSV,
  detectDelimiter,
  parseCSV,
  toTable,
  filterRows,
  sortRows,
  paginate,
  serializeTable,
  downloadTable,
  type Delimiter,
  type ExportFormat,
} from '../utils/csvViewer';

const LABEL = 'CSV Viewer';
const DESC =
  'Open and view CSV files online in your browser. Free CSV opener with search, sort, and export — files stay on your device.';
const KEYWORDS =
  'csv viewer, free online csv viewer, open csv file in browser, csv opener online, view csv online, csv table viewer';
const FIELD =
  'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50';
const BTN = 'inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
const DELIM_OPTIONS = DELIMITERS.map((d) => d.label);
const EXPORT_OPTIONS = EXPORT_FORMATS.map((f) => f.label);

export default function CSVViewer() {
  usePageTitle(LABEL);
  useMetaTags({
    title: 'Free Online CSV Viewer & Opener | ShalConnects',
    description: DESC,
    keywords: KEYWORDS,
    ogTitle: 'Free Online CSV Viewer & Opener',
    ogDescription: DESC,
    ogImage: '/logo.png',
    twitterTitle: 'Free Online CSV Viewer & Opener',
    twitterDescription: DESC,
    twitterImage: '/logo.png',
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [raw, setRaw] = useState('');
  const [paste, setPaste] = useState('');
  const [fileName, setFileName] = useState('data.csv');
  const [delimiter, setDelimiter] = useState<Delimiter>(',');
  const [autoDelim, setAutoDelim] = useState(true);
  const [hasHeader, setHasHeader] = useState(true);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  const [query, setQuery] = useState('');
  const [sortCol, setSortCol] = useState(-1);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState(false);

  const applyData = useCallback((text: string, name = 'data.csv') => {
    setRaw(text);
    setPaste('');
    setFileName(name);
    setDelimiter(detectDelimiter(text));
    setAutoDelim(true);
    setError(null);
    setQuery('');
    setSortCol(-1);
    setPage(1);
  }, []);

  const loadFile = useCallback(async (file: File) => {
    if (file.size > MAX_FILE_BYTES) {
      setError('File is too large. Maximum size is 10 MB.');
      return;
    }
    try {
      applyData(await file.text(), file.name);
    } catch {
      setError('Could not read that file. Try a plain CSV or text file.');
    }
  }, [applyData]);

  const delim = autoDelim && raw ? detectDelimiter(raw) : delimiter;
  const parsed = useMemo(() => (raw ? parseCSV(raw, delim) : null), [raw, delim]);
  const table = useMemo(() => (parsed ? toTable(parsed, hasHeader) : null), [parsed, hasHeader]);
  const filtered = useMemo(() => (table ? filterRows(table.rows, query) : []), [table, query]);
  const sorted = useMemo(() => sortRows(filtered, sortCol, sortDir), [filtered, sortCol, sortDir]);
  const { page: safePage, totalPages, start, slice } = useMemo(() => paginate(sorted, page), [sorted, page]);

  useEffect(() => { setPage(1); }, [query, sortCol, sortDir, hasHeader, delim]);

  const onSort = (col: number) => {
    if (sortCol === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  const exportText = table ? serializeTable(table.headers, sorted, exportFormat) : '';
  const delimLabel = DELIMITERS.find((d) => d.value === delim)?.label ?? 'Comma';
  const exportLabel = EXPORT_FORMATS.find((f) => f.id === exportFormat)?.label ?? 'CSV';

  const copyAll = async () => {
    if (!exportText) return;
    try {
      await navigator.clipboard.writeText(exportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const reset = () => {
    setRaw('');
    setPaste('');
    setFileName('data.csv');
    setQuery('');
    setSortCol(-1);
    setPage(1);
    setError(null);
    dragDepth.current = 0;
    setDragOver(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const renderPagination = () => (
    <div className="flex items-center gap-2 shrink-0">
      <button type="button" className={BTN} disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)} aria-label="Previous page">
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="tabular-nums whitespace-nowrap">Page {safePage} / {totalPages}</span>
      <button type="button" className={BTN} disabled={safePage >= totalPages} onClick={() => setPage((p) => p + 1)} aria-label="Next page">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <PageLayout title={LABEL} backTo={{ href: '/tools', label: 'Back to Tools' }}>
      <PageSection>
        <PageContainer className="min-w-0">
          <div className="mb-6 max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <Table2 className="w-5 h-5 text-white" aria-hidden />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{LABEL}</h1>
            </div>
            <p className="text-gray-400 text-sm sm:text-base">
              Free online CSV viewer and opener. Drop a file, browse, or paste — search, sort, and export without uploading anything.
            </p>
          </div>

          {!raw && (
            <>
              <div
                onDragEnter={(e) => {
                  e.preventDefault();
                  dragDepth.current += 1;
                  setDragOver(true);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={(e) => {
                  e.preventDefault();
                  dragDepth.current = Math.max(0, dragDepth.current - 1);
                  if (dragDepth.current === 0) setDragOver(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  dragDepth.current = 0;
                  setDragOver(false);
                  const f = e.dataTransfer.files[0];
                  if (f) void loadFile(f);
                }}
                className={`border-2 border-dashed rounded-xl p-6 sm:p-10 text-center transition-colors mb-4 ${
                  dragOver ? 'border-blue-400 bg-blue-500/10' : 'border-gray-700 bg-gray-800/40'
                }`}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" aria-hidden />
                <p className="text-gray-300 mb-1">Drop your CSV file here</p>
                <p className="text-gray-500 text-sm mb-4 sm:hidden">Tap browse to open a file</p>
                <p className="text-gray-500 text-sm mb-4 hidden sm:block">or</p>
                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2 max-w-xs sm:max-w-none mx-auto">
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Browse file
                  </button>
                  <button type="button" onClick={() => applyData(SAMPLE_CSV, 'sample.csv')} className={BTN}>
                    Try sample
                  </button>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".csv,text/csv,text/plain,.tsv,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void loadFile(f);
                  }}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="csv-paste" className="text-sm text-gray-400 mb-1.5 block">Or paste CSV text</label>
                <textarea
                  id="csv-paste"
                  value={paste}
                  onChange={(e) => { setPaste(e.target.value); setError(null); }}
                  rows={5}
                  placeholder={'name,email,role\nAda,ada@example.com,admin'}
                  className={`font-mono text-sm mb-2 ${FIELD}`}
                />
                <button
                  type="button"
                  disabled={!paste.trim()}
                  onClick={() => applyData(paste)}
                  className={`${BTN} w-full sm:w-auto bg-blue-600 hover:bg-blue-500`}
                >
                  Open pasted CSV
                </button>
              </div>
            </>
          )}

          {error && <p className="text-red-400 text-sm mb-4" role="alert">{error}</p>}

          {table && table.headers.length > 0 && (
            <>
              <div className="space-y-3 mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="min-w-0">
                    <span className="block text-sm text-gray-400 mb-1.5">Delimiter</span>
                    <CustomSelect
                      value={delimLabel}
                      options={DELIM_OPTIONS}
                      onChange={(label) => {
                        const next = DELIMITERS.find((d) => d.label === label);
                        if (!next) return;
                        setAutoDelim(false);
                        setDelimiter(next.value);
                      }}
                      ariaLabel="CSV delimiter"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-sm text-gray-400 mb-1.5">Download as</span>
                    <CustomSelect
                      value={exportLabel}
                      options={EXPORT_OPTIONS}
                      onChange={(label) => {
                        const next = EXPORT_FORMATS.find((f) => f.label === label);
                        if (next) setExportFormat(next.id);
                      }}
                      ariaLabel="Download format"
                    />
                  </div>
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-x-4 gap-y-2 sm:pt-7">
                    <label className="flex items-center gap-2 text-sm text-gray-400">
                      <input type="checkbox" checked={autoDelim} onChange={(e) => setAutoDelim(e.target.checked)} className="rounded border-gray-600" />
                      Auto-detect
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-400">
                      <input type="checkbox" checked={hasHeader} onChange={(e) => setHasHeader(e.target.checked)} className="rounded border-gray-600" />
                      First row is header
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 min-w-0">
                    <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search rows…"
                      className={`pl-9 ${FIELD}`}
                      aria-label="Search rows"
                    />
                  </div>
                  <div className="grid grid-cols-3 sm:flex gap-2">
                    <button type="button" onClick={copyAll} className={BTN} aria-label={copied ? 'Copied' : 'Copy'}>
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button type="button" onClick={() => downloadTable(fileName, exportText, exportFormat)} className={BTN} aria-label="Download">
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Download</span>
                    </button>
                    <button type="button" onClick={reset} className={BTN} aria-label="Clear">
                      <RotateCcw className="w-4 h-4" />
                      <span className="hidden sm:inline">Clear</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2 text-sm text-gray-400">
                <p className="min-w-0 truncate" title={fileName}>
                  <span className="text-gray-300">{fileName}</span>
                  {' · '}{table.headers.length} cols · {sorted.length.toLocaleString()}
                  {query ? ` of ${table.rows.length.toLocaleString()}` : ''} rows
                  {parsed?.truncated ? ' · capped at 50,000' : ''}
                </p>
                {renderPagination()}
              </div>

              <div className="overflow-auto rounded-xl border border-gray-700 max-h-[60vh] sm:max-h-[70vh] overscroll-contain">
                <table className="min-w-full text-xs sm:text-sm">
                  <thead className="bg-gray-800 sticky top-0 z-10">
                    <tr>
                      <th className="sticky left-0 z-20 bg-gray-800 text-left font-medium text-gray-500 px-2 sm:px-3 py-2 sm:py-2.5 border-b border-r border-gray-700 w-10 sm:w-12">#</th>
                      {table.headers.map((h, i) => (
                        <th key={i} className="text-left font-medium text-gray-200 px-2 sm:px-3 py-2 sm:py-2.5 border-b border-gray-700 whitespace-nowrap">
                          <button type="button" onClick={() => onSort(i)} className="inline-flex items-center gap-1 sm:gap-1.5 hover:text-white transition-colors max-w-[10rem] sm:max-w-xs">
                            <span className="truncate">{h || `Column ${i + 1}`}</span>
                            <ArrowUpDown className={`w-3.5 h-3.5 shrink-0 ${sortCol === i ? 'text-blue-400' : 'text-gray-500'}`} aria-hidden />
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {slice.map((row, ri) => (
                      <tr key={start + ri} className="group odd:bg-gray-900/50 even:bg-gray-800/40 hover:bg-gray-700/40">
                        <td className="sticky left-0 z-[1] bg-gray-900 group-odd:bg-gray-900 group-even:bg-gray-800 group-hover:bg-gray-700 px-2 sm:px-3 py-1.5 sm:py-2 text-gray-500 border-b border-r border-gray-800/80 tabular-nums">
                          {start + ri + 1}
                        </td>
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-2 sm:px-3 py-1.5 sm:py-2 text-gray-300 border-b border-gray-800/80 whitespace-nowrap max-w-[8rem] sm:max-w-xs truncate" title={cell}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {!slice.length && (
                      <tr>
                        <td colSpan={table.headers.length + 1} className="px-3 py-8 text-center text-gray-500">No matching rows</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-3 text-sm text-gray-400 sm:hidden">
                  {renderPagination()}
                </div>
              )}
            </>
          )}

          <section className="mt-10 max-w-2xl text-sm text-gray-400 space-y-2">
            <h2 className="text-base font-semibold text-gray-200">How to open a CSV file online</h2>
            <p>
              Upload or paste a CSV, TSV, or delimited text file to preview it as a table. Search and sort columns, then copy or download the result.
              Parsing runs entirely in your browser — your data is never sent to a server.
            </p>
          </section>
        </PageContainer>
      </PageSection>
    </PageLayout>
  );
}
