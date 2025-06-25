'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, `You: ${input}`]);
    setLoading(true);

    try {
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creditText: input }),
      });
      const data = await res.json();

      if (res.ok) {
        let reply = '';
        if (data.markdown) {
          reply += `\n\nAssistant (Summary):\n${data.markdown}`;
        }
        setMessages(prev => [...prev, reply]);
        if (data.pdfUrl) setPdfUrl(data.pdfUrl);
      } else {
        setMessages(prev => [...prev, `❌ Error: ${data.error}`]);
      }
    } catch (err) {
      setMessages(prev => [...prev, '❌ Network error.']);
    }

    setInput('');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Credit Banc Assistant</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              Premium Member
            </Badge>
            <Link href="/dashboard">
              <Button variant="outline" className="text-sm">← Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="bg-white/80 shadow-sm border border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900">💬 Credit Report Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 h-64 overflow-y-auto p-4 bg-slate-50 rounded border border-slate-200">
              {messages.map((msg, idx) => (
                <div key={idx} className="mb-4 whitespace-pre-wrap text-slate-700">{msg}</div>
              ))}
              {loading && <div>⏳ Processing...</div>}
            </div>

            <form onSubmit={handleSubmit}>
              <textarea
                rows={5}
                className="w-full border border-slate-300 p-3 rounded-md focus:outline-none focus:ring focus:ring-emerald-300"
                placeholder="Paste your credit report here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button
                type="submit"
                className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Credit Report'}
              </Button>
            </form>

            {/* PDF download / preview */}
            {pdfUrl && (
              <div className="mt-6 space-y-4">
                <a
                  href={pdfUrl}
                  download
                  className="block text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  📄 Download PDF Report
                </a>

                {/* Optional embedded preview */}
                <iframe src={pdfUrl} width="100%" height="600px" className="border rounded" />
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
