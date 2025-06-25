import { openai } from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

// Types for parsing messages
type TextBlock = {
  type: 'text';
  text?: { value: string };
};

type CodeBlock = {
  type: 'code';
  text: string;
  language?: string;
};

type ThreadMessage = {
  content: (TextBlock | CodeBlock)[];
};

// ✅ OPTIONS preflight
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

// ✅ POST handler
export async function POST(req: NextRequest) {
  const { creditText } = await req.json();

  if (!creditText) {
    return NextResponse.json({ error: 'Missing creditText' }, {
      status: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    // Step 1: Create thread
    const thread = await openai.beta.threads.create();

    // Step 2: Add user message
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: `Here is a new credit report:\n\n${creditText}`,
    });

    // Step 3: Run assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: 'asst_M0u0phtt14WrV0FYOHB3yDqF',
    });

    // Step 4: Poll until complete
    let runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });

    while (!['completed', 'failed', 'cancelled', 'expired'].includes(runStatus.status)) {
      await new Promise((res) => setTimeout(res, 2000));
      runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
    }

    if (runStatus.status !== 'completed') {
      throw new Error(`Run failed with status: ${runStatus.status}`);
    }

    // Step 5: Extract messages
    const messages = await openai.beta.threads.messages.list(thread.id);

    const textBlocks: string[] = messages.data.flatMap((m: any) =>
      (m.content ?? [])
        .filter(
          (c: any) =>
            (c.type === 'text' && !!c.text?.value) ||
            (c.type === 'code' && c.language === 'html' && !!c.text)
        )
        .map((c: any) => c.type === 'text' ? c.text.value : c.text)
    );

    // Step 6: Select HTML/Markdown/Links
    const html = textBlocks.find((t) => t.includes('<html>')) || '';
    const markdown = textBlocks.find((t) =>
      t.trim().startsWith('#') ||
      t.includes('**Client Information') ||
      t.includes('```')
    ) || '';

    if (!html || !markdown) {
      return NextResponse.json({ error: 'Markdown or HTML output not found' }, {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Step 7: Convert HTML to PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    // Step 8: Upload PDF to Supabase
    const filename = `${Date.now()}_CreditBanc_Report.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('reports')
      .upload(`pdfs/${filename}`, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      throw new Error('Supabase upload failed: ' + uploadError.message);
    }

    // Step 9: Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('reports')
      .getPublicUrl(uploadData.path);

    const publicPdfUrl = publicUrlData.publicUrl;

    return NextResponse.json({
      html,
      markdown,
      pdfUrl: publicPdfUrl,
      message: 'Report generation and upload successful.',
    }, {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
    return NextResponse.json({ error: errorMessage }, {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}

// ✅ Disable body parser for streaming
export const config = {
  api: {
    bodyParser: false,
  },
};
