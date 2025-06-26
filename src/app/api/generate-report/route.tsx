
import { openai } from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import HtmlToPdf from '@/components/pdf/html-to-pdf'; // ✅ use your new component

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req: NextRequest) {
  const { creditText } = await req.json();

  if (!creditText) {
    return NextResponse.json({ error: 'Missing creditText' }, { status: 400 });
  }

  try {
    // Assistant run
    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: `Here is a new credit report:\n\n${creditText}`,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: 'asst_M0u0phtt14WrV0FYOHB3yDqF',
    });

    let runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
    while (!['completed', 'failed', 'cancelled', 'expired'].includes(runStatus.status)) {
      await new Promise((res) => setTimeout(res, 2000));
      runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
    }

    if (runStatus.status !== 'completed') {
      throw new Error(`Run failed with status: ${runStatus.status}`);
    }

    const messages = await openai.beta.threads.messages.list(thread.id);
    const textBlocks = messages.data.flatMap((m: any) =>
      (m.content ?? []).filter(
        (c: any) =>
          (c.type === 'text' && !!c.text?.value) ||
          (c.type === 'code' && ['html', 'markdown'].includes(c.language || '') && !!c.text)
      ).map((c: any) => c.type === 'text' ? c.text.value : c.text)
    );

    const html = textBlocks.find((t: string) =>
  t.includes('<img') || t.includes('<table') || t.includes('<strong>')) || '';

    const markdown = textBlocks.find((t: string) =>
      t.trim().startsWith('#') || t.includes('**Client Information') || t.includes('| Bureau |')) || '';

    if (!html || !markdown) {
      return NextResponse.json({ error: 'Expected outputs not found in assistant response' }, { status: 500 });
    }

    // ✅ Render PDF from raw HTML string using HtmlToPdf
    const pdfBuffer = await renderToBuffer(<HtmlToPdf html={html} />);

    const filename = `${Date.now()}_CreditBanc_Report.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('reports')
      .upload(`pdfs/${filename}`, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) throw new Error(uploadError.message);

    const { data: publicUrlData } = supabase.storage.from('reports').getPublicUrl(uploadData.path);

    return NextResponse.json({
      html,
      markdown,
      pdfUrl: publicUrlData.publicUrl,
      message: 'Report generation and upload successful.',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
