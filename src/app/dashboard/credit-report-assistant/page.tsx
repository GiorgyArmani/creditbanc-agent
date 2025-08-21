'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import PDFViewer from '@/components/pdf/pdf-viewer'; // visor existente
// ^ Usa el mismo viewer con toggle + download que ya tienes :contentReference[oaicite:3]{index=3}

type ReportRow = {
  id: string;
  title: string | null;
  full_name: string | null;
  report_date: string | null;
  report_pdf_url: string | null;
  created_at: string;
};

export default function CreditReportAssistantPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('Credit Report');

  // Listado
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [listLoading, setListLoading] = useState(false);

  // UI
  const [inlineViewUrl, setInlineViewUrl] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ⚠️ Reemplaza esto por tu userId real (Supabase Auth o server-props)
  const userId = (typeof window !== 'undefined' && (window as any).__USER_ID__) || '';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (userId) refreshList();
  }, [userId]);

  async function refreshList() {
    try {
      setListLoading(true);
      const r = await fetch(`/api/reports?userId=${userId}`);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Failed to load reports');
      setReports(j.items || []);
    } catch (e: any) {
      console.error(e);
    } finally {
      setListLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, '⏳ Processing credit report...']);
    setLoading(true);
    setPdfUrl(null);
    setInlineViewUrl(null);

    try {
      // Igual que tu flujo actual: envía texto → API llama assistant → JSON → PDF
      // Esto ya lo hacías en tu page, solo que ahora refrescamos la lista cuando termina:contentReference[oaicite:4]{index=4}
      const res = await fetch('/api/generate-report' ,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creditText: input, title: 'Credit Report', userId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate report');

      setTitle(data.title || 'Credit Report');
      setMessages((prev) => [
        ...prev.slice(0, -1),
        `✅ Report ready for ${data.fullName} (date: ${data.reportDate}).`,
      ]);
      setPdfUrl(data.url);
      setInlineViewUrl(data.url); // lo mostramos abajo en el visor
      setInput('');

      // refrescar listado
      if (userId) refreshList();
    } catch (err: any) {
      setMessages((prev) => [...prev.slice(0, -1), `❌ ${err.message || 'Network error.'}`]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this report?')) return;
    try {
      const r = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Failed to delete');
      setReports((prev) => prev.filter((x) => x.id !== id));
      if (inlineViewUrl && reports.find((x) => x.id === id)?.report_pdf_url === inlineViewUrl) {
        setInlineViewUrl(null);
      }
    } catch (e: any) {
      alert(e.message || 'Delete failed');
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">💬 Credit Report Assistant</h2>
        <Link href="/dashboard">
          <Button variant="outline">← Back to Dashboard</Button>
        </Link>
      </div>

      {/* Mensajes/estado */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 h-40 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2 text-sm text-gray-700">{msg}</div>
        ))}
        {loading && <div className="text-sm text-gray-500 italic">⏳ Processing...</div>}
        <div ref={bottomRef} />
      </div>

      {/* Formulario: pegar texto del reporte */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <textarea
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-md text-sm"
          placeholder="Paste your credit report here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Generating...' : 'Generate PDF'}
        </Button>
      </form>

      {/* Visor del último generado */}
      {inlineViewUrl && (
        <div className="mb-8">
          <PDFViewer title={title} pdfUrl={inlineViewUrl} /> {/* visor con toggle + download:contentReference[oaicite:5]{index=5} */}
        </div>
      )}

      {/* Lista de reportes del usuario */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">My Reports</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshList}
            disabled={listLoading}
          >
            {listLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        <div className="rounded-md border divide-y">
          {reports.length === 0 && (
            <div className="p-4 text-sm text-gray-500">No reports yet.</div>
          )}

          {reports.map((r) => (
            <div key={r.id} className="p-3 flex items-center gap-3">
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-900">
                  {r.title || 'Credit Report'}
                </div>
                <div className="text-xs text-gray-500">
                  {r.full_name ? `Client: ${r.full_name}` : ''}{' '}
                  {r.report_date ? ` • Date: ${r.report_date}` : ''}{' '}
                  • Created: {new Date(r.created_at).toLocaleString()}
                </div>
              </div>

              <div className="flex gap-2">
                {r.report_pdf_url && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setInlineViewUrl(r.report_pdf_url!)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      <a
                        href={r.report_pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        <FileDown className="h-4 w-4 mr-1" />
                        Download
                      </a>
                    </Button>
                  </>
                )}
                <Button size="sm" variant="destructive" onClick={() => handleDelete(r.id)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
