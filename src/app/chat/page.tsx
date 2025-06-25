// src/app/chat/page.tsx

'use client';

import { useState } from 'react';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
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
        if (data.downloadUrl) {
          reply += `\n\n📄 [Download HTML Report](${data.downloadUrl})`;
        }
        setMessages(prev => [...prev, reply]);
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

      <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 15, height: 300, overflowY: 'auto', background: '#f9f9f9', marginBottom: 20 }}>
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
    </div>
  );
}
