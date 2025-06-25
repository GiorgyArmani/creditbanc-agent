'use client';

import { useState } from 'react';

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
        setPdfUrl(data.pdfUrl || null);
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
    <div style={{ maxWidth: '700px', margin: 'auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>💬 Credit Report Assistant</h2>

      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: 8,
          padding: 15,
          height: 300,
          overflowY: 'auto',
          background: '#f9f9f9',
          marginBottom: 20,
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>{msg}</div>
        ))}
        {loading && <div>⏳ Processing...</div>}
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          rows={5}
          style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
          placeholder="Paste your credit report here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          style={{
            marginTop: 10,
            padding: '12px 20px',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            width: '100%',
          }}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Summary'}
        </button>
      </form>

      {pdfUrl && (
        <div style={{ marginTop: 30 }}>
          <a
            href={pdfUrl}
            download
            style={{
              display: 'inline-block',
              background: '#10b981',
              color: 'white',
              padding: '10px 16px',
              borderRadius: 6,
              textDecoration: 'none',
            }}
          >
            📄 Download PDF Report
          </a>

          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            style={{ marginTop: 20, border: '1px solid #ccc' }}
          />
        </div>
      )}
    </div>
  );
}
