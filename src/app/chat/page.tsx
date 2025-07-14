'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from "lucide-react";
import Link from 'next/link';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

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
        setPdfUrl(data.pdfUrl);
      } else {
        setMessages(prev => [...prev, `❌ Error: ${data.error}`]);
      }
    } catch (err) {
      setMessages(prev => [...prev, `❌ Network error.`]);
    }

    setInput('');
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">💬 Credit Report Assistant</h2>
        <Link href="/dashboard">
          <Button variant="outline">← Back to Dashboard</Button>
        </Link>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 h-80 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-3 whitespace-pre-wrap text-sm text-gray-700">{msg}</div>
        ))}
        {loading && <div>⏳ Processing...</div>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-md text-sm"
          placeholder="Paste your credit report here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Summary'}
        </Button>
      </form>

      {pdfUrl && (
  <div className="mt-6 flex justify-center">
    <Button
      asChild
      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
    >
      <a
        href={pdfUrl}
        download // fuerza descarga si el navegador lo soporta
        target="_blank" // lo abre en otra pestaña si el navegador lo permite
        rel="noopener noreferrer"
        className="flex items-center gap-2"
      >
        <FileDown className="h-5 w-5" />
        Download Credit Report!
      </a>
    </Button>
  </div>
)}
    </div>
  );
}
